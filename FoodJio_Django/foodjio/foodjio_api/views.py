from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CuisineType, Meet, MeetParticipants
from .serializers import MeetSerializer

from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.

class helloworld(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_admin:
            return Response('hello Admin')
        else:
            return Response('hello world')


class seedcuisine(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
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
            return Response('You do not have sufficient privileges', status=403)


class get_meets(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        meet_instance = Meet.objects.all()
        serializer = MeetSerializer(meet_instance, many=True)
        return Response(serializer.data)


class get_one_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        meet_instance = Meet.objects.get(id=pk)
        serializer = MeetSerializer(meet_instance, many=False)
        return Response(serializer.data)


class put_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        serializer = MeetSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class patch_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request, pk):
        meet = Meet.objects.get(id=pk)
        serializer = MeetSerializer(instance=meet, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response('meet updated')
        else:
            return Response(serializer.errors)

class delete_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, pk):
        meet =Meet.objects.get(id=pk)
        meet.delete()

        return Response('meet deleted')