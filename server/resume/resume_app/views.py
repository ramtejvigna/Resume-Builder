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
from reportlab.lib.units import inch, mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping
from io import BytesIO
import uuid

User = get_user_model()

def get_font_family(font_family):
    """Get the appropriate font family with fallbacks."""
    # Extract the first font from the font-family string
    primary_font = font_family.split(',')[0].strip().strip('"\'')
    
    # Map of font families to their ReportLab equivalents
    font_map = {
        'Calibri': 'Helvetica',  # Fallback to Helvetica
        'Arial': 'Helvetica',    # Fallback to Helvetica
        'Helvetica': 'Helvetica',
        'Times New Roman': 'Times-Roman',
        'Times': 'Times-Roman',
        'Courier': 'Courier',
        'Georgia': 'Times-Roman',  # Fallback to Times-Roman
        'Lora': 'Times-Roman',     # Fallback to Times-Roman
        'sans-serif': 'Helvetica',
        'serif': 'Times-Roman',
        'monospace': 'Courier'
    }
    
    # Return the mapped font or default to Helvetica
    return font_map.get(primary_font, 'Helvetica')

def convert_to_points(value, default=12):
    """Convert CSS units (px, pt, in) to points for PDF generation."""
    if not value:
        return default
    
    # Remove any whitespace
    value = str(value).strip()
    
    # Extract number and unit
    number = ''
    unit = ''
    for char in value:
        if char.isdigit() or char == '.':
            number += char
        else:
            unit += char
    
    try:
        number = float(number)
    except ValueError:
        return default
    
    # Convert to points based on unit
    if unit == 'px':
        # Approximate conversion: 1px ≈ 0.75pt
        return number * 0.75
    elif unit == 'pt':
        return number
    elif unit == 'in':
        return number * 72  # 1 inch = 72 points
    elif unit == 'mm':
        return number * 2.83465  # 1 mm ≈ 2.83465 points
    else:
        return default

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
        
        # Get template styles
        template = resume.template
        if not template:
            return Response({'error': 'No template selected for this resume'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Get template styles
        css_styles = template.css_styles
        layout_config = template.layout_config
        
        # Set margins based on template
        margins = css_styles.get('margins', {})
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=convert_to_points(margins.get('right', '0.5in')),
            leftMargin=convert_to_points(margins.get('left', '0.5in')),
            topMargin=convert_to_points(margins.get('top', '0.5in')),
            bottomMargin=convert_to_points(margins.get('bottom', '0.5in'))
        )
        
        # Get styles
        styles = getSampleStyleSheet()
        
        # Get font family with fallback
        font_family = get_font_family(css_styles.get('fontFamily', 'Helvetica, sans-serif'))
        
        # Create custom styles based on template
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontName=font_family,
            fontSize=convert_to_points(css_styles.get('fontSize', '18pt')),
            spaceAfter=convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '30pt')),
            alignment=1,  # Center alignment
            textColor=css_styles.get('colors', {}).get('primary', '#000000')
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontName=font_family,
            fontSize=convert_to_points(css_styles.get('fontSize', '14pt')),
            spaceAfter=convert_to_points(css_styles.get('spacing', {}).get('itemSpacing', '12pt')),
            textColor=css_styles.get('colors', {}).get('accent', '#2E86AB'),
            fontStyle='bold'
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontName=font_family,
            fontSize=convert_to_points(css_styles.get('fontSize', '10pt')),
            spaceAfter=convert_to_points(css_styles.get('spacing', {}).get('itemSpacing', '12pt')),
            textColor=css_styles.get('colors', {}).get('secondary', '#333333'),
            leading=convert_to_points(css_styles.get('fontSize', '10pt')) * float(css_styles.get('lineHeight', '1.4'))
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
        
        story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
        
        # Get sections order from template
        sections_order = layout_config.get('sections_order', [
            'summary', 'experience', 'education', 'skills', 'projects'
        ])
        
        # Process sections in the specified order
        for section in sections_order:
            if section == 'summary' and resume.professional_summary:
                story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
                story.append(Paragraph(resume.professional_summary, normal_style))
                story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
            
            elif section == 'experience' and resume.experience:
                story.append(Paragraph("EXPERIENCE", heading_style))
                for exp in resume.experience:
                    exp_title = f"<b>{exp.get('jobTitle', '')}</b> at {exp.get('company', '')}"
                    story.append(Paragraph(exp_title, normal_style))
                    
                    exp_details = f"{exp.get('location', '')} | {exp.get('startDate', '')} - {exp.get('endDate', '')}"
                    story.append(Paragraph(exp_details, normal_style))
                    
                    if exp.get('description'):
                        story.append(Paragraph(exp['description'], normal_style))
                    story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('itemSpacing', '6pt'))))
                story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
            
            elif section == 'education' and resume.education:
                story.append(Paragraph("EDUCATION", heading_style))
                for edu in resume.education:
                    edu_title = f"<b>{edu.get('degree', '')}</b> - {edu.get('institution', '')}"
                    story.append(Paragraph(edu_title, normal_style))
                    
                    edu_details = f"{edu.get('location', '')} | {edu.get('graduationDate', '')}"
                    story.append(Paragraph(edu_details, normal_style))
                    story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('itemSpacing', '6pt'))))
                story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
            
            elif section == 'skills' and resume.skills:
                story.append(Paragraph("SKILLS", heading_style))
                skills_text = ', '.join([skill.get('name', '') for skill in resume.skills if skill.get('name')])
                story.append(Paragraph(skills_text, normal_style))
                story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
            
            elif section == 'projects' and resume.projects:
                story.append(Paragraph("PROJECTS", heading_style))
                for proj in resume.projects:
                    proj_title = f"<b>{proj.get('name', '')}</b>"
                    story.append(Paragraph(proj_title, normal_style))
                    
                    if proj.get('description'):
                        story.append(Paragraph(proj['description'], normal_style))
                    
                    if proj.get('technologies'):
                        story.append(Paragraph(f"Technologies: {proj['technologies']}", normal_style))
                    story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('itemSpacing', '6pt'))))
                story.append(Spacer(1, convert_to_points(css_styles.get('spacing', {}).get('sectionSpacing', '12pt'))))
        
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

