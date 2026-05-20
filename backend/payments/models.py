from django.db import models

class PaymentSession(models.Model):
    PAYMENT_METHODS = [
        ('mpesa', 'M-Pesa'),
        ('paypal', 'PayPal'),
        ('card', 'Card'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    country = models.CharField(max_length=100)
    currency = models.CharField(max_length=3)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    # Safaricom Daraja specific fields
    checkout_request_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)
    result_code = models.IntegerField(blank=True, null=True)
    result_desc = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.amount} {self.currency} ({self.status})"