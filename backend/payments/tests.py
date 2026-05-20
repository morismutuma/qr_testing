from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from .models import PaymentSession

class PaymentSessionTests(APITestCase):
    def setUp(self):
        self.session = PaymentSession.objects.create(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone="254712345678",
            country="Kenya",
            currency="KES",
            amount=10.00,
            payment_method="mpesa",
            status="pending"
        )

    def test_payment_session_creation(self):
        url = reverse('paymentsession-list')
        data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "phone": "254787654321",
            "country": "Kenya",
            "currency": "KES",
            "amount": 150.00,
            "payment_method": "mpesa"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PaymentSession.objects.count(), 2)

    @patch('payments.views.initiate_stk_push')
    def test_stk_push_initiation(self, mock_stk):
        mock_stk.return_value = {
            "ResponseCode": "0",
            "CheckoutRequestID": "ws_CO_123456",
            "CustomerMessage": "Success"
        }
        url = reverse('paymentsession-stk-push', args=[self.session.id])
        response = self.client.post(url, {"phone": "254712345678"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify db updated
        self.session.refresh_from_db()
        self.assertEqual(self.session.checkout_request_id, "ws_CO_123456")

    def test_simulate_success(self):
        url = reverse('paymentsession-simulate-success', args=[self.session.id])
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, "completed")
        self.assertTrue(self.session.mpesa_receipt_number.startswith("MOCK"))

    def test_mpesa_callback_stk_success(self):
        self.session.checkout_request_id = "ws_CO_123456"
        self.session.save()
        
        url = reverse('mpesa-callback')
        callback_payload = {
            "Body": {
                "stkCallback": {
                    "MerchantRequestID": "12345",
                    "CheckoutRequestID": "ws_CO_123456",
                    "ResultCode": 0,
                    "ResultDesc": "Success",
                    "CallbackMetadata": {
                        "Item": [
                            {"Name": "Amount", "Value": 10.00},
                            {"Name": "MpesaReceiptNumber", "Value": "NLX1234567"},
                            {"Name": "PhoneNumber", "Value": 254712345678}
                        ]
                    }
                }
            }
        }
        response = self.client.post(url, callback_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, "completed")
        self.assertEqual(self.session.mpesa_receipt_number, "NLX1234567")
