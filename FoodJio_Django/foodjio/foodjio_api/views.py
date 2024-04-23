from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CuisineType, Meet, MeetParticipants
from .serializers import MeetSerializer, CuisineSerializer, SubscribeSerializer
from foodjio_account.models import Account
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

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

    def get(self, request):
        meet_instance = Meet.objects.all()
        serializer = MeetSerializer(meet_instance, many=True)
        return Response(serializer.data)


class get_active_meets(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        meet_instance = Meet.objects.filter(active=True)
        serializer = MeetSerializer(meet_instance, many=True)
        return Response(serializer.data)

class get_ctype(APIView):

    def get(self, request):
        meet_instance = CuisineType.objects.all()
        serializer = CuisineSerializer(meet_instance, many=True)
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
        user = request.user  # Get the user from the JWT token
        data = request.data.copy()  # Create a copy of the request data
        data['author'] = user.id  # Add the user's ID to the data
        serializer = MeetSerializer(data=data)

        if serializer.is_valid():
            meet = serializer.save()  # Save the meet to the database
            MeetParticipants.objects.create(meet=meet, account=user)  # Create a new MeetParticipants instance
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class patch_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request, pk):
        meet = Meet.objects.get(id=pk)
        user = request.user  # Get the user from the JWT token

        if meet.author.id != user.id:
            return Response({'error': 'You are not authorized to update this meet'}, status=403)
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
        user = request.user  # Get the user from the JWT token

        if meet.author.id != user.id:
            return Response({'error': 'You are not authorized to update this meet'}, status=403)
        else:
            meet.delete()

        return Response('meet deleted')

class subscribe_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self,request,pk):
        meet = Meet.objects.get(id=pk)
        user = request.user
        # userinfo = Account.objects.get(user.id)

        serializer = SubscribeSerializer(data={
            'account':user.id,
            'meet':meet.id
        })

        if serializer.is_valid():
            serializer.save()
            return Response('user subscribed')
        return Response(serializer.errors)

class unsubscribe_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self,request,pk):
        meet=Meet.objects.get(id=pk)
        user = request.user
        try:
            subscription = MeetParticipants.objects.get(meet=meet.id, account=user.id)

            if subscription:
                subscription.delete()
                return Response('user unsubscribed')
        except MeetParticipants.DoesNotExist:
            return Response('meeting/user not found')

class count_all_participants(APIView):
    def get(self, request):
        meet_participants = MeetParticipants.objects.values('meet').annotate(member_count=Count('id'))
        return Response(meet_participants)

class count_meet_participants(APIView):
    def get(self, request, pk):

        meet_participants = MeetParticipants.objects.filter(meet=pk).values('meet').annotate(member_count=Count('id'))
        return Response(meet_participants)