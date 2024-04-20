from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from .models import Account
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# Create your views here.

class register(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

class login(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = Account.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed('login error')

        if not user.check_password(password):
            raise AuthenticationFailed('login error')

        return Response({'message': 'success'})

class JwtDetails(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        response = JWTAuthentication().authenticate(request)
        if response is not None:
            account, token = response

            # Assuming isAdmin is a field in your User model
            is_admin = account.is_admin  # or account.isAdmin, depending on your field name

            # Add isAdmin to the response payload
            payload = token.payload
            payload['isAdmin'] = is_admin

            print(response)
            print(account)
            print(account.id)

            return Response(token.payload)