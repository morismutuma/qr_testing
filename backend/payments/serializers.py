from rest_framework import serializers
from .models import PaymentSession

class PaymentSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSession
        fields = '__all__'