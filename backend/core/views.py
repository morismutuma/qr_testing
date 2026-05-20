from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .models import CompanySettings
from .serializers import CompanySettingsSerializer

def home(request):
    return JsonResponse({
        "message": "QR Payment API Running",
        "status": "active",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/",
            "payments": "/api/payment-session/",
            "mpesa_callback": "/api/payments/mpesa/callback/",
            "settings": "/api/settings/"
        }
    })

class CompanySettingsView(APIView):
    def get(self, request):
        settings = CompanySettings.objects.first()
        if not settings:
            settings = CompanySettings.objects.create()
        serializer = CompanySettingsSerializer(settings)
        return Response(serializer.data)