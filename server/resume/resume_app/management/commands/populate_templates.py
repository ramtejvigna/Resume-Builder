from django.core.management.base import BaseCommand
from resume_app.models import ResumeTemplate

class Command(BaseCommand):
    help = 'Populate resume templates with ATS-friendly designs'

    def handle(self, *args, **options):
        templates_data = [
            {
                'name': 'ATS Professional',
                'template_type': 'ats_friendly',
                'description': 'Clean, ATS-optimized template with excellent parsing compatibility. Perfect for corporate environments.',
                'ats_score': 98,
                'css_styles': {
                    'fontFamily': 'Arial, sans-serif',
                    'fontSize': '11px',
                    'lineHeight': '1.4',
                    'colors': {
                        'primary': '#000000',
                        'secondary': '#333333',
                        'accent': '#2E86AB'
                    },
                    'spacing': {
                        'sectionSpacing': '16px',
                        'itemSpacing': '8px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects'],
                    'show_photo': False,
                    'bullet_style': '•'
                }
            },
            {
                'name': 'Modern Professional',
                'template_type': 'modern',
                'description': 'Contemporary design with subtle colors and modern typography. Great ATS compatibility.',
                'ats_score': 95,
                'css_styles': {
                    'fontFamily': 'Calibri, sans-serif',
                    'fontSize': '11px',
                    'lineHeight': '1.5',
                    'colors': {
                        'primary': '#2C3E50',
                        'secondary': '#34495E',
                        'accent': '#3498DB'
                    },
                    'spacing': {
                        'sectionSpacing': '18px',
                        'itemSpacing': '10px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'experience', 'skills', 'education', 'projects'],
                    'show_photo': False,
                    'bullet_style': '▪'
                }
            },
            {
                'name': 'Executive Classic',
                'template_type': 'professional',
                'description': 'Traditional executive format with excellent ATS parsing. Ideal for senior positions.',
                'ats_score': 96,
                'css_styles': {
                    'fontFamily': 'Times New Roman, serif',
                    'fontSize': '12px',
                    'lineHeight': '1.4',
                    'colors': {
                        'primary': '#000000',
                        'secondary': '#1a1a1a',
                        'accent': '#8B4513'
                    },
                    'spacing': {
                        'sectionSpacing': '20px',
                        'itemSpacing': '12px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'experience', 'education', 'skills'],
                    'show_photo': False,
                    'bullet_style': '•'
                }
            },
            {
                'name': 'Tech Focus',
                'template_type': 'modern', 
                'description': 'Optimized for technical roles with emphasis on skills and projects. High ATS compatibility.',
                'ats_score': 94,
                'css_styles': {
                    'fontFamily': 'Helvetica, Arial, sans-serif',
                    'fontSize': '10.5px',
                    'lineHeight': '1.4',
                    'colors': {
                        'primary': '#212529',
                        'secondary': '#495057',
                        'accent': '#007BFF'
                    },
                    'spacing': {
                        'sectionSpacing': '16px',
                        'itemSpacing': '8px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'skills', 'experience', 'projects', 'education'],
                    'show_photo': False,
                    'bullet_style': '▸'
                }
            },
            {
                'name': 'Minimalist Clean',
                'template_type': 'minimal',
                'description': 'Ultra-clean design with maximum white space. Excellent for ATS systems.',
                'ats_score': 97,
                'css_styles': {
                    'fontFamily': 'Arial, sans-serif',
                    'fontSize': '11px',
                    'lineHeight': '1.6',
                    'colors': {
                        'primary': '#000000',
                        'secondary': '#666666',
                        'accent': '#4A90E2'
                    },
                    'spacing': {
                        'sectionSpacing': '24px',
                        'itemSpacing': '12px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects'],
                    'show_photo': False,
                    'bullet_style': '—'
                }
            },
            {
                'name': 'Creative Professional',
                'template_type': 'creative',
                'description': 'Stylish design with creative elements while maintaining ATS compatibility.',
                'ats_score': 88,
                'css_styles': {
                    'fontFamily': 'Georgia, serif',
                    'fontSize': '11px',
                    'lineHeight': '1.5',
                    'colors': {
                        'primary': '#2F4F4F',
                        'secondary': '#708090',
                        'accent': '#FF6B6B'
                    },
                    'spacing': {
                        'sectionSpacing': '20px',
                        'itemSpacing': '10px'
                    }
                },
                'layout_config': {
                    'layout': 'single-column',
                    'sections_order': ['personalInfo', 'summary', 'experience', 'skills', 'projects', 'education'],
                    'show_photo': True,
                    'bullet_style': '◦'
                }
            }
        ]

        created_count = 0
        for template_data in templates_data:
            template, created = ResumeTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created template: {template.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Template already exists: {template.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new templates')
        ) 