from django.urls import path
from . import views

urlpatterns = [
    path('helloworld/', views.helloworld.as_view()),
    path('seedcuisine/', views.seedcuisine.as_view()),

    path('meets/', views.get_meets.as_view()),
    path('getctype/', views.get_ctype.as_view()),
    path('meets/active/', views.get_active_meets.as_view()),
    path('meets/<str:pk>/', views.get_one_meet.as_view()),

    path('meet/add/', views.put_meet.as_view()),
    path('meet/update/<str:pk>/',views.patch_meet.as_view()),
    path('meet/delete/<str:pk>/', views.delete_meet.as_view()),

    path('meet/<str:pk>/subscribe/', views.subscribe_meet.as_view()),
    path('meet/<str:pk>/unsubscribe/', views.unsubscribe_meet.as_view()),

    path('participant/count/', views.count_all_participants.as_view()),
    path('participant/<str:pk>/count/', views.count_meet_participants.as_view())
]

