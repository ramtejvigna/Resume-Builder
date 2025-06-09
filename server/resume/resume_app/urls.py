from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('google/', views.google_auth, name='google_auth'),
    path('linkedin/', views.linkedin_auth, name='linkedin_auth'),
    path('social/', include('social_django.urls', namespace='social')),
]