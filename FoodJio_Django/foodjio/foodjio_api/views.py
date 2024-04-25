from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CuisineType, Meet, MeetParticipants
from .serializers import MeetSerializer, CuisineSerializer, SubscribeSerializer, GetMeetSerializer
from foodjio_account.models import Account
from foodjio_account.serializers import AuthorSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from collections import defaultdict
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
        serializer = GetMeetSerializer(meet_instance, many=True)
        return Response(serializer.data)


class get_active_meets(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        meet_instance = Meet.objects.filter(active=True)
        serializer = GetMeetSerializer(meet_instance, many=True)
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
        serializer = GetMeetSerializer(meet_instance, many=False)

        cuisine_type = meet_instance.cuisinetype
        if cuisine_type:
            serializer.data['cuisinetype'] = cuisine_type.name

        return Response(serializer.data)


class put_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user = request.user  # Get the user from the JWT token
        data = request.data.copy()  # Create a copy of the request data
        data['author'] = user.id  # Add {author: user_ID} to the data
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
            meet.active = False
            meet.save()

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
            meet.currentnum += 1
            meet.save()

            return Response('user subscribed')
        return Response(serializer.errors)

class unsubscribe_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self,request,pk):
        meet=Meet.objects.get(id=pk)
        user = request.user
        print (meet.author_id)
        if str(meet.author_id) == str(user.id):
            return Response('you cannot remove yourself from your own meet')
        try:
            subscription = MeetParticipants.objects.get(meet=meet.id, account=user.id)

            if subscription:
                subscription.delete()
                meet.currentnum -= 1
                meet.save()

                return Response('user unsubscribed')
        except MeetParticipants.DoesNotExist:
            return Response('meeting/user not found')

class get_all_participants(APIView):
    def get(self, request):
        meet_participants = MeetParticipants.objects.values('meet_id', 'account_id')
        result = {}
        for entry in meet_participants:
            meet_id = str(entry['meet_id'])
            account_id = entry['account_id']
            if meet_id not in result:
                result[meet_id] = []
            result[meet_id].append(account_id)

        serialized_result = {}
        for meet_id, account_ids in result.items():
            users = Account.objects.filter(id__in=account_ids)
            serialized_users = AuthorSerializer(users, many=True).data
            serialized_result[meet_id] = serialized_users

        return Response(serialized_result)

class get_meet_participants(APIView):
    def get(self, request, pk):
        meet_participants = MeetParticipants.objects.filter(meet_id=pk).values('account_id')
        account_ids = [entry['account_id'] for entry in meet_participants]

        if not account_ids:
            return Response({"error": "No participants found for meet_id {}".format(pk)})

        users = Account.objects.filter(id__in=account_ids)
        serialized_users = AuthorSerializer(users, many=True).data

        return Response(serialized_users)