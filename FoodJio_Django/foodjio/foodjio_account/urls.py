from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register.as_view()),
    # path('login', views.login.as_view()),
    path('jwtdetails/', views.JwtDetails.as_view())
]