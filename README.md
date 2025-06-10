# ResumeFlow - Professional Resume Builder

A comprehensive resume builder platform with Django backend and Next.js frontend, featuring ATS-optimized templates, real-time editing, and PDF generation.

## Features

### ✨ Core Features
- **ATS-Optimized Templates**: Collection of professionally designed templates with high ATS compatibility scores
- **Real-time Preview**: Live preview of resume changes as you type
- **Template Switching**: Switch between templates while preserving your data
- **PDF Generation**: Both client-side and server-side PDF generation
- **Resume Management**: Save, load, and manage multiple resumes
- **Professional Profile**: Comprehensive user profile management

### 🎨 UI/UX Features
- **Modern Design**: Beautiful, responsive interface with animations and transitions
- **Dark/Light Mode**: Automatic theme switching
- **Mobile Responsive**: Works perfectly on all devices
- **Smooth Animations**: Framer Motion powered animations
- **Toast Notifications**: Real-time feedback for user actions

### 🔐 Authentication
- **Email/Password**: Traditional authentication
- **Google OAuth**: Sign in with Google
- **LinkedIn OAuth**: Sign in with LinkedIn
- **JWT Tokens**: Secure token-based authentication

## Tech Stack

### Backend (Django)
- **Django 5.2+**: Web framework
- **Django REST Framework**: API development
- **JWT Authentication**: Token-based auth
- **ReportLab**: PDF generation
- **SQLite**: Database (easily switchable to PostgreSQL)
- **CORS Headers**: Cross-origin requests

### Frontend (Next.js)
- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Radix UI**: Component library
- **Sonner**: Toast notifications
- **React Hook Form**: Form management
- **Axios**: HTTP client

## Project Structure

```
├── server/resume/                 # Django Backend
│   ├── resume_app/               # Main Django app
│   │   ├── models.py            # User, Resume, Template models
│   │   ├── views.py             # API endpoints
│   │   ├── serializers.py       # Data serialization
│   │   └── management/          # Management commands
│   ├── resume/                  # Django project settings
│   └── requirements.txt         # Python dependencies
│
├── my-auth-app/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities and API
│   │   ├── types/               # TypeScript types
│   │   └── contexts/            # React contexts
│   └── package.json             # Node dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup (Django)

1. **Navigate to backend directory**
   ```bash
   cd server/resume
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create environment file**
   ```bash
   # Create .env file in server/resume/
   GOOGLE_OAUTH2_KEY=your_google_client_id
   GOOGLE_OAUTH2_SECRET=your_google_client_secret
   LINKEDIN_OAUTH2_KEY=your_linkedin_client_id
   LINKEDIN_OAUTH2_SECRET=your_linkedin_client_secret
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Populate templates**
   ```bash
   python manage.py populate_templates
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

The Django API will be available at `http://localhost:8000`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
   ```bash
   cd my-auth-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_NAME=ResumeFlow
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The Next.js app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/update/` - Update user profile
- `POST /api/google/` - Google OAuth
- `POST /api/linkedin/` - LinkedIn OAuth

### Resume Templates
- `GET /api/templates/` - Get all templates
- `GET /api/templates/{id}/` - Get template details

### Resume Management
- `GET /api/resumes/` - Get user resumes
- `POST /api/resumes/create/` - Create new resume
- `GET /api/resumes/{id}/` - Get resume details
- `PUT /api/resumes/{id}/update/` - Update resume
- `DELETE /api/resumes/{id}/delete/` - Delete resume
- `POST /api/resumes/{id}/pdf/` - Generate PDF

## Database Models

### CustomUser
Extended Django user model with professional fields:
- Basic info: email, first_name, last_name
- Professional: phone, linkedin_url, github_url, portfolio_url
- Career: current_position, summary, years_of_experience
- Location: location

### ResumeTemplate
Template definitions with ATS scores:
- Template metadata: name, type, description
- Styling: css_styles, layout_config
- ATS compatibility: ats_score
- Premium status: is_premium

### Resume
User's resume data:
- Personal information: personal_info (JSON)
- Content: experience, education, skills, projects (JSON)
- Customization: template_options (JSON)
- Metadata: created_at, updated_at, is_public

## Features in Detail

### 1. Template System
- **6 ATS-Optimized Templates**: Professional, Modern, Minimal, Creative, Classic, Tech Focus
- **High ATS Scores**: All templates scored 88-98% for ATS compatibility
- **Dynamic Styling**: Templates include font, color, and layout configurations
- **Easy Switching**: Change templates without losing data

### 2. Resume Builder
- **Section-based Editing**: Personal info, summary, experience, education, skills, projects
- **Real-time Preview**: See changes instantly
- **Direct Editing**: Click on preview text to edit directly
- **Form Validation**: Comprehensive validation for all fields

### 3. PDF Generation
- **Client-side**: HTML2Canvas + jsPDF for instant downloads
- **Server-side**: ReportLab for professional formatting
- **Custom Styling**: Maintains template styling in PDF
- **Optimized Output**: Clean, professional PDF output

### 4. User Management
- **Profile System**: Comprehensive professional profile
- **Social Integration**: Google and LinkedIn OAuth
- **Resume Library**: Save and manage multiple resumes
- **Data Persistence**: All data saved to backend

## Development

### Adding New Templates
1. Create template configuration in `populate_templates.py`
2. Define CSS styles and layout configuration
3. Run `python manage.py populate_templates`

### Customizing Styles
- Templates use JSON configuration for styling
- Colors, fonts, spacing all configurable
- Layout order can be customized per template

### API Extensions
- Add new endpoints in `views.py`
- Create serializers for data validation
- Update URL patterns in `urls.py`

## Deployment

### Backend (Django)
1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Collect static files: `python manage.py collectstatic`
4. Use gunicorn or similar WSGI server
5. Set up reverse proxy (nginx)

### Frontend (Next.js)
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables
4. Set up custom domain if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


Built with ❤️ using Django and Next.js 
