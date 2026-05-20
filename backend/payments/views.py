import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import PaymentSession
from .serializers import PaymentSessionSerializer
from .daraja import initiate_stk_push, generate_dynamic_qr, query_stk_status

logger = logging.getLogger(__name__)

class PaymentSessionViewSet(viewsets.ModelViewSet):
    queryset = PaymentSession.objects.all()
    serializer_class = PaymentSessionSerializer

    @action(detail=True, methods=['post'], url_path='stk-push')
    def stk_push(self, request, pk=None):
        """
        Initiate M-Pesa STK Push for this payment session.
        """
        session = self.get_object()
        phone_number = request.data.get('phone', session.phone)
        
        if not phone_number:
            return Response(
                {"error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        logger.info(f"Initiating STK Push for Session {session.id} to phone {phone_number} amount {session.amount}")
        
        # Trigger STK Push via Daraja API
        res = initiate_stk_push(phone_number, session.amount, session.id)
        
        if "error" in res:
            return Response(
                {"error": res["error"], "details": res.get("details", "")},
                status=status.HTTP_502_BAD_GATEWAY
            )
            
        checkout_request_id = res.get('CheckoutRequestID')
        response_code = res.get('ResponseCode')
        
        if response_code == '0' and checkout_request_id:
            # Successfully initiated, update session
            session.checkout_request_id = checkout_request_id
            session.phone = phone_number
            session.status = 'pending'
            session.save()
            return Response({
                "message": "STK Push initiated successfully. Please enter your PIN on your phone.",
                "checkout_request_id": checkout_request_id
            })
        else:
            return Response(
                {"error": "Failed to initiate STK Push", "details": res.get('ResponseDescription', '')},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'], url_path='qr-code')
    def qr_code(self, request, pk=None):
        """
        Generate dynamic QR code for this payment session.
        """
        session = self.get_object()
        logger.info(f"Generating dynamic QR Code for Session {session.id}")
        
        # In sandbox mode, if Daraja is not configured or fails, we can check if it returns None.
        # Reference number is set as the Session ID
        qr_base64 = generate_dynamic_qr(session.amount, session.id)
        
        if qr_base64:
            return Response({"qr_code": qr_base64})
        else:
            # Fallback mock QR code generation using a standard mock base64 if not configured
            # (Allows local testing to continue if API keys are missing)
            logger.warning("Daraja QR generation failed or keys missing. Returning a generic base64 QR placeholder.")
            # A tiny 1x1 green pixel base64 as placeholder or none
            return Response(
                {
                    "qr_code": None,
                    "warning": "Daraja API not configured. You can still test using the 'Simulate Callback' feature."
                },
                status=status.HTTP_200_OK
            )

    @action(detail=True, methods=['get'], url_path='status')
    def check_status(self, request, pk=None):
        """
        Check the status of this payment session.
        If pending and checkout_request_id exists, try querying Daraja.
        """
        session = self.get_object()
        
        # If pending and has checkout_request_id, try querying Safaricom as fallback in case webhook failed
        if session.status == 'pending' and session.checkout_request_id:
            logger.info(f"Checking Daraja status query for session {session.id} (ID: {session.checkout_request_id})")
            query_res = query_stk_status(session.checkout_request_id)
            if query_res and 'ResultCode' in query_res:
                result_code = int(query_res.get('ResultCode'))
                result_desc = query_res.get('ResultDesc', '')
                
                if result_code == 0:
                    session.status = 'completed'
                    session.result_code = result_code
                    session.result_desc = result_desc
                    # Extract receipt if present
                    session.mpesa_receipt_number = "STK_QUERY_OK"
                    session.save()
                elif result_code not in [1032, 1037, 2001]: # Not explicitly timed out/cancelled yet, or is failed
                    session.status = 'failed'
                    session.result_code = result_code
                    session.result_desc = result_desc
                    session.save()
                    
        return Response({
            "status": session.status,
            "mpesa_receipt_number": session.mpesa_receipt_number,
            "result_code": session.result_code,
            "result_desc": session.result_desc
        })

    @action(detail=True, methods=['post'], url_path='simulate-success')
    def simulate_success(self, request, pk=None):
        """
        Simulate a successful payment webhook callback for testing.
        """
        session = self.get_object()
        logger.info(f"Simulating payment success for Session {session.id}")
        
        session.status = 'completed'
        session.mpesa_receipt_number = f"MOCK{session.id}XYZ"
        session.result_code = 0
        session.result_desc = "Simulated local payment success for testing"
        session.save()
        
        return Response({
            "message": "Payment simulation successful.",
            "status": session.status,
            "mpesa_receipt_number": session.mpesa_receipt_number
        })

@method_decorator(csrf_exempt, name='dispatch')
class MpesaCallbackView(APIView):
    """
    Webhook callback handler for Safaricom Daraja API.
    Handles STK Push response callbacks and C2B transaction confirmation.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        logger.info(f"Received Safaricom Daraja Callback webhook: {data}")
        
        # 1. Handle STK Push Callbacks (Body -> stkCallback)
        if 'Body' in data and 'stkCallback' in data['Body']:
            stk_callback = data['Body']['stkCallback']
            checkout_request_id = stk_callback.get('CheckoutRequestID')
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            
            try:
                session = PaymentSession.objects.get(checkout_request_id=checkout_request_id)
                session.result_code = result_code
                session.result_desc = result_desc
                
                if result_code == 0:
                    session.status = 'completed'
                    # Extract callback metadata items
                    metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
                    for item in metadata:
                        if item.get('Name') == 'MpesaReceiptNumber':
                            session.mpesa_receipt_number = item.get('Value')
                else:
                    session.status = 'failed'
                    
                session.save()
                logger.info(f"Updated session {session.id} status to {session.status} from STK Push callback")
            except PaymentSession.DoesNotExist:
                logger.error(f"Received STK callback for unknown checkout_request_id: {checkout_request_id}")
                
        # 2. Handle C2B Confirmation Callbacks (starts with TransactionType, TransID, BillRefNumber)
        elif 'BillRefNumber' in data and 'TransID' in data:
            bill_ref = data.get('BillRefNumber', '').strip()
            trans_id = data.get('TransID')
            amount = data.get('TransAmount')
            
            # Extract numbers from BillRefNumber in case it is "REF12" or similar
            session_id = None
            if bill_ref.isdigit():
                session_id = int(bill_ref)
            else:
                # Extract digits
                digits = ''.join(c for c in bill_ref if c.isdigit())
                if digits:
                    session_id = int(digits)
                    
            if session_id:
                try:
                    session = PaymentSession.objects.get(id=session_id)
                    session.status = 'completed'
                    session.mpesa_receipt_number = trans_id
                    session.result_code = 0
                    session.result_desc = f"C2B Confirmation: Receipt {trans_id}, Paid {amount}"
                    session.save()
                    logger.info(f"Updated session {session.id} status to completed from C2B callback")
                except PaymentSession.DoesNotExist:
                    logger.error(f"Received C2B callback for unknown BillRefNumber/session_id: {session_id}")
                    
        return Response({"ResultCode": 0, "ResultDesc": "Callback processed successfully"})