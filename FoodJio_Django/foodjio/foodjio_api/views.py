from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CuisineType


from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.

class helloworld(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_admin:
            return Response('hello Admin')
        else:
            return Response ('hello world')

class seedcuisine(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        if request.user.is_admin:
            CuisineType.objects.all().delete()

            cuisinels = [
                'Asian', 'Western', 'European', 'South American', 'American', 'Japanese', 'Mediterranean',
                'Muslim', 'Korean', 'Vietnamese', 'Thai', 'French', 'German', 'Mexican', 'Dessert'
            ]
            for i, cuisine in enumerate(cuisinels, start=1):
                CuisineType.objects.get_or_create(id=i, name=cuisine)
            return Response('seed complete')
        else:
            return Response('You are not authorized to perform this action', status=403)


