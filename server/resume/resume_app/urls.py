from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('google/', views.google_auth, name='google_auth'),
    path('linkedin/', views.linkedin_auth, name='linkedin_auth'),
    path('social/', include('social_django.urls', namespace='social')),
    
    path('templates/', views.resume_templates, name='resume_templates'),
    path('templates/<uuid:template_id>/', views.resume_template_detail, name='resume_template_detail'),
    
    path('resumes/', views.user_resumes, name='user_resumes'),
    path('resumes/create/', views.create_resume, name='create_resume'),
    path('resumes/<uuid:resume_id>/', views.resume_detail, name='resume_detail'),
    path('resumes/<uuid:resume_id>/update/', views.update_resume, name='update_resume'),
    path('resumes/<uuid:resume_id>/delete/', views.delete_resume, name='delete_resume'),
    path('resumes/<uuid:resume_id>/pdf/', views.generate_resume_pdf, name='generate_resume_pdf'),
]