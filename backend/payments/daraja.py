import base64
import logging
from datetime import datetime
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def get_access_token():
    """
    Get OAuth access token from Safaricom Daraja API.
    """
    consumer_key = settings.DARAJA_CONSUMER_KEY
    consumer_secret = settings.DARAJA_CONSUMER_SECRET
    
    # Check if credentials are placeholders or empty
    if not consumer_key or not consumer_secret or 'placeholder' in consumer_key or not consumer_key.strip():
        logger.warning("Daraja API key credentials are not configured or are placeholders.")
        return None
        
    base_url = "https://sandbox.safaricom.co.ke" if settings.DARAJA_ENV == 'sandbox' else "https://api.safaricom.co.ke"
    token_url = f"{base_url}/oauth/v1/generate?grant_type=client_credentials"
    
    try:
        response = requests.get(token_url, auth=(consumer_key, consumer_secret), timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get('access_token')
    except Exception as e:
        logger.error(f"Error fetching Daraja access token: {str(e)}")
        return None

def generate_dynamic_qr(amount, ref_no):
    """
    Generate dynamic QR code using Safaricom Dynamic QR Code API.
    Returns: Base64 string of the QR code image or None.
    """
    token = get_access_token()
    if not token:
        logger.error("Failed to generate dynamic QR code due to missing access token.")
        return None
        
    base_url = "https://sandbox.safaricom.co.ke" if settings.DARAJA_ENV == 'sandbox' else "https://api.safaricom.co.ke"
    qr_url = f"{base_url}/mpesa/qrcode/v1/generate"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    shortcode = settings.DARAJA_BUSINESS_SHORTCODE
    # TrxCode mapping: 'BG' for Buy Goods (Till number), 'PB' for Paybill.
    trx_code = 'BG' if len(str(shortcode)) == 7 or len(str(shortcode)) == 6 else 'PB'
    
    payload = {
        "MerchantName": settings.DARAJA_CALLBACK_URL.split('//')[-1].split('/')[0] or "RealEdge Africa",
        "RefNo": str(ref_no),
        "Amount": int(amount) if float(amount) % 1 == 0 else float(amount),
        "TrxCode": trx_code,
        "CPI": str(shortcode),
        "Size": "300"
    }
    
    try:
        response = requests.post(qr_url, json=payload, headers=headers, timeout=10)
        response_data = response.json()
        logger.info(f"Daraja QR response: {response_data}")
        if response_data.get('ResponseCode') == '00':
            return response_data.get('QRCode')
        else:
            logger.error(f"Daraja QR error response: {response_data.get('ResponseDescription')}")
            return None
    except Exception as e:
        logger.error(f"Error calling Daraja QR API: {str(e)}")
        return None

def initiate_stk_push(phone_number, amount, ref_no):
    """
    Trigger Lipa Na M-Pesa Online STK Push.
    Returns: dict with ResponseCode, CheckoutRequestID, CustomerMessage or error info.
    """
    token = get_access_token()
    if not token:
        return {"error": "Authentication failed", "details": "Could not fetch access token from Daraja."}
        
    base_url = "https://sandbox.safaricom.co.ke" if settings.DARAJA_ENV == 'sandbox' else "https://api.safaricom.co.ke"
    stk_url = f"{base_url}/mpesa/stkpush/v1/processrequest"
    
    # Sanitize phone number: strip + and check if it starts with 254
    phone = str(phone_number).replace('+', '').strip()
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('7') or phone.startswith('1'):
        phone = '254' + phone
    
    if not phone.startswith('254') or len(phone) != 12:
        return {"error": "Invalid phone number", "details": "Phone number must be a valid Safaricom number (e.g., 254712345678)."}
        
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    shortcode = settings.DARAJA_BUSINESS_SHORTCODE
    passkey = settings.DARAJA_PASSKEY
    
    # Password = base64(shortcode + passkey + timestamp)
    data_to_encode = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(data_to_encode.encode()).decode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "BusinessShortCode": int(shortcode),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline", # Works for sandbox shortcode 174379
        "Amount": int(amount) if float(amount) % 1 == 0 else float(amount),
        "PartyA": int(phone),
        "PartyB": int(shortcode),
        "PhoneNumber": int(phone),
        "CallBackURL": settings.DARAJA_CALLBACK_URL,
        "AccountReference": f"REF{ref_no}",
        "TransactionDesc": f"Payment for Session {ref_no}"
    }
    
    try:
        response = requests.post(stk_url, json=payload, headers=headers, timeout=15)
        response_data = response.json()
        logger.info(f"Daraja STK push response: {response_data}")
        return response_data
    except Exception as e:
        logger.error(f"Error calling Daraja STK Push API: {str(e)}")
        return {"error": "API Request failed", "details": str(e)}

def query_stk_status(checkout_request_id):
    """
    Query the status of an STK Push transaction.
    """
    token = get_access_token()
    if not token:
        return None
        
    base_url = "https://sandbox.safaricom.co.ke" if settings.DARAJA_ENV == 'sandbox' else "https://api.safaricom.co.ke"
    query_url = f"{base_url}/mpesa/stkpushquery/v1/query"
    
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    shortcode = settings.DARAJA_BUSINESS_SHORTCODE
    passkey = settings.DARAJA_PASSKEY
    
    data_to_encode = f"{shortcode}{passkey}{timestamp}"
    password = base64.b64encode(data_to_encode.encode()).decode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "BusinessShortCode": int(shortcode),
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id
    }
    
    try:
        response = requests.post(query_url, json=payload, headers=headers, timeout=10)
        return response.json()
    except Exception as e:
        logger.error(f"Error calling Daraja STK Status API: {str(e)}")
        return None
