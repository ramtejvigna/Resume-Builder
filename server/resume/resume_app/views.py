import os
from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests
from .serializers import UserRegistrationSerializer, UserSerializer, SocialAuthSerializer

User = get_user_model()

# Create your views here.
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if email and password:
        user = authenticate(email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    serializer = SocialAuthSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data.get('credential') or serializer.validated_data.get('token')
        if not token:
            return Response({'error': 'Token or credential is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Specify your client ID as the audience
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                os.getenv('GOOGLE_OAUTH2_KEY')
            )
            
            # Check if the token is issued by Google
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            picture = idinfo.get('picture', '')
            
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create username from email if it doesn't exist
            username = email.split('@')[0]
            
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'first_name': first_name,
                    'last_name': last_name,
                    'profile_picture': picture,
                    'provider': 'google'
                }
            )
            
            if not created and not user.provider:
                user.provider = 'google'
                user.profile_picture = picture
                user.save()

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def linkedin_auth(request):
    serializer = SocialAuthSerializer(data=request.data)
    if serializer.is_valid():
        access_token = serializer.validated_data['access_token']
        
        try:
            # Get user profile from LinkedIn
            profile_response = requests.get(
                'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=10
            )
            
            email_response = requests.get(
                'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=10
            )
            
            if profile_response.status_code != 200 or email_response.status_code != 200:
                return Response({'error': 'Failed to fetch LinkedIn profile'}, status=status.HTTP_400_BAD_REQUEST)
            
            profile_data = profile_response.json()
            email_data = email_response.json()
            
            # Extract user information
            email = email_data['elements'][0]['handle~']['emailAddress']
            first_name = profile_data.get('firstName', {}).get('localized', {}).get('en_US', '')
            last_name = profile_data.get('lastName', {}).get('localized', {}).get('en_US', '')
            
            # Extract profile picture
            picture = ''
            if 'profilePicture' in profile_data:
                picture_data = profile_data['profilePicture'].get('displayImage~', {})
                if 'elements' in picture_data and picture_data['elements']:
                    picture = picture_data['elements'][-1]['identifiers'][0]['identifier']
            
            # Get or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'profile_picture': picture,
                    'provider': 'linkedin'
                }
            )
            
            if not created and not user.provider:
                user.provider = 'linkedin'
                user.profile_picture = picture
                user.save()
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            
        except Exception as e:
            return Response({'error': 'Invalid LinkedIn token'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def profile(request):
    return Response(UserSerializer(request.user).data)

@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)

