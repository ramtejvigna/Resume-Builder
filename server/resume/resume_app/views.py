import os
from django.shortcuts import render, get_object_or_404
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests
from .serializers import (
    UserRegistrationSerializer, UserSerializer, SocialAuthSerializer,
    UserProfileSerializer, ResumeSerializer, ResumeListSerializer, 
    ResumeTemplateSerializer
)
from .models import Resume, ResumeTemplate
from django.http import HttpResponse
from django.template.loader import render_to_string
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
from io import BytesIO
import uuid

User = get_user_model()

# Authentication Views
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
    return Response(UserProfileSerializer(request.user).data)

@api_view(['PUT', 'PATCH'])
def update_profile(request):
    serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)

# Resume Template Views
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def resume_templates(request):
    templates = ResumeTemplate.objects.all().order_by('-ats_score', 'name')
    serializer = ResumeTemplateSerializer(templates, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def resume_template_detail(request, template_id):
    template = get_object_or_404(ResumeTemplate, id=template_id)
    serializer = ResumeTemplateSerializer(template)
    return Response(serializer.data)

# Resume CRUD Views
@api_view(['GET'])
def user_resumes(request):
    resumes = Resume.objects.filter(user=request.user)
    serializer = ResumeListSerializer(resumes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_resume(request):
    data = request.data.copy()
    data['user'] = request.user.id
    serializer = ResumeSerializer(data=data)
    if serializer.is_valid():
        resume = serializer.save(user=request.user)
        return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def resume_detail(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    serializer = ResumeSerializer(resume)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
def update_resume(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    serializer = ResumeSerializer(resume, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_resume(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    resume.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# PDF Generation View
@api_view(['POST'])
def generate_resume_pdf(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id, user=request.user)
    
    try:
        # Create PDF buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        # Get styles
        styles = getSampleStyleSheet()
        
        # Create custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            textColor='#2E86AB'
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=12
        )
        
        # Build PDF content
        story = []
        
        # Personal Info
        personal_info = resume.personal_info
        if personal_info.get('name'):
            story.append(Paragraph(personal_info['name'], title_style))
        
        contact_info = []
        if personal_info.get('email'):
            contact_info.append(personal_info['email'])
        if personal_info.get('phone'):
            contact_info.append(personal_info['phone'])
        if personal_info.get('linkedin'):
            contact_info.append(personal_info['linkedin'])
        
        if contact_info:
            story.append(Paragraph(' | '.join(contact_info), normal_style))
        
        story.append(Spacer(1, 12))
        
        # Professional Summary
        if resume.professional_summary:
            story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
            story.append(Paragraph(resume.professional_summary, normal_style))
        
        # Experience
        if resume.experience:
            story.append(Paragraph("EXPERIENCE", heading_style))
            for exp in resume.experience:
                exp_title = f"<b>{exp.get('jobTitle', '')}</b> at {exp.get('company', '')}"
                story.append(Paragraph(exp_title, normal_style))
                
                exp_details = f"{exp.get('location', '')} | {exp.get('startDate', '')} - {exp.get('endDate', '')}"
                story.append(Paragraph(exp_details, normal_style))
                
                if exp.get('description'):
                    story.append(Paragraph(exp['description'], normal_style))
                story.append(Spacer(1, 6))
        
        # Education
        if resume.education:
            story.append(Paragraph("EDUCATION", heading_style))
            for edu in resume.education:
                edu_title = f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}"
                story.append(Paragraph(edu_title, normal_style))
                
                edu_details = f"{edu.get('location', '')} | {edu.get('graduationDate', '')}"
                story.append(Paragraph(edu_details, normal_style))
                story.append(Spacer(1, 6))
        
        # Skills
        if resume.skills:
            story.append(Paragraph("SKILLS", heading_style))
            skills_text = ', '.join([skill.get('name', '') for skill in resume.skills if skill.get('name')])
            story.append(Paragraph(skills_text, normal_style))
        
        # Projects
        if resume.projects:
            story.append(Paragraph("PROJECTS", heading_style))
            for proj in resume.projects:
                proj_title = f"<b>{proj.get('name', '')}</b>"
                story.append(Paragraph(proj_title, normal_style))
                
                if proj.get('description'):
                    story.append(Paragraph(proj['description'], normal_style))
                
                if proj.get('technologies'):
                    story.append(Paragraph(f"Technologies: {proj['technologies']}", normal_style))
                story.append(Spacer(1, 6))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        
        # Create response
        response = HttpResponse(buffer.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{resume.title}.pdf"'
        
        return response
        
    except Exception as e:
        return Response({'error': f'Failed to generate PDF: {str(e)}'}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

