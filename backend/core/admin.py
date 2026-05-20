from django.contrib import admin
from .models import CompanySettings

@admin.register(CompanySettings)
class CompanySettingsAdmin(admin.ModelAdmin):
    list_display = ('name', 'till_number', 'paypal_enabled', 'card_enabled')
    fieldsets = (
        ('Company Information', {
            'fields': ('name', 'description', 'logo')
        }),
        ('M-Pesa Settings', {
            'fields': ('till_number', 'till_name')
        }),
        ('PayPal Settings', {
            'fields': ('paypal_enabled', 'paypal_email')
        }),
        ('Card Payment Settings', {
            'fields': ('card_enabled',)
        }),
        ('Support Contact', {
            'fields': ('support_email', 'support_phone', 'whatsapp_number')
        }),
        ('Theme & Security', {
            'fields': ('primary_color', 'secondary_color', 'ssl_secured', 'verified_business', 'secure_payment')
        }),
    )
    readonly_fields = ('ssl_secured', 'verified_business', 'secure_payment')