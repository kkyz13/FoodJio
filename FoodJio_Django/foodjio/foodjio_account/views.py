from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
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
        serializer = UserSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)



# class login(APIView):
#     def post(self, request):
#         email = request.data['email']
#         password = request.data['password']
#
#         user = Account.objects.filter(email=email).first()
#         if user is None:
#             raise AuthenticationFailed('login error')
#
#         if not user.check_password(password):
#             raise AuthenticationFailed('login error')
#
#         return Response({'message': 'success'})


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


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

        if serializer.is_valid():
            serializer.save()
            print(f"User after update: {user}")
            return Response('user updated')
        else:
            return Response(serializer.errors)


# class delete_user(APIView):
#     permission_classes = (IsAuthenticated,)
#
#     def delete(self, request):
class JwtDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        response = JWTAuthentication().authenticate(request)
        if response is not None:
            account, token = response

            is_admin = account.is_admin

            # Add isAdmin to the response payload
            payload = token.payload
            payload['isAdmin'] = is_admin

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
