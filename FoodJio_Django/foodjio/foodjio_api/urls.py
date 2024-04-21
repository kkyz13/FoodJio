from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld.as_view()),
    path('seedcuisine/', views.seedcuisine.as_view()),
    path('getmeets/', views.get_meets.as_view()),
    path('getonemeet/<str:pk>/', views.get_one_meet.as_view()),
    path('addmeet/', views.put_meet.as_view()),
    path('updatemeet/<str:pk>/',views.patch_meet.as_view()),
    path('deletemeet/<str:pk>/', views.delete_meet.as_view())

]

