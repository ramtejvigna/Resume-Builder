
export interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    photoUrl: string;
}

export interface ExperienceEntry {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface EducationEntry {
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
}

export interface SkillEntry {
    id: string;
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectEntry {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: SkillEntry[];
    projects: ProjectEntry[];
}

export type TextAlign = 'left' | 'center' | 'right';

export interface TemplateOptions {
    fontFamily: string;
    fontSize: string;
    textAlign: TextAlign;
}

export const initialResumeData: ResumeData = {
    personalInfo: {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        portfolio: '',
        photoUrl: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
};

export const initialTemplateOptions: TemplateOptions = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    textAlign: 'left',
};
