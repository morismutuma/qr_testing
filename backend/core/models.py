from django.db import models

class CompanySettings(models.Model):
    name = models.CharField(max_length=100, default='RealEdge Africa Venture ltd')
    description = models.TextField(default="RealEdge Africa Ventures is a global travel destinations' agent in Kenya specializing in Beach, Mountain Hiking adventures, Health & wellness, wildlife safari and Cultural experiences. We package your travel to fit your budget retaining great experience.")
    logo = models.URLField(blank=True, null=True)
    ssl_secured = models.BooleanField(default=True)
    verified_business = models.BooleanField(default=True)
    secure_payment = models.BooleanField(default=True)
    till_number = models.CharField(max_length=20, blank=True)
    till_name = models.CharField(max_length=100, blank=True)
    paypal_enabled = models.BooleanField(default=True)
    paypal_email = models.EmailField(blank=True, default='')
    card_enabled = models.BooleanField(default=True)
    support_email = models.EmailField(blank=True, default='')
    support_phone = models.CharField(max_length=20, blank=True, default='')
    whatsapp_number = models.CharField(max_length=20, blank=True, default='254798400295')
    primary_color = models.CharField(max_length=7, default='#9370ff')
    secondary_color = models.CharField(max_length=7, default='#7d4fff')

    def __str__(self):
        return self.name