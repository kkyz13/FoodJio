from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CuisineType, Meet, MeetParticipants
from .serializers import MeetSerializer, CuisineSerializer, SubscribeSerializer, GetMeetSerializer, FlagSerializer
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
                'American', 'Asian', 'Chinese', 'Dessert', 'European', 'French', 'German', 'Indian',
                'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Muslim', 'South American',
                'Thai', 'Vietnamese', 'Western'
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


class get_query_meets(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        parameters = request.GET.dict()
        filters = {}
        if 'active' in parameters:
            active_value = request.GET.get('active')
            if active_value.lower() == 'true':
                filters['active'] = True
            elif active_value.lower() == 'false':
                filters['active'] = False
        if 'isfull' in parameters:
            is_full_value = request.GET.get('isfull')
            if is_full_value.lower() == 'true':
                filters['is_full'] = True
            elif is_full_value.lower() == 'false':
                filters['is_full'] = False
        if 'author' in parameters:
            author = request.GET.get('author')
            filters['author_id'] = author
        if 'cuisinetype' in parameters:
            cuisinetype_id = request.GET.get('cuisinetype')
            if cuisinetype_id != '0':
                filters['cuisinetype_id'] = cuisinetype_id
        meet_instance = Meet.objects.filter(**filters)
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
            return Response(serializer.errors, status=400)

class flag_meet(APIView):
    permission_classes = (IsAuthenticated,)
    def patch(self, request, pk):
        meet = Meet.objects.get(id=pk)
        serializer = FlagSerializer(instance=meet, data=request.data,)
        if serializer.is_valid():
            serializer.save()
            return Response('meet flagged')
        else:
            return Response(serializer.errors, status=400)


class delete_meet(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, pk):
        meet =Meet.objects.get(id=pk)
        user_id = request.user.id  # Get the user ID from the JWT token
        user = Account.objects.get(id=user_id)  # Get the user object from the Account model

        if user.is_admin:
            if meet.active == True:
                meet.active = False
                meet.save()
                return Response('Admin Privileges: meet made inactive')
            elif meet.active == False:
                meet.active = True
                meet.save()
                return Response('Admin Privileges: meet restored')

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
            if meet.currentnum == meet.maxnum:
                meet.is_full = True
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
            return Response({'error': 'You cannot remove yourself from your own meet'}, status=403)
        try:
            subscription = MeetParticipants.objects.get(meet=meet.id, account=user.id)

            if subscription:
                subscription.delete()
                meet.currentnum -= 1
                meet.is_full = False
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

class get_meet_for_one_participant(APIView):
    def get(self, request, pk):
        meet_participants = MeetParticipants.objects.filter(account_id=pk).values('meet_id')
        meet_ids = [entry['meet_id'] for entry in meet_participants]

        if not meet_ids:
            return Response({"error": "No meets found for account {}".format(pk)})

        meets = Meet.objects.filter(id__in=meet_ids)
        serialized_meets = GetMeetSerializer(meets, many=True).data
        for entry in serialized_meets:
            print (entry['author']['id'])
            if pk == entry['author']['id']:
                entry['is_going'] = False
            else:
                entry['is_going'] = True
        return Response(serialized_meets)