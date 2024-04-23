from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register.as_view()),
    path('login/', views.CustomTokenObtainPairView.as_view()),
    path('seeduser/', views.seeduser.as_view()),

    path('update/', views.update_user.as_view()),

    path('delete/inteloper/<str:pk>/', views.delete_target_user.as_view()),
    path('jwtdetails/', views.JwtDetails.as_view())
]