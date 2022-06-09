from django.urls import path
from .views import drop_sim

urlpatterns = [
    path('',drop_sim)
]
