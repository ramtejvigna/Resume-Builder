from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    profile_picture = models.URLField(blank=True, null=True)
    provider = models.CharField(max_length=50, blank=True, null=True)
    
    # Professional details for profile section
    phone = models.CharField(max_length=20, blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    current_position = models.CharField(max_length=100, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    years_of_experience = models.PositiveIntegerField(blank=True, null=True)
    
    # Override the ManyToManyField relationships to use custom related_names
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='customuser_set',
        related_query_name='customuser'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='customuser_set',
        related_query_name='customuser'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

class ResumeTemplate(models.Model):
    TEMPLATE_TYPES = [
        ('classic', 'Classic'),
        ('modern', 'Modern'),
        ('minimal', 'Minimal'),
        ('creative', 'Creative'),
        ('professional', 'Professional'),
        ('ats_friendly', 'ATS Friendly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    description = models.TextField()
    preview_image = models.URLField(blank=True, null=True)
    css_styles = models.JSONField(default=dict)  # Store template styling
    layout_config = models.JSONField(default=dict)  # Store layout configuration
    ats_score = models.PositiveIntegerField(default=0, help_text="ATS compatibility score out of 100")
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"

class Resume(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='resumes')
    template = models.ForeignKey(ResumeTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200, default="My Resume")
    
    # Personal Information
    personal_info = models.JSONField(default=dict)
    
    # Professional Summary
    professional_summary = models.TextField(blank=True, null=True)
    
    # Experience
    experience = models.JSONField(default=list)
    
    # Education
    education = models.JSONField(default=list)
    
    # Skills
    skills = models.JSONField(default=list)
    
    # Projects
    projects = models.JSONField(default=list)
    
    # Additional sections (certifications, languages, etc.)
    additional_sections = models.JSONField(default=dict)
    
    # Template customization
    template_options = models.JSONField(default=dict)
    
    # Metadata
    is_public = models.BooleanField(default=False)
    pdf_file = models.FileField(upload_to='resume_pdfs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.get_full_name()}"