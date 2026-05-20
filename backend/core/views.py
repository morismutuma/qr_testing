from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CompanySettings
from .serializers import CompanySettingsSerializer

class CompanySettingsView(APIView):
    def get(self, request):
        settings = CompanySettings.objects.first()
        if not settings:
            settings = CompanySettings.objects.create()
        serializer = CompanySettingsSerializer(settings)
        return Response(serializer.data)