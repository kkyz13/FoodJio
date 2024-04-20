from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld.as_view()),
    path('seedcuisine/', views.seedcuisine.as_view())
]

