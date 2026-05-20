from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from payments.views import PaymentSessionViewSet, MpesaCallbackView

router = DefaultRouter()
router.register(r'payment-session', PaymentSessionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/', include('core.urls')),
    path('api/payments/mpesa/callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
]