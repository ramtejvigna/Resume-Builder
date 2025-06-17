// Core Resume Data Types
export interface PersonalInfo {
    name: string
    email: string
    phone: string
    linkedin: string
    github: string
    portfolio: string
    photoUrl: string
}

export interface ExperienceEntry {
    id: string
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
}

export interface EducationEntry {
    id: string
    degree: string
    institution: string
    location: string
    graduationDate: string
    gpa?: string
}

export interface SkillEntry {
    id: string
    name: string
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

export interface ProjectEntry {
    id: string
    name: string
    description: string
    technologies: string
    link: string
}

export interface ResumeData {
    personalInfo: PersonalInfo
    summary: string
    experience: ExperienceEntry[]
    education: EducationEntry[]
    skills: SkillEntry[]
    projects: ProjectEntry[]
}

// Enhanced Template Types
export type TextAlign = "left" | "center" | "right"
export type LayoutType = "single-column" | "two-column" | "sidebar" | "modern" | "creative"
export type BulletStyle = "disc" | "circle" | "square" | "none"
export type TextTransform = "none" | "uppercase" | "capitalize"

export interface EnhancedTemplateStyles {
    // Typography
    fontFamily: string
    fontSize: string
    lineHeight: string
    fontWeight: {
        normal: string
        bold: string
        light: string
    }

    // Colors
    colors: {
        primary: string
        secondary: string
        accent: string
        background: string
        text: string
        muted: string
    }

    // Spacing
    spacing: {
        sectionSpacing: string
        itemSpacing: string
        paragraphSpacing: string
        margins: {
            top: string
            right: string
            bottom: string
            left: string
        }
    }

    // Layout
    layout: {
        type: LayoutType
        headerAlignment: TextAlign
        sectionDividers: boolean
        borderRadius: string
        shadows: boolean
    }

    // Section-specific styles
    sections: {
        header: {
            backgroundColor: string
            textColor: string
            padding: string
            borderBottom: string
        }
        sectionHeaders: {
            fontSize: string
            color: string
            borderBottom: string
            textTransform: TextTransform
            fontWeight: string
        }
        content: {
            bulletStyle: BulletStyle
            linkColor: string
            linkDecoration: "none" | "underline"
        }
    }

    // Advanced customization
    customCSS?: string
}

// Backward compatible TemplateOptions (legacy)
export interface TemplateOptions {
    fontFamily: string
    fontSize: string
    textAlign: TextAlign
    colors?: {
        primary: string
        secondary: string
        accent: string
    }
    spacing?: {
        sectionSpacing: string
        itemSpacing: string
    }
}

// Enhanced Template Options (extends legacy for compatibility)
export interface EnhancedTemplateOptions extends EnhancedTemplateStyles {
    showPhoto: boolean
    sectionsOrder: string[]
    sectionsVisibility: Record<string, boolean>
    pageBreaks: boolean
    watermark?: string
}

// PDF Generation Options
export interface PDFGenerationOptions {
    format: "A4" | "Letter" | "Legal"
    orientation: "portrait" | "landscape"
    quality: "standard" | "high" | "print"
    includeLinks: boolean
    embedFonts: boolean
    compression: boolean
}

// Updated Resume Template Interface
export interface ResumeTemplate {
    id: string
    name: string
    template_type: string
    description: string
    preview_image?: string
    css_styles: {
        fontFamily: string
        fontSize: string
        lineHeight: string
        fontWeight?: {
            normal: string
            bold: string
            light: string
        }
        colors: {
            primary: string
            secondary: string
            accent: string
            background?: string
            text?: string
            muted?: string
        }
        spacing: {
            sectionSpacing: string
            itemSpacing: string
            paragraphSpacing?: string
            margins?: {
                top: string
                right: string
                bottom: string
                left: string
            }
        }
        sections?: {
            header?: {
                backgroundColor: string
                textColor: string
                padding: string
                borderBottom: string
            }
            sectionHeaders?: {
                fontSize: string
                color: string
                borderBottom: string
                textTransform: TextTransform
                fontWeight: string
            }
            content?: {
                bulletStyle: BulletStyle
                linkColor: string
                linkDecoration: "none" | "underline"
            }
        }
        customCSS?: string
    }
    layout_config: {
        layout: LayoutType
        sections_order: string[]
        show_photo: boolean
        bullet_style: BulletStyle
        headerAlignment?: TextAlign
        sectionDividers?: boolean
        borderRadius?: string
        shadows?: boolean
        sections_visibility?: Record<string, boolean>
    }
    ats_score: number
    is_premium: boolean
    created_at: string
    updated_at: string
}

// Updated Saved Resume Interface
export interface SavedResume {
    id: string
    title: string
    template?: ResumeTemplate
    template_name?: string
    personal_info: PersonalInfo
    professional_summary: string
    experience: ExperienceEntry[]
    education: EducationEntry[]
    skills: SkillEntry[]
    projects: ProjectEntry[]
    additional_sections: Record<string, any>
    template_options: TemplateOptions | EnhancedTemplateOptions
    is_public: boolean
    pdf_file?: string
    created_at: string
    updated_at: string
}

// Editing Target Types
export type EditingTarget =
    | { section: "personalInfo"; field: keyof PersonalInfo }
    | { section: "summary" }
    | { section: "experience"; index: number; field: keyof ExperienceEntry }
    | { section: "education"; index: number; field: keyof EducationEntry }
    | { section: "skills"; index: number; field: keyof SkillEntry }
    | { section: "projects"; index: number; field: keyof ProjectEntry }

// Template Preset Types
export interface TemplatePreset {
    id: string
    name: string
    description: string
    options: EnhancedTemplateOptions
    isDefault: boolean
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
    tags: string[]
}

// Utility function to convert legacy TemplateOptions to EnhancedTemplateOptions
export function convertToEnhancedOptions(legacy: TemplateOptions): EnhancedTemplateOptions {
    return {
        fontFamily: legacy.fontFamily,
        fontSize: legacy.fontSize,
        lineHeight: "1.5",
        fontWeight: {
            normal: "400",
            bold: "600",
            light: "300",
        },
        colors: {
            primary: legacy.colors?.primary || "#000000",
            secondary: legacy.colors?.secondary || "#333333",
            accent: legacy.colors?.accent || "#2E86AB",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
        spacing: {
            sectionSpacing: legacy.spacing?.sectionSpacing || "16px",
            itemSpacing: legacy.spacing?.itemSpacing || "8px",
            paragraphSpacing: "8px",
            margins: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        },
        layout: {
            type: "single-column",
            headerAlignment: legacy.textAlign,
            sectionDividers: true,
            borderRadius: "0px",
            shadows: false,
        },
        sections: {
            header: {
                backgroundColor: "#ffffff",
                textColor: legacy.colors?.primary || "#000000",
                padding: "0px",
                borderBottom: "none",
            },
            sectionHeaders: {
                fontSize: "16px",
                color: legacy.colors?.primary || "#000000",
                borderBottom: `2px solid ${legacy.colors?.accent || "#2E86AB"}`,
                textTransform: "uppercase",
                fontWeight: "600",
            },
            content: {
                bulletStyle: "disc",
                linkColor: legacy.colors?.accent || "#2E86AB",
                linkDecoration: "none",
            },
        },
        showPhoto: false,
        sectionsOrder: ["summary", "experience", "education", "skills", "projects"],
        sectionsVisibility: {
            summary: true,
            experience: true,
            education: true,
            skills: true,
            projects: true,
        },
        pageBreaks: false,
    }
}

// Utility function to convert ResumeTemplate to EnhancedTemplateOptions
export function templateToEnhancedOptions(template: ResumeTemplate): EnhancedTemplateOptions {
    const css = template.css_styles
    const layout = template.layout_config

    return {
        fontFamily: css.fontFamily,
        fontSize: css.fontSize,
        lineHeight: css.lineHeight,
        fontWeight: css.fontWeight || {
            normal: "400",
            bold: "600",
            light: "300",
        },
        colors: {
            primary: css.colors.primary,
            secondary: css.colors.secondary,
            accent: css.colors.accent,
            background: css.colors.background || "#ffffff",
            text: css.colors.text || "#111827",
            muted: css.colors.muted || "#6b7280",
        },
        spacing: {
            sectionSpacing: css.spacing.sectionSpacing,
            itemSpacing: css.spacing.itemSpacing,
            paragraphSpacing: css.spacing.paragraphSpacing || "8px",
            margins: css.spacing.margins || {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        },
        layout: {
            type: layout.layout as LayoutType,
            headerAlignment: layout.headerAlignment || "left",
            sectionDividers: layout.sectionDividers || false,
            borderRadius: layout.borderRadius || "0px",
            shadows: layout.shadows || false,
        },
        sections: {
            header: css.sections?.header || {
                backgroundColor: "#ffffff",
                textColor: css.colors.primary,
                padding: "0px",
                borderBottom: "none",
            },
            sectionHeaders: css.sections?.sectionHeaders || {
                fontSize: "16px",
                color: css.colors.primary,
                borderBottom: `2px solid ${css.colors.accent}`,
                textTransform: "uppercase",
                fontWeight: "600",
            },
            content: css.sections?.content || {
                bulletStyle: layout.bullet_style as BulletStyle,
                linkColor: css.colors.accent,
                linkDecoration: "none",
            },
        },
        customCSS: css.customCSS,
        showPhoto: layout.show_photo,
        sectionsOrder: layout.sections_order,
        sectionsVisibility: layout.sections_visibility || {
            summary: true,
            experience: true,
            education: true,
            skills: true,
            projects: true,
        },
        pageBreaks: false,
    }
}

// Initial Data
export const initialResumeData: ResumeData = {
    personalInfo: {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        portfolio: "",
        photoUrl: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
}

export const initialTemplateOptions: TemplateOptions = {
    fontFamily: "Inter, sans-serif",
    fontSize: "11px",
    textAlign: "left",
    colors: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#2E86AB",
    },
    spacing: {
        sectionSpacing: "16px",
        itemSpacing: "8px",
    },
}

export const initialEnhancedTemplateOptions: EnhancedTemplateOptions = {
    fontFamily: "Inter, sans-serif",
    fontSize: "11px",
    lineHeight: "1.5",
    fontWeight: {
        normal: "400",
        bold: "600",
        light: "300",
    },
    colors: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#2E86AB",
        background: "#ffffff",
        text: "#111827",
        muted: "#6b7280",
    },
    spacing: {
        sectionSpacing: "16px",
        itemSpacing: "8px",
        paragraphSpacing: "8px",
        margins: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
    },
    layout: {
        type: "single-column",
        headerAlignment: "left",
        sectionDividers: true,
        borderRadius: "0px",
        shadows: false,
    },
    sections: {
        header: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            padding: "0px",
            borderBottom: "none",
        },
        sectionHeaders: {
            fontSize: "16px",
            color: "#000000",
            borderBottom: "2px solid #2E86AB",
            textTransform: "uppercase",
            fontWeight: "600",
        },
        content: {
            bulletStyle: "disc",
            linkColor: "#2E86AB",
            linkDecoration: "none",
        },
    },
    showPhoto: false,
    sectionsOrder: ["summary", "experience", "education", "skills", "projects"],
    sectionsVisibility: {
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
    },
    pageBreaks: false,
}
