from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Resume, ResumeTemplate

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile_picture', 'provider')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'profile_picture', 
            'provider', 'phone', 'linkedin_url', 'github_url', 'portfolio_url', 
            'location', 'current_position', 'summary', 'years_of_experience'
        )
        read_only_fields = ('id', 'username', 'email', 'provider')

class ResumeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeTemplate
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    template_details = ResumeTemplateSerializer(source='template', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Resume
        fields = [
            'id', 'user', 'template', 'template_details', 'title', 'personal_info',
            'professional_summary', 'experience', 'education', 'skills', 'projects',
            'additional_sections', 'template_options', 'is_public', 'pdf_file',
            'created_at', 'updated_at', 'user_name'
        ]
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class ResumeListSerializer(serializers.ModelSerializer):
    template_name = serializers.CharField(source='template.name', read_only=True)
    
    class Meta:
        model = Resume
        fields = ['id', 'title', 'template_name', 'created_at', 'updated_at']
        
class SocialAuthSerializer(serializers.Serializer):
    provider = serializers.CharField(required=False)
    access_token = serializers.CharField(required=False)
    token = serializers.CharField(required=False)
    credential = serializers.CharField(required=False)  # Added for Google authentication