"use client";

import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import type { ResumeData, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionCard from './section-card';
import AISuggestionModal from './ai-suggestion-modal';
import { UserCircle2, FileText, Briefcase, GraduationCap, Lightbulb, FolderGit2, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import Image from 'next/image';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: Dispatch<SetStateAction<ResumeData>>;
}

const ResumeForm: FC<ResumeFormProps> = ({ resumeData, setResumeData }) => {
  const [isAISuggestionModalOpen, setIsAISuggestionModalOpen] = useState(false);
  const [aiSuggestionTarget, setAISuggestionTarget] = useState<{ field: keyof ResumeData | `experience.${number}.description` | `projects.${number}.description`, text: string, context?: string, index?: number }>({ field: 'summary', text: '' });
  const [jobDescriptionForAI, setJobDescriptionForAI] = useState('');


  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const handleSummaryChange = (value: string) => {
    setResumeData((prev) => ({ ...prev, summary: value }));
  };

  const openAISuggestionModal = (field: keyof ResumeData | `experience.${number}.description` | `projects.${number}.description`, currentText: string, context?: string, index?: number) => {
    setAISuggestionTarget({ field, text: currentText, context, index });
    setIsAISuggestionModalOpen(true);
  };

  const handleApplyAISuggestion = (suggestion: string) => {
    const { field, index } = aiSuggestionTarget;
    if (field === 'summary') {
      handleSummaryChange(suggestion);
    } else if (field.startsWith('experience.') && typeof index === 'number') {
      handleExperienceChange(index, 'description', suggestion);
    } else if (field.startsWith('projects.') && typeof index === 'number') {
      handleProjectChange(index, 'description', suggestion);
    }
  };

  // Experience Handlers
  const addExperienceEntry = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }]
    }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((entry, i) => i === index ? { ...entry, [field]: value } : entry)
    }));
  };

  const removeExperienceEntry = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(entry => entry.id !== id)
    }));
  };

  // Education Handlers
  const addEducationEntry = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: crypto.randomUUID(), degree: '', institution: '', location: '', graduationDate: '', gpa: '' }]
    }));
  };

  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((entry, i) => i === index ? { ...entry, [field]: value } : entry)
    }));
  };

  const removeEducationEntry = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(entry => entry.id !== id)
    }));
  };

  // Skills Handlers
  const addSkillEntry = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: crypto.randomUUID(), name: '', proficiency: 'Intermediate' }]
    }));
  };

  const handleSkillChange = (index: number, field: keyof SkillEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((entry, i) => i === index ? { ...entry, [field]: value } : entry)
    }));
  };
  
  const removeSkillEntry = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(entry => entry.id !== id)
    }));
  };

  // Project Handlers
  const addProjectEntry = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: crypto.randomUUID(), name: '', description: '', technologies: '', link: '' }]
    }));
  };

  const handleProjectChange = (index: number, field: keyof ProjectEntry, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((entry, i) => i === index ? { ...entry, [field]: value } : entry)
    }));
  };

  const removeProjectEntry = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(entry => entry.id !== id)
    }));
  };


  return (
    <div className="space-y-6">
      <SectionCard title="Job Description (Optional for AI)" icon={<FileText className="h-5 w-5 text-muted-foreground" />}>
        <div className="space-y-2">
          <Label htmlFor="job-description-ai">Paste Job Description</Label>
          <Textarea
            id="job-description-ai"
            placeholder="Paste the job description here to tailor AI suggestions..."
            value={jobDescriptionForAI}
            onChange={(e) => setJobDescriptionForAI(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">This will help AI provide more relevant suggestions for your resume sections.</p>
        </div>
      </SectionCard>

      <SectionCard title="Personal Information" icon={<UserCircle2 className="h-5 w-5 text-muted-foreground" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label htmlFor="name">Full Name</Label><Input id="name" value={resumeData.personalInfo.name} onChange={e => handlePersonalInfoChange('name', e.target.value)} placeholder="e.g. Jane Doe" /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={e => handlePersonalInfoChange('email', e.target.value)} placeholder="e.g. jane.doe@example.com" /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={resumeData.personalInfo.phone} onChange={e => handlePersonalInfoChange('phone', e.target.value)} placeholder="e.g. (123) 456-7890" /></div>
          <div><Label htmlFor="linkedin">LinkedIn Profile URL</Label><Input id="linkedin" value={resumeData.personalInfo.linkedin} onChange={e => handlePersonalInfoChange('linkedin', e.target.value)} placeholder="e.g. linkedin.com/in/janedoe" /></div>
          <div><Label htmlFor="github">GitHub Profile URL</Label><Input id="github" value={resumeData.personalInfo.github} onChange={e => handlePersonalInfoChange('github', e.target.value)} placeholder="e.g. github.com/janedoe" /></div>
          <div><Label htmlFor="portfolio">Portfolio URL</Label><Input id="portfolio" value={resumeData.personalInfo.portfolio} onChange={e => handlePersonalInfoChange('portfolio', e.target.value)} placeholder="e.g. janedoe.com" /></div>
          <div><Label htmlFor="photoUrl">Profile Photo URL</Label><Input id="photoUrl" value={resumeData.personalInfo.photoUrl} onChange={e => handlePersonalInfoChange('photoUrl', e.target.value)} placeholder="https://placehold.co/100x100.png" /></div>
        </div>
      </SectionCard>

      <SectionCard title="Professional Summary" icon={<FileText className="h-5 w-5 text-muted-foreground" />}>
        <Textarea
          placeholder="Write a brief summary of your career achievements and goals..."
          value={resumeData.summary}
          onChange={e => handleSummaryChange(e.target.value)}
          rows={5}
        />
        <Button variant="outline" size="sm" className="mt-2" onClick={() => openAISuggestionModal('summary', resumeData.summary, 'Professional Summary')}>
          <Wand2 className="mr-2 h-4 w-4" /> Get AI Suggestion
        </Button>
      </SectionCard>

      <SectionCard
        title="Work Experience"
        icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
        actions={<Button variant="outline" size="sm" onClick={addExperienceEntry}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>}
      >
        {resumeData.experience.map((entry, index) => (
          <div key={entry.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-background/50 shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeExperienceEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor={`jobTitle-${entry.id}`}>Job Title</Label><Input id={`jobTitle-${entry.id}`} value={entry.jobTitle} onChange={e => handleExperienceChange(index, 'jobTitle', e.target.value)} placeholder="e.g. Software Engineer" /></div>
              <div><Label htmlFor={`company-${entry.id}`}>Company</Label><Input id={`company-${entry.id}`} value={entry.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} placeholder="e.g. Tech Solutions Inc." /></div>
              <div><Label htmlFor={`location-${entry.id}`}>Location</Label><Input id={`location-${entry.id}`} value={entry.location} onChange={e => handleExperienceChange(index, 'location', e.target.value)} placeholder="e.g. San Francisco, CA" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor={`startDate-${entry.id}`}>Start Date</Label><Input id={`startDate-${entry.id}`} type="month" value={entry.startDate} onChange={e => handleExperienceChange(index, 'startDate', e.target.value)} /></div>
              <div><Label htmlFor={`endDate-${entry.id}`}>End Date</Label><Input id={`endDate-${entry.id}`} type="month" value={entry.endDate} onChange={e => handleExperienceChange(index, 'endDate', e.target.value)} placeholder="Present or YYYY-MM" /></div>
            </div>
            <div>
              <Label htmlFor={`description-${entry.id}`}>Description</Label>
              <Textarea id={`description-${entry.id}`} value={entry.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={4} />
              <Button variant="outline" size="sm" className="mt-2" onClick={() => openAISuggestionModal(`experience.${index}.description` as const, entry.description, `Experience: ${entry.jobTitle} at ${entry.company}`, index)}>
                <Wand2 className="mr-2 h-4 w-4" /> Get AI Suggestion
              </Button>
            </div>
          </div>
        ))}
      </SectionCard>
      
      <SectionCard
        title="Education"
        icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />}
        actions={<Button variant="outline" size="sm" onClick={addEducationEntry}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>}
      >
        {resumeData.education.map((entry, index) => (
          <div key={entry.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-background/50 shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeEducationEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor={`degree-${entry.id}`}>Degree/Certificate</Label><Input id={`degree-${entry.id}`} value={entry.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} placeholder="e.g. B.S. in Computer Science" /></div>
              <div><Label htmlFor={`institution-${entry.id}`}>Institution</Label><Input id={`institution-${entry.id}`} value={entry.institution} onChange={e => handleEducationChange(index, 'institution', e.target.value)} placeholder="e.g. University of Example" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor={`eduLocation-${entry.id}`}>Location</Label><Input id={`eduLocation-${entry.id}`} value={entry.location} onChange={e => handleEducationChange(index, 'location', e.target.value)} placeholder="e.g. City, State" /></div>
              <div><Label htmlFor={`gradDate-${entry.id}`}>Graduation Date</Label><Input id={`gradDate-${entry.id}`} type="month" value={entry.graduationDate} onChange={e => handleEducationChange(index, 'graduationDate', e.target.value)} /></div>
            </div>
            <div><Label htmlFor={`gpa-${entry.id}`}>GPA (Optional)</Label><Input id={`gpa-${entry.id}`} value={entry.gpa} onChange={e => handleEducationChange(index, 'gpa', e.target.value)} placeholder="e.g. 3.8/4.0" /></div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Skills"
        icon={<Lightbulb className="h-5 w-5 text-muted-foreground" />}
        actions={<Button variant="outline" size="sm" onClick={addSkillEntry}><PlusCircle className="mr-2 h-4 w-4" /> Add Skill</Button>}
      >
        {resumeData.skills.map((entry, index) => (
          <div key={entry.id} className="flex items-end gap-2 p-3 border rounded-md mb-3 relative bg-background/50 shadow-sm">
            <div className="flex-grow"><Label htmlFor={`skillName-${entry.id}`}>Skill</Label><Input id={`skillName-${entry.id}`} value={entry.name} onChange={e => handleSkillChange(index, 'name', e.target.value)} placeholder="e.g. JavaScript" /></div>
            <div className="w-1/3">
              <Label htmlFor={`skillProficiency-${entry.id}`}>Proficiency</Label>
              <Select value={entry.proficiency} onValueChange={value => handleSkillChange(index, 'proficiency', value as SkillEntry['proficiency'])}>
                <SelectTrigger id={`skillProficiency-${entry.id}`}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 self-center mb-1" onClick={() => removeSkillEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Projects"
        icon={<FolderGit2 className="h-5 w-5 text-muted-foreground" />}
        actions={<Button variant="outline" size="sm" onClick={addProjectEntry}><PlusCircle className="mr-2 h-4 w-4" /> Add Project</Button>}
      >
        {resumeData.projects.map((entry, index) => (
          <div key={entry.id} className="space-y-3 p-4 border rounded-md mb-4 relative bg-background/50 shadow-sm">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => removeProjectEntry(entry.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor={`projectName-${entry.id}`}>Project Name</Label><Input id={`projectName-${entry.id}`} value={entry.name} onChange={e => handleProjectChange(index, 'name', e.target.value)} placeholder="e.g. My Awesome App" /></div>
              <div><Label htmlFor={`projectTech-${entry.id}`}>Technologies</Label><Input id={`projectTech-${entry.id}`} value={entry.technologies} onChange={e => handleProjectChange(index, 'technologies', e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL" /></div>
            </div>
            <div><Label htmlFor={`projectLink-${entry.id}`}>Project Link (Optional)</Label><Input id={`projectLink-${entry.id}`} value={entry.link} onChange={e => handleProjectChange(index, 'link', e.target.value)} placeholder="e.g. https://github.com/user/project" /></div>
            <div>
              <Label htmlFor={`projectDesc-${entry.id}`}>Description</Label>
              <Textarea id={`projectDesc-${entry.id}`} value={entry.description} onChange={e => handleProjectChange(index, 'description', e.target.value)} placeholder="Describe your project..." rows={3} />
               <Button variant="outline" size="sm" className="mt-2" onClick={() => openAISuggestionModal(`projects.${index}.description` as const, entry.description, `Project: ${entry.name}`, index)}>
                <Wand2 className="mr-2 h-4 w-4" /> Get AI Suggestion
              </Button>
            </div>
          </div>
        ))}
      </SectionCard>


      {isAISuggestionModalOpen && (
        <AISuggestionModal
          isOpen={isAISuggestionModalOpen}
          onClose={() => setIsAISuggestionModalOpen(false)}
          currentText={aiSuggestionTarget.text}
          onApplySuggestion={handleApplyAISuggestion}
          context={aiSuggestionTarget.context}
          jobDescription={jobDescriptionForAI}
        />
      )}
    </div>
  );
};

export default ResumeForm;
