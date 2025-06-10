"use client";

import type { FC } from 'react';
import type { ResumeData, TemplateOptions, PersonalInfo, ExperienceEntry } from '@/types/resume';
import type { EditingTarget } from '@/app/builder/page'; // Import EditingTarget
import { Card, CardContent } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, GraduationCap, Lightbulb, FolderGit2, FileText as FileTextIcon } from 'lucide-react';
import Image from 'next/image';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateOptions: TemplateOptions;
  onEdit: (target: EditingTarget, currentText: string, label: string, isTextarea?: boolean) => void; // Added onEdit prop
  isPreviewMode?: boolean; // Added optional isPreviewMode prop
  selectedTemplate?: any; // Add selected template prop
}

const ResumePreview: FC<ResumePreviewProps> = ({ resumeData, templateOptions, onEdit, isPreviewMode = false, selectedTemplate }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  // Get template-specific styles
  const getTemplateStyles = () => {
    console.log("Selected template:", selectedTemplate); // Debug log
    if (selectedTemplate && selectedTemplate.css_styles) {
      console.log("Template CSS styles:", selectedTemplate.css_styles); // Debug log
      return {
        fontFamily: selectedTemplate.css_styles.fontFamily || 'Inter, sans-serif',
        fontSize: selectedTemplate.css_styles.fontSize || '14px',
        lineHeight: selectedTemplate.css_styles.lineHeight || '1.5',
        colors: {
          primary: selectedTemplate.css_styles.colors?.primary || '#000000',
          secondary: selectedTemplate.css_styles.colors?.secondary || '#333333',
          accent: selectedTemplate.css_styles.colors?.accent || '#2E86AB',
        },
        spacing: {
          sectionSpacing: selectedTemplate.css_styles.spacing?.sectionSpacing || '16px',
          itemSpacing: selectedTemplate.css_styles.spacing?.itemSpacing || '8px',
        }
      };
    }
    return {
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      colors: { primary: '#000000', secondary: '#333333', accent: '#2E86AB' },
      spacing: { sectionSpacing: '16px', itemSpacing: '8px' }
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
    if (selectedTemplate && selectedTemplate.layout_config) {
      return selectedTemplate.layout_config.layout || 'single-column';
    }
    return 'single-column';
  };

  const templateLayout = getTemplateLayout();

  const contentClassName = cn(
    'p-8 bg-white text-gray-800 max-w-4xl mx-auto shadow-lg space-y-6',
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
  
  const clickableClassName = isPreviewMode ? "" : "cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded transition-colors duration-150 inline-block";
  const clickableBlockClassName = isPreviewMode ? "" : "cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded transition-colors duration-150 block";

  const handleClick = (callback: () => void) => {
    if (!isPreviewMode) {
      callback();
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent style={{...contentStyle, ...modernBorderStyle}} className={contentClassName}>
        {/* Header Section */}
        <div className={cn("mb-6", {
          "text-center": templateOptions.textAlign === 'center',
          "text-inherit": templateOptions.textAlign !== 'center'
        })}>
          {personalInfo.photoUrl && (
            <div className={cn("w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-3", templateOptions.textAlign === 'center' ? "mx-auto" : "mx-0")}>
              <Image 
                src={personalInfo.photoUrl} 
                alt={personalInfo.name || 'Profile'} 
                width={96} 
                height={96} 
                className="object-cover"
                data-ai-hint="profile photo"
              />
            </div>
          )}
          <h1 
            className={cn("text-3xl font-headline font-bold", clickableClassName)} 
            style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 2.5)', 
              color: 'var(--primary-color, #000000)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}
            onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'name' }, personalInfo.name, 'Full Name', false))}
          >
            {personalInfo.name || "Your Name"}
          </h1>
          <div className={cn("flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2", {
            'justify-center': templateOptions.textAlign === 'center',
            'justify-start': templateOptions.textAlign === 'left',
            'justify-end': templateOptions.textAlign === 'right',
          })}>
            {personalInfo.email && <span className={cn("flex items-center", clickableClassName)} onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'email' }, personalInfo.email, 'Email Address', false))}><span className='flex items-center'><Mail className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color, #2E86AB)' }} /> {personalInfo.email}</span></span>}
            {personalInfo.phone && <span className={cn("flex items-center", clickableClassName)} onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'phone' }, personalInfo.phone, 'Phone Number', false))}><span className='flex items-center'><Phone className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color, #2E86AB)' }} /> {personalInfo.phone}</span></span>}
            {personalInfo.linkedin && <span className={cn("flex items-center", clickableClassName)} onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'linkedin' }, personalInfo.linkedin, 'LinkedIn Profile URL', false))}><span className='flex items-center'><Linkedin className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color, #2E86AB)' }} />LinkedIn</span></span>}
            {personalInfo.github && <span className={cn("flex items-center", clickableClassName)} onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'github' }, personalInfo.github, 'GitHub Profile URL', false))}><span className='flex items-center'><Github className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color, #2E86AB)' }} />Github</span></span>}
            {personalInfo.portfolio && <span className={cn("flex items-center", clickableClassName)} onClick={() => handleClick(() => onEdit({ section: 'personalInfo', field: 'portfolio' }, personalInfo.portfolio, 'Portfolio URL', false))}><span className='flex items-center'><Globe className="mr-1 h-3 w-3" style={{ color: 'var(--accent-color, #2E86AB)' }} />Portfolio</span></span>}
          </div>
        </div>

        {/* Summary Section */}
        { (summary || templateOptions.textAlign ) && ( // always show if summary has content or if textAlign is set (to allow clicking placeholder)
          <section>
            <h2 className="text-lg font-headline font-semibold border-b-2 pb-1 mb-2 flex items-center" style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 1.3)',
              color: 'var(--primary-color, #000000)',
              borderBottomColor: 'var(--accent-color, #2E86AB)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}>
              <FileTextIcon className="mr-2 h-5 w-5" style={{ color: 'var(--accent-color, #2E86AB)' }} /> Professional Summary
            </h2>
            <p 
              className={cn("text-gray-700 whitespace-pre-wrap", clickableBlockClassName)}
              onClick={() => handleClick(() => onEdit({ section: 'summary' }, summary, 'Professional Summary', true))}
            >
              {summary || "Your professional summary..."}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold border-b-2 pb-1 mb-2 flex items-center" style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 1.3)',
              color: 'var(--primary-color, #000000)',
              borderBottomColor: 'var(--accent-color, #2E86AB)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}>
              <Briefcase className="mr-2 h-5 w-5" style={{ color: 'var(--accent-color, #2E86AB)' }} /> Work Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id} className="mb-3">
                <h3 
                  className={cn("text-md font-semibold text-gray-800", clickableClassName)}
                  onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'jobTitle' }, exp.jobTitle, `Job Title for ${exp.company || 'Experience Item ' + (index+1)}`, false))}
                >
                  {exp.jobTitle || "Job Title"}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className={clickableClassName} onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'company' }, exp.company,  `Company for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false))}>{exp.company || "Company"}</span> | <span className={clickableClassName} onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'location' }, exp.location, `Location for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false))}>{exp.location || "Location"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  <span className={clickableClassName} onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'startDate' }, exp.startDate, `Start Date for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false))}>{exp.startDate || "Start Date"}</span> - <span className={clickableClassName} onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'endDate' }, exp.endDate, `End Date for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false))}>{exp.endDate || "End Date"}</span>
                </p>
                <p 
                  className={cn("mt-1 text-gray-700 whitespace-pre-wrap", clickableBlockClassName)}
                  onClick={() => handleClick(() => onEdit({ section: 'experience', index, field: 'description' }, exp.description, `Description for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, true))}>
                  {exp.description || "Job description..."}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold border-b-2 pb-1 mb-2 flex items-center" style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 1.3)',
              color: 'var(--primary-color, #000000)',
              borderBottomColor: 'var(--accent-color, #2E86AB)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}>
              <GraduationCap className="mr-2 h-5 w-5" style={{ color: 'var(--accent-color, #2E86AB)' }} /> Education
            </h2>
            {education.map((edu, index) => (
              <div key={edu.id} className="mb-3">
                <h3 className={cn("text-md font-semibold text-gray-800", clickableClassName)} onClick={() => handleClick(() => onEdit({section: 'education', index, field: 'degree'}, edu.degree, `Degree for ${edu.institution || 'Education Item ' + (index+1)}`, false))}>{edu.degree || "Degree"}</h3>
                <p className="text-sm text-gray-600"><span className={clickableClassName} onClick={() => handleClick(() => onEdit({section: 'education', index, field: 'institution'}, edu.institution, `Institution for ${edu.degree || 'Education Item ' + (index+1)}`, false))}>{edu.institution || "Institution"}</span> | <span className={clickableClassName} onClick={() => handleClick(() => onEdit({section: 'education', index, field: 'location'}, edu.location, `Location for ${edu.degree || 'Education Item ' + (index+1)}`, false))}>{edu.location || "Location"}</span></p>
                <p className="text-xs text-gray-500">Graduated: <span className={clickableClassName} onClick={() => handleClick(() => onEdit({section: 'education', index, field: 'graduationDate'}, edu.graduationDate, `Graduation Date for ${edu.degree || 'Education Item ' + (index+1)}`, false))}>{edu.graduationDate || "Graduation Date"}</span></p>
                {edu.gpa && <p className="text-xs text-gray-500">GPA: <span className={clickableClassName} onClick={() => handleClick(() => onEdit({section: 'education', index, field: 'gpa'}, edu.gpa || '', `GPA for ${edu.degree || 'Education Item ' + (index+1)}`, false))}>{edu.gpa}</span></p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold border-b-2 pb-1 mb-2 flex items-center" style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 1.3)',
              color: 'var(--primary-color, #000000)',
              borderBottomColor: 'var(--accent-color, #2E86AB)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}>
              <Lightbulb className="mr-2 h-5 w-5" style={{ color: 'var(--accent-color, #2E86AB)' }} /> Skills
            </h2>
            <ul className={cn("list-disc list-inside grid grid-cols-2 gap-1", {"pl-5": templateOptions.textAlign === 'left' || templateOptions.textAlign === 'right' })}>
              {skills.map((skill, index) => (
                <li key={skill.id} className="text-gray-700">
                  <span className={clickableClassName} onClick={() => handleClick(() => onEdit({section: 'skills', index, field: 'name'}, skill.name, `Skill Name` , false))}>{skill.name || "Skill Name"}</span> <span className="text-xs text-gray-500">({skill.proficiency})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {/* Projects Section */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold border-b-2 pb-1 mb-2 flex items-center" style={{ 
              fontFamily: 'inherit', 
              fontSize: 'calc(var(--font-size, 11px) * 1.3)',
              color: 'var(--primary-color, #000000)',
              borderBottomColor: 'var(--accent-color, #2E86AB)',
              marginBottom: 'var(--item-spacing, 8px)'
            }}>
              <FolderGit2 className="mr-2 h-5 w-5" style={{ color: 'var(--accent-color, #2E86AB)' }} /> Projects
            </h2>
            {projects.map((proj, index) => (
              <div key={proj.id} className="mb-3">
                <h3 className={cn("text-md font-semibold text-gray-800", clickableClassName)} onClick={() => handleClick(() => onEdit({section: 'projects', index, field: 'name'}, proj.name, `Project Name`, false))}>{proj.name || "Project Name"}</h3>
                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className={cn("text-xs text-primary hover:underline", clickableClassName)} onClick={(e) => { e.stopPropagation(); handleClick(() => onEdit({section: 'projects', index, field: 'link'}, proj.link, `Project Link`, false));}}>{proj.link}</a>}
                <p className={cn("text-sm text-gray-600 italic", clickableClassName)} onClick={() => handleClick(() => onEdit({section: 'projects', index, field: 'technologies'}, proj.technologies, `Technologies for ${proj.name || 'Project Item ' + (index+1)}`, false))}>Technologies: {proj.technologies || "Technologies used"}</p>
                <p className={cn("mt-1 text-gray-700 whitespace-pre-wrap", clickableBlockClassName)} onClick={() => handleClick(() => onEdit({section: 'projects', index, field: 'description'}, proj.description, `Description for ${proj.name || 'Project Item ' + (index+1)}`, true))}>{proj.description || "Project description..."}</p>
              </div>
            ))}
          </section>
        )}

      </CardContent>
    </Card>
  );
};

export default ResumePreview;
