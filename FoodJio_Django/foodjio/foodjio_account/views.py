from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from django.utils.timezone import now
from .models import Account
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.

class register(APIView):
    def post(self, request):
        # serializer = UserSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data)
        # else:
        #     return Response(serializer.errors)
        try:
            Account.objects.create_user(request.data["email"], request.data["name"], request.data["hpnum"], request.data["password"])

        except Exception as e:
            return Response({"message": str(e)}, status=400)

        else:
            return Response("user created")

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"] = user.name
        token["email"] = user.email
        token["is_admin"] = user.is_superuser
        token["img"] = user.img
        if user.last_login:
            token['last_login'] = user.last_login.strftime('%d/%m/%Y')
        else:
            token['last_login'] = now().strftime('%d/%m/%Y')

        user.last_login=now()
        user.save(update_fields=['last_login'])
        # if not user.is_active:
        #     return Response ({'detail': 'User account is disabled'})

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class get_all_user(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request):
        user_instance = Account.objects.all()
        serializer = UserSerializer(user_instance, many=True)
        return Response(serializer.data)
class get_user(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request, pk):
        user_instance = Account.objects.get(id=pk)
        serializer = UserSerializer(user_instance, many=False)
        return Response(serializer.data)
class update_user(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        token = request.auth
        id_from_token = token.payload['user_id'] #This is a str
        user = Account.objects.get(id=id_from_token)
        print(f"User before update: {user}")
        id_from_db = str(user.id) #This was a UUID type
        if not isinstance(token, AccessToken):
            return Response({'error': 'Invalid token'}, status=401)

        if id_from_token != id_from_db:
            return Response({'error': 'Unauthorized'}, status=403)

        serializer = UserSerializer(instance=user, data=request.data, partial=True)
        if 'old_password' in request.data:
            password = request.data['old_password']
            if not user.check_password(password):
                return Response({'error': 'Incorrect password'}, status=403)
            if 'new_password' in request.data:
                new_password = request.data['new_password']
                user.set_password(new_password)
                user.save()
                return Response('password updated')

        else:
            return Response({'error': 'Missing password'}, status=403)

        if serializer.is_valid():
            serializer.save()
            print(f"User after update: {user}")
            return Response('user updated')
        else:
            return Response(serializer.errors, status=400)


class delete_user(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request):
        token = request.auth
        id_from_token = token.payload['user_id'] #This is a str
        user = Account.objects.get(id=id_from_token)
        id_from_db = str(user.id) #This was a UUID type
        if not isinstance(token, AccessToken):
            return Response({'error': 'Invalid token'}, status=401)

        if id_from_token != id_from_db:
            return Response({'error': 'Unauthorized'}, status=403)

        if request.user.is_admin:
            user.is_active = False
            user.save()
        return Response({'message': 'User is made inactive successfully'}, status=200)

class delete_target_user(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, pk):
        inteloper = Account.objects.get(id=pk)
        if request.user.is_admin:
            inteloper.is_active = False
            inteloper.save()
        return Response({'message': 'User is made inactive successfully'}, status=200)
class JwtDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        response = JWTAuthentication().authenticate(request)
        if response is not None:
            account, token = response

            is_admin = account.is_admin
            username = account.name
            img = account.img
            # Add isAdmin to the response payload
            payload = token.payload
            payload['isAdmin'] = is_admin
            payload['name'] = username
            payload['img'] = img
            print(response)
            print(account)
            print(account.id)

            return Response(token.payload)

class seeduser(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.is_admin:
            Account.objects.create(
                id="4bd056d8-6c7b-40e9-83d6-86d7eea170cf",
                email="Jbravo@mail.com",
                name="Johnny Bravo",
                hpnum="1237777",
                password="pbkdf2_sha256$720000$9g8qYnoePSlz9enlEWT6Fo$Be+Wo+MdjD/PYjT4Lcs2dbg2UItR4a09U0mBYNOXOiw=")
            return Response('user seed complete')
        else:
            return Response('You do not have sufficient privileges', status=403)
