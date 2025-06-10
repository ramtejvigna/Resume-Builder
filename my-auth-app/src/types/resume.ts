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
    colors?: {
        primary: string;
        secondary: string;
        accent: string;
    };
    spacing?: {
        sectionSpacing: string;
        itemSpacing: string;
    };
}

export interface ResumeTemplate {
    id: string;
    name: string;
    template_type: string;
    description: string;
    preview_image?: string;
    css_styles: {
        fontFamily: string;
        fontSize: string;
        lineHeight: string;
        colors: {
            primary: string;
            secondary: string;
            accent: string;
        };
        spacing: {
            sectionSpacing: string;
            itemSpacing: string;
        };
    };
    layout_config: {
        layout: string;
        sections_order: string[];
        show_photo: boolean;
        bullet_style: string;
    };
    ats_score: number;
    is_premium: boolean;
    created_at: string;
    updated_at: string;
}

export interface SavedResume {
    id: string;
    title: string;
    template?: ResumeTemplate;
    template_name?: string;
    personal_info: PersonalInfo;
    professional_summary: string;
    experience: ExperienceEntry[];
    education: EducationEntry[];
    skills: SkillEntry[];
    projects: ProjectEntry[];
    additional_sections: Record<string, any>;
    template_options: TemplateOptions;
    is_public: boolean;
    pdf_file?: string;
    created_at: string;
    updated_at: string;
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
    colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#2E86AB'
    },
    spacing: {
        sectionSpacing: '16px',
        itemSpacing: '8px'
    }
};
