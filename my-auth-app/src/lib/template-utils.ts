import { TemplateOptions, EnhancedTemplateOptions } from '@/types/resume';

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
};

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
  };
} 