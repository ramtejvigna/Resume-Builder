import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          Cookies.set('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  provider?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  location?: string;
  current_position?: string;
  summary?: string;
  years_of_experience?: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  template_type: string;
  description: string;
  preview_image?: string;
  css_styles: Record<string, any>;
  layout_config: Record<string, any>;
  ats_score: number;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user: string;
  template?: string;
  template_details?: ResumeTemplate;
  title: string;
  personal_info: Record<string, any>;
  professional_summary?: string;
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  additional_sections: Record<string, any>;
  template_options: Record<string, any>;
  is_public: boolean;
  pdf_file?: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface ResumeListItem {
  id: string;
  title: string;
  template_name?: string;
  created_at: string;
  updated_at: string;
}

// Authentication API
export const authAPI = {
  register: async (userData: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirm: string;
  }) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  googleAuth: async (credential: string) => {
    const response = await api.post('/auth/google/', { credential });
    return response.data;
  },

  linkedinAuth: async (access_token: string) => {
    const response = await api.post('/auth/linkedin/', { access_token });
    return response.data;
  },

  logout: async (refresh_token: string) => {
    const response = await api.post('/auth/logout/', { refresh: refresh_token });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile/update/', profileData);
    return response.data;
  },
};

// Resume Templates API
export const templatesAPI = {
  getAll: async (): Promise<ResumeTemplate[]> => {
    const response = await api.get('/auth/templates/');
    return response.data;
  },

  getById: async (templateId: string): Promise<ResumeTemplate> => {
    const response = await api.get(`/auth/templates/${templateId}/`);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  getAll: async (): Promise<ResumeListItem[]> => {
    const response = await api.get('/auth/resumes/');
    return response.data;
  },

  create: async (resumeData: Partial<Resume>): Promise<Resume> => {
    const response = await api.post('/auth/resumes/create/', resumeData);
    return response.data;
  },

  getById: async (resumeId: string): Promise<Resume> => {
    const response = await api.get(`/auth/resumes/${resumeId}/`);
    return response.data;
  },

  update: async (resumeId: string, resumeData: Partial<Resume>): Promise<Resume> => {
    const response = await api.put(`/auth/resumes/${resumeId}/update/`, resumeData);
    return response.data;
  },

  delete: async (resumeId: string): Promise<void> => {
    await api.delete(`/auth/resumes/${resumeId}/delete/`);
  },

  generatePDF: async (resumeId: string): Promise<Blob> => {
    const response = await api.post(`/auth/resumes/${resumeId}/pdf/`, {}, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Utility functions
export const downloadPDF = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<{
    totalResumes: number;
    totalViews: number;
    totalDownloads: number;
    profileCompletion: number;
    recentActivity: Array<{
      type: 'resume_created' | 'resume_updated' | 'template_used';
      title: string;
      timestamp: string;
    }>;
  }> => {
    try {
      // Fetch user's resumes and profile data
      const [resumes, userProfile] = await Promise.all([
        resumeAPI.getAll(),
        authAPI.getProfile()
      ]);
      
      // Calculate profile completion percentage
      const profileFields = [
        userProfile.first_name,
        userProfile.last_name,
        userProfile.email,
        userProfile.phone,
        userProfile.location,
        userProfile.current_position,
        userProfile.summary,
        userProfile.linkedin_url,
      ];
      
      const completedFields = profileFields.filter(field => field && field.trim() !== '').length;
      const profileCompletion = Math.round((completedFields / profileFields.length) * 100);
      
      // Mock views and downloads (in production, these would be tracked separately)
      const mockViews = resumes.length * Math.floor(Math.random() * 50) + 10;
      const mockDownloads = Math.floor(mockViews * 0.3);
      
      // Generate recent activity from resumes
      const recentActivity = resumes
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
        .map(resume => ({
          type: 'resume_updated' as const,
          title: `Updated "${resume.title}"`,
          timestamp: resume.updated_at
        }));
      
      return {
        totalResumes: resumes.length,
        totalViews: mockViews,
        totalDownloads: mockDownloads,
        profileCompletion,
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default api; 