
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
}

const ResumePreview: FC<ResumePreviewProps> = ({ resumeData, templateOptions, onEdit }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  const contentStyle = {
    fontFamily: templateOptions.fontFamily,
    fontSize: templateOptions.fontSize,
  };

  const contentClassName = cn(
    'p-6 bg-white text-gray-800 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto',
    {
      'text-left': templateOptions.textAlign === 'left',
      'text-center': templateOptions.textAlign === 'center',
      'text-right': templateOptions.textAlign === 'right',
    }
  );
  
  const clickableClassName = "cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded transition-colors duration-150 inline-block";
  const clickableBlockClassName = "cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded transition-colors duration-150 block";


  return (
    <Card className="shadow-lg">
      <CardContent style={contentStyle} className={contentClassName}>
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
            className={cn("text-3xl font-headline font-bold text-gray-800", clickableClassName)} 
            style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
            onClick={() => onEdit({ section: 'personalInfo', field: 'name' }, personalInfo.name, 'Full Name', false)}
          >
            {personalInfo.name || "Your Name"}
          </h1>
          <div className={cn("flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-2", {
            'justify-center': templateOptions.textAlign === 'center',
            'justify-start': templateOptions.textAlign === 'left',
            'justify-end': templateOptions.textAlign === 'right',
          })}>
            {personalInfo.email && <span className={cn("flex items-center", clickableClassName)} onClick={() => onEdit({ section: 'personalInfo', field: 'email' }, personalInfo.email, 'Email Address', false)}><span className='flex items-center'><Mail className="mr-1 h-3 w-3 text-primary" /> {personalInfo.email}</span></span>}
            {personalInfo.phone && <span className={cn("flex items-center", clickableClassName)} onClick={() => onEdit({ section: 'personalInfo', field: 'phone' }, personalInfo.phone, 'Phone Number', false)}><span className='flex items-center'><Phone className="mr-1 h-3 w-3 text-primary" /> {personalInfo.phone}</span></span>}
            {personalInfo.linkedin && <span className={cn("flex items-center", clickableClassName)} onClick={() => onEdit({ section: 'personalInfo', field: 'linkedin' }, personalInfo.linkedin, 'LinkedIn Profile URL', false)}><span className='flex items-center'><Linkedin className="mr-1 h-3 w-3 text-primary" />LinkedIn</span></span>}
            {personalInfo.github && <span className={cn("flex items-center", clickableClassName)} onClick={() => onEdit({ section: 'personalInfo', field: 'github' }, personalInfo.github, 'GitHub Profile URL', false)}><span className='flex items-center'><Github className="mr-1 h-3 w-3 text-primary" />Github</span></span>}
            {personalInfo.portfolio && <span className={cn("flex items-center", clickableClassName)} onClick={() => onEdit({ section: 'personalInfo', field: 'portfolio' }, personalInfo.portfolio, 'Portfolio URL', false)}><span className='flex items-center'><Globe className="mr-1 h-3 w-3 text-primary" />Portfolio</span></span>}
          </div>
        </div>

        {/* Summary Section */}
        { (summary || templateOptions.textAlign ) && ( // always show if summary has content or if textAlign is set (to allow clicking placeholder)
          <section>
            <h2 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary pb-1 mb-2 flex items-center" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
              <FileTextIcon className="mr-2 h-5 w-5" /> Professional Summary
            </h2>
            <p 
              className={cn("text-gray-700 whitespace-pre-wrap", clickableBlockClassName)}
              onClick={() => onEdit({ section: 'summary' }, summary, 'Professional Summary', true)}
            >
              {summary || "Your professional summary..."}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary pb-1 mb-2 flex items-center" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
              <Briefcase className="mr-2 h-5 w-5" /> Work Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={exp.id} className="mb-3">
                <h3 
                  className={cn("text-md font-semibold text-gray-800", clickableClassName)}
                  onClick={() => onEdit({ section: 'experience', index, field: 'jobTitle' }, exp.jobTitle, `Job Title for ${exp.company || 'Experience Item ' + (index+1)}`, false)}
                >
                  {exp.jobTitle || "Job Title"}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className={clickableClassName} onClick={() => onEdit({ section: 'experience', index, field: 'company' }, exp.company,  `Company for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false)}>{exp.company || "Company"}</span> | <span className={clickableClassName} onClick={() => onEdit({ section: 'experience', index, field: 'location' }, exp.location, `Location for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false)}>{exp.location || "Location"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  <span className={clickableClassName} onClick={() => onEdit({ section: 'experience', index, field: 'startDate' }, exp.startDate, `Start Date for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false)}>{exp.startDate || "Start Date"}</span> - <span className={clickableClassName} onClick={() => onEdit({ section: 'experience', index, field: 'endDate' }, exp.endDate, `End Date for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, false)}>{exp.endDate || "End Date"}</span>
                </p>
                <p 
                  className={cn("mt-1 text-gray-700 whitespace-pre-wrap", clickableBlockClassName)}
                  onClick={() => onEdit({ section: 'experience', index, field: 'description' }, exp.description, `Description for ${exp.jobTitle || 'Experience Item ' + (index+1)}`, true)}
                >
                  {exp.description || "Job description..."}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary pb-1 mb-2 flex items-center" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
              <GraduationCap className="mr-2 h-5 w-5" /> Education
            </h2>
            {education.map((edu, index) => (
              <div key={edu.id} className="mb-3">
                <h3 className={cn("text-md font-semibold text-gray-800", clickableClassName)} onClick={() => onEdit({section: 'education', index, field: 'degree'}, edu.degree, `Degree for ${edu.institution || 'Education Item ' + (index+1)}`, false)}>{edu.degree || "Degree"}</h3>
                <p className="text-sm text-gray-600"><span className={clickableClassName} onClick={() => onEdit({section: 'education', index, field: 'institution'}, edu.institution, `Institution for ${edu.degree || 'Education Item ' + (index+1)}`, false)}>{edu.institution || "Institution"}</span> | <span className={clickableClassName} onClick={() => onEdit({section: 'education', index, field: 'location'}, edu.location, `Location for ${edu.degree || 'Education Item ' + (index+1)}`, false)}>{edu.location || "Location"}</span></p>
                <p className="text-xs text-gray-500">Graduated: <span className={clickableClassName} onClick={() => onEdit({section: 'education', index, field: 'graduationDate'}, edu.graduationDate, `Graduation Date for ${edu.degree || 'Education Item ' + (index+1)}`, false)}>{edu.graduationDate || "Graduation Date"}</span></p>
                {edu.gpa && <p className="text-xs text-gray-500">GPA: <span className={clickableClassName} onClick={() => onEdit({section: 'education', index, field: 'gpa'}, edu.gpa || '', `GPA for ${edu.degree || 'Education Item ' + (index+1)}`, false)}>{edu.gpa}</span></p>}
              </div>
            ))}
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary pb-1 mb-2 flex items-center" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
              <Lightbulb className="mr-2 h-5 w-5" /> Skills
            </h2>
            <ul className={cn("list-disc list-inside grid grid-cols-2 gap-1", {"pl-5": templateOptions.textAlign === 'left' || templateOptions.textAlign === 'right' })}>
              {skills.map((skill, index) => (
                <li key={skill.id} className="text-gray-700">
                  <span className={clickableClassName} onClick={() => onEdit({section: 'skills', index, field: 'name'}, skill.name, `Skill Name` , false)}>{skill.name || "Skill Name"}</span> <span className="text-xs text-gray-500">({skill.proficiency})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {/* Projects Section */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary pb-1 mb-2 flex items-center" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
              <FolderGit2 className="mr-2 h-5 w-5" /> Projects
            </h2>
            {projects.map((proj, index) => (
              <div key={proj.id} className="mb-3">
                <h3 className={cn("text-md font-semibold text-gray-800", clickableClassName)} onClick={() => onEdit({section: 'projects', index, field: 'name'}, proj.name, `Project Name`, false)}>{proj.name || "Project Name"}</h3>
                {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className={cn("text-xs text-primary hover:underline", clickableClassName)} onClick={(e) => { e.stopPropagation(); onEdit({section: 'projects', index, field: 'link'}, proj.link, `Project Link`, false);}}>{proj.link}</a>}
                <p className={cn("text-sm text-gray-600 italic", clickableClassName)} onClick={() => onEdit({section: 'projects', index, field: 'technologies'}, proj.technologies, `Technologies for ${proj.name || 'Project Item ' + (index+1)}`, false)}>Technologies: {proj.technologies || "Technologies used"}</p>
                <p className={cn("mt-1 text-gray-700 whitespace-pre-wrap", clickableBlockClassName)} onClick={() => onEdit({section: 'projects', index, field: 'description'}, proj.description, `Description for ${proj.name || 'Project Item ' + (index+1)}`, true)}>{proj.description || "Project description..."}</p>
              </div>
            ))}
          </section>
        )}

      </CardContent>
    </Card>
  );
};

export default ResumePreview;
