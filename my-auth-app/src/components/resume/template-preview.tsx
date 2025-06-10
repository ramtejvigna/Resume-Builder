"use client";

import type { FC } from 'react';
import { ResumeTemplate } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, GraduationCap, Lightbulb, FolderGit2, FileText as FileTextIcon } from 'lucide-react';

interface TemplatePreviewProps {
  template: ResumeTemplate;
  className?: string;
}

// Sample data for template preview
const sampleData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    photoUrl: "",
  },
  summary: "Experienced software engineer with 5+ years developing scalable web applications. Passionate about clean code and modern technologies.",
  experience: [
    {
      id: "1",
      jobTitle: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      description: "Lead development of microservices architecture serving 1M+ users"
    },
    {
      id: "2", 
      jobTitle: "Software Engineer",
      company: "StartupXYZ",
      location: "New York, NY",
      startDate: "2020",
      endDate: "2022",
      description: "Built full-stack applications using React and Node.js"
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      location: "California",
      graduationDate: "2020",
      gpa: "3.8"
    }
  ],
  skills: [
    { id: "1", name: "JavaScript", proficiency: "Expert" as const },
    { id: "2", name: "React", proficiency: "Expert" as const },
    { id: "3", name: "Node.js", proficiency: "Advanced" as const },
    { id: "4", name: "Python", proficiency: "Advanced" as const },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      technologies: "React, Node.js, MongoDB",
      link: "github.com/johndoe/ecommerce"
    }
  ]
};

const TemplatePreview: FC<TemplatePreviewProps> = ({ template, className }) => {
  // Get template-specific styles
  const getTemplateStyles = () => {
    if (template && template.css_styles) {
      return {
        fontFamily: template.css_styles.fontFamily || 'Inter, sans-serif',
        fontSize: template.css_styles.fontSize || '10px',
        lineHeight: template.css_styles.lineHeight || '1.4',
        colors: {
          primary: template.css_styles.colors?.primary || '#000000',
          secondary: template.css_styles.colors?.secondary || '#333333',
          accent: template.css_styles.colors?.accent || '#2E86AB',
        },
        spacing: {
          sectionSpacing: template.css_styles.spacing?.sectionSpacing || '12px',
          itemSpacing: template.css_styles.spacing?.itemSpacing || '6px',
        }
      };
    }
    return {
      fontFamily: 'Inter, sans-serif',
      fontSize: '10px',
      lineHeight: '1.4',
      colors: { primary: '#000000', secondary: '#333333', accent: '#2E86AB' },
      spacing: { sectionSpacing: '12px', itemSpacing: '6px' }
    };
  };

  const templateStyles = getTemplateStyles();

  const contentStyle = {
    fontFamily: templateStyles.fontFamily,
    fontSize: templateStyles.fontSize,
    lineHeight: templateStyles.lineHeight,
    '--primary-color': templateStyles.colors.primary,
    '--secondary-color': templateStyles.colors.secondary,
    '--accent-color': templateStyles.colors.accent,
    '--section-spacing': templateStyles.spacing.sectionSpacing,
    '--item-spacing': templateStyles.spacing.itemSpacing,
  } as React.CSSProperties;

  // Get template-specific layout
  const getTemplateLayout = () => {
    if (template && template.layout_config) {
      return template.layout_config.layout || 'standard';
    }
    return 'standard';
  };

  const templateLayout = getTemplateLayout();

  const contentClassName = cn(
    'p-4 bg-white text-gray-800 space-y-3 h-full overflow-hidden',
    {
      // Template-specific layouts
      'border-l-4': templateLayout === 'modern',
      'shadow-inner': templateLayout === 'professional', 
      'bg-gradient-to-b from-gray-50 to-white': templateLayout === 'creative',
    }
  );

  // Apply template-specific border color for modern layout
  const modernBorderStyle = templateLayout === 'modern' ? {
    borderLeftColor: templateStyles.colors.accent
  } : {};

  return (
    <Card className={cn("shadow-lg w-full h-96 overflow-hidden", className)}>
      <CardContent 
        style={{...contentStyle, ...modernBorderStyle}} 
        className={contentClassName}
      >
        {/* Header Section */}
        <div className="mb-3">
          <h1 
            className="text-lg font-bold mb-1" 
            style={{ 
              color: 'var(--primary-color)',
              fontSize: 'calc(var(--font-size, 10px) * 1.8)',
              marginBottom: 'calc(var(--item-spacing, 6px) * 0.5)'
            }}
          >
            {sampleData.personalInfo.name}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <span className="flex items-center">
              <Mail className="mr-1 h-2 w-2" style={{ color: 'var(--accent-color)' }} /> 
              {sampleData.personalInfo.email}
            </span>
            <span className="flex items-center">
              <Phone className="mr-1 h-2 w-2" style={{ color: 'var(--accent-color)' }} /> 
              {sampleData.personalInfo.phone}
            </span>
            <span className="flex items-center">
              <Linkedin className="mr-1 h-2 w-2" style={{ color: 'var(--accent-color)' }} /> 
              LinkedIn
            </span>
          </div>
        </div>

        {/* Summary Section */}
        <section className="mb-3">
          <h2 
            className="text-sm font-semibold border-b pb-1 mb-1 flex items-center" 
            style={{ 
              color: 'var(--primary-color)',
              borderBottomColor: 'var(--accent-color)',
              fontSize: 'calc(var(--font-size, 10px) * 1.2)'
            }}
          >
            <FileTextIcon className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color)' }} /> 
            Summary
          </h2>
          <p className="text-xs leading-tight" style={{ color: 'var(--secondary-color)' }}>
            {sampleData.summary}
          </p>
        </section>

        {/* Experience Section */}
        <section className="mb-3">
          <h2 
            className="text-sm font-semibold border-b pb-1 mb-1 flex items-center" 
            style={{ 
              color: 'var(--primary-color)',
              borderBottomColor: 'var(--accent-color)',
              fontSize: 'calc(var(--font-size, 10px) * 1.2)'
            }}
          >
            <Briefcase className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color)' }} /> 
            Experience
          </h2>
          {sampleData.experience.slice(0, 2).map((exp, index) => (
            <div key={exp.id} className="mb-2">
              <h3 className="text-xs font-semibold" style={{ color: 'var(--primary-color)' }}>
                {exp.jobTitle}
              </h3>
              <p className="text-xs" style={{ color: 'var(--secondary-color)' }}>
                {exp.company} | {exp.startDate} - {exp.endDate}
              </p>
              <p className="text-xs leading-tight" style={{ color: 'var(--secondary-color)' }}>
                {exp.description.substring(0, 60)}...
              </p>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section>
          <h2 
            className="text-sm font-semibold border-b pb-1 mb-1 flex items-center" 
            style={{ 
              color: 'var(--primary-color)',
              borderBottomColor: 'var(--accent-color)',
              fontSize: 'calc(var(--font-size, 10px) * 1.2)'
            }}
          >
            <Lightbulb className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color)' }} /> 
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-1">
            {sampleData.skills.map((skill) => (
              <span key={skill.id} className="text-xs" style={{ color: 'var(--secondary-color)' }}>
                • {skill.name}
              </span>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default TemplatePreview; 