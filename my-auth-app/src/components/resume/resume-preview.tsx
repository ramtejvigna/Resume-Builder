"use client"

import type React from "react"

import type { FC } from "react"
import type { ResumeData } from "@/types/resume"
import type { EnhancedTemplateOptions, EditingTarget } from "@/types/resume"
import { cn } from "@/lib/utils"
import {
  Mail,
  Phone,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FolderGit2,
  FileTextIcon,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useCallback } from "react"
import Link from "next/link"

interface EnhancedResumePreviewProps {
  resumeData: ResumeData
  templateOptions: EnhancedTemplateOptions
  onEdit: (target: EditingTarget, currentText: string, label: string, isTextarea?: boolean) => void
  isPreviewMode?: boolean
  selectedTemplate?: any
}

const ResumePreview: FC<EnhancedResumePreviewProps> = ({
  resumeData,
  templateOptions,
  onEdit,
  isPreviewMode = false,
  selectedTemplate,
}) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData

  // Generate comprehensive styles from template options
  const generatedStyles = useMemo(() => {
    const styles = {
      fontFamily: templateOptions.fontFamily,
      fontSize: templateOptions.fontSize,
      lineHeight: templateOptions.lineHeight,
      color: templateOptions.colors.text,
      backgroundColor: templateOptions.colors.background,
      "--primary-color": templateOptions.colors.primary,
      "--secondary-color": templateOptions.colors.secondary,
      "--accent-color": templateOptions.colors.accent,
      "--background-color": templateOptions.colors.background,
      "--text-color": templateOptions.colors.text,
      "--muted-color": templateOptions.colors.muted,
      "--section-spacing": templateOptions.spacing.sectionSpacing,
      "--item-spacing": templateOptions.spacing.itemSpacing,
      "--paragraph-spacing": templateOptions.spacing.paragraphSpacing,
      "--font-weight-normal": templateOptions.fontWeight?.normal,
      "--font-weight-bold": templateOptions.fontWeight?.bold,
      "--font-weight-light": templateOptions.fontWeight?.light,
      "--header-bg": templateOptions.sections?.header?.backgroundColor,
      "--header-text": templateOptions.sections?.header?.textColor,
      "--header-padding": templateOptions.sections?.header?.padding,
      "--section-header-color": templateOptions.sections?.sectionHeaders?.color,
      "--section-header-border": templateOptions.sections?.sectionHeaders?.borderBottom,
      "--link-color": templateOptions.sections?.content?.linkColor,
      "--border-radius": templateOptions.layout?.borderRadius,
      padding: `${templateOptions.spacing?.margins?.top} ${templateOptions.spacing?.margins?.right} ${templateOptions.spacing?.margins?.bottom} ${templateOptions.spacing?.margins?.left}`,
    } as React.CSSProperties

    return styles
  }, [templateOptions])

  // Layout-specific classes
  const layoutClasses = useMemo(() => {
    const baseClasses = "bg-white text-gray-800 max-w-4xl mx-auto"

    switch (templateOptions.layout?.type) {
      case "two-column":
        return cn(baseClasses, "grid grid-cols-3 gap-6")
      case "sidebar":
        return cn(baseClasses, "grid grid-cols-4 gap-6")
      case "modern":
        return cn(baseClasses, "border-l-4 shadow-lg", {
          "shadow-xl": templateOptions.layout.shadows,
        })
      case "creative":
        return cn(baseClasses, "bg-gradient-to-br from-gray-50 to-white rounded-lg", {
          "shadow-xl": templateOptions.layout.shadows,
        })
      default:
        return cn(baseClasses, "space-y-6")
    }
  }, [templateOptions.layout])

  const headerClasses = useMemo(() => {
    const alignment = templateOptions.layout?.headerAlignment
    return cn("mb-6", {
      "text-left": alignment === "left",
      "text-center": alignment === "center",
      "text-right": alignment === "right",
    })
  }, [templateOptions.layout?.headerAlignment])

  const sectionHeaderClasses = useMemo(() => {
    return cn("font-semibold flex items-center mb-4", {
      uppercase: templateOptions.sections?.sectionHeaders?.textTransform === "uppercase",
      capitalize: templateOptions.sections?.sectionHeaders?.textTransform === "capitalize",
      "border-b-2 pb-2": templateOptions.layout?.sectionDividers,
    })
  }, [templateOptions.sections?.sectionHeaders?.textTransform, templateOptions.layout?.sectionDividers])

  const clickableClassName = useMemo(
    () =>
      isPreviewMode
        ? ""
        : "cursor-pointer hover:bg-blue-50 hover:bg-opacity-50 p-1 -m-1 rounded transition-all duration-150 inline-block border border-transparent hover:border-blue-200",
    [isPreviewMode],
  )

  const clickableBlockClassName = useMemo(
    () =>
      isPreviewMode
        ? ""
        : "cursor-pointer hover:bg-blue-50 hover:bg-opacity-50 p-2 -m-2 rounded transition-all duration-150 block border border-transparent hover:border-blue-200",
    [isPreviewMode],
  )

  const handleClick = useCallback(
    (callback: () => void) => {
      if (!isPreviewMode) {
        callback()
      }
    },
    [isPreviewMode],
  )

  // Custom CSS injection
  useEffect(() => {
    if (templateOptions.customCSS) {
      const styleId = "custom-resume-styles"
      let styleElement = document.getElementById(styleId) as HTMLStyleElement

      if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }

      styleElement.textContent = templateOptions.customCSS

      return () => {
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement)
        }
      }
    }
  }, [templateOptions.customCSS])

  const renderHeader = () => (
    <div
      className={headerClasses}
      style={{
        backgroundColor: templateOptions.sections?.header?.backgroundColor,
        color: templateOptions.sections?.header?.textColor,
        padding: templateOptions.sections?.header?.padding,
        borderBottom: templateOptions.sections?.header?.borderBottom,
        borderRadius: templateOptions.layout?.borderRadius,
      }}
    >
      {personalInfo.photoUrl && templateOptions.showPhoto && (
        <div
          className={cn("w-24 h-24 rounded-full overflow-hidden border-2 mb-4", {
            "mx-auto": templateOptions.layout?.headerAlignment === "center",
            "mx-0": templateOptions.layout?.headerAlignment !== "center",
          })}
        >
          <Image
            src={personalInfo.photoUrl || "/placeholder.svg"}
            alt={personalInfo.name || "Profile"}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
      )}

      <h1
        className={cn("mb-2", clickableClassName)}
        style={{
          fontSize: `calc(${templateOptions.fontSize} * 2.2)`,
          fontWeight: templateOptions.fontWeight.bold,
          color: templateOptions.sections.header.textColor || templateOptions.colors.primary,
          marginBottom: templateOptions.spacing.itemSpacing,
        }}
        onClick={() =>
          handleClick(() => onEdit({ section: "personalInfo", field: "name" }, personalInfo.name, "Full Name", false))
        }
      >
        {personalInfo.name || "Your Name"}
      </h1>

      <div
        className={cn("flex items-center flex-wrap gap-x-4 gap-y-1 text-sm", {
          "justify-center": templateOptions.layout?.headerAlignment === "center",
          "justify-start": templateOptions.layout?.headerAlignment === "left",
          "justify-end": templateOptions.layout?.headerAlignment === "right",
        })}
      >
        {personalInfo.email && (
          <Link
            href={`mailto:${personalInfo.email}`}
            className={cn("resume-header-links", clickableClassName)}
            style={{ color: templateOptions.sections?.content?.linkColor }}
            onClick={() =>
              handleClick(() =>
                onEdit({ section: "personalInfo", field: "email" }, personalInfo.email, "Email Address", false),
              )
            }
          >
            <Mail className="mr-1 h-3 w-3" />
            {personalInfo.email}
          </Link>
        )}
        {personalInfo.phone && (
          <Link
            href={`tel:${personalInfo.phone}`}
            className={cn("resume-header-links", clickableClassName)}
            style={{ color: templateOptions.sections?.content?.linkColor }}
            onClick={() =>
              handleClick(() =>
                onEdit({ section: "personalInfo", field: "phone" }, personalInfo.phone, "Phone Number", false),
              )
            }
          >
            <Phone className="mr-1 h-3 w-3" />
            {personalInfo.phone}
          </Link>
        )}
        {personalInfo.linkedin && (
          <Link
            href={personalInfo.linkedin}
            className={cn("resume-header-links", clickableClassName)}
            style={{ color: templateOptions.sections?.content?.linkColor }}
            onClick={() =>
              handleClick(() =>
                onEdit(
                  { section: "personalInfo", field: "linkedin" },
                  personalInfo.linkedin,
                  "LinkedIn Profile URL",
                  false,
                ),
              )
            }
          >
            <Linkedin className="mr-1 h-3 w-3" />
            LinkedIn
          </Link>
        )}
        {personalInfo.github && (
          <Link
            href={personalInfo.github}
            className={cn("resume-header-links", clickableClassName)}
            style={{ color: templateOptions.sections.content.linkColor }}
            onClick={() =>
              handleClick(() =>
                onEdit({ section: "personalInfo", field: "github" }, personalInfo.github, "GitHub Profile URL", false),
              )
            }
          >
            <Github className="mr-1 h-3 w-3" />
            GitHub
          </Link>
        )}
        {personalInfo.portfolio && (
          <Link
            href={personalInfo.portfolio}
            className={cn("resume-header-links", clickableClassName)}
            style={{ color: templateOptions.sections?.content?.linkColor }}
            onClick={() =>
              handleClick(() =>
                onEdit({ section: "personalInfo", field: "portfolio" }, personalInfo.portfolio, "Portfolio URL", false),
              )
            }
          >
            <Globe className="mr-1 h-3 w-3" />
            Portfolio
          </Link>
        )}
      </div>
    </div>
  )

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <section style={{ marginBottom: templateOptions.spacing.sectionSpacing }}>
      <h2
        className={sectionHeaderClasses}
        style={{
          fontSize: templateOptions.sections?.sectionHeaders?.fontSize,
          color: templateOptions.sections?.sectionHeaders?.color,
          borderBottomColor: templateOptions.colors.accent,
          borderBottom: templateOptions.layout?.sectionDividers
            ? templateOptions.sections?.sectionHeaders?.borderBottom
            : "none",
          fontWeight: templateOptions.sections?.sectionHeaders?.fontWeight,
          textTransform: templateOptions.sections?.sectionHeaders?.textTransform as any,
        }}
      >
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )

  return (
    <div id="resume-preview" className="resume-container">
      <div style={generatedStyles} className={layoutClasses}>
        {renderHeader()}

        {/* Render sections based on sectionsOrder */}
        {templateOptions.sectionsOrder.map((sectionKey) => {
          if (!templateOptions.sectionsVisibility[sectionKey]) return null

          switch (sectionKey) {
            case "summary":
              return summary
                ? renderSection(
                    "Professional Summary",
                    <FileTextIcon className="mr-2 h-5 w-5" style={{ color: templateOptions.colors.accent }} />,
                    <p
                      className={cn("whitespace-pre-wrap", clickableBlockClassName)}
                      style={{
                        color: templateOptions.colors.text,
                        marginBottom: templateOptions.spacing?.paragraphSpacing,
                      }}
                      onClick={() =>
                        handleClick(() => onEdit({ section: "summary" }, summary, "Professional Summary", true))
                      }
                    >
                      {summary}
                    </p>,
                  )
                : null

            case "experience":
              return experience.length > 0
                ? renderSection(
                    "Work Experience",
                    <Briefcase className="mr-2 h-5 w-5" style={{ color: templateOptions.colors.accent }} />,
                    <div className="space-y-4">
                      {experience.map((exp, index) => (
                        <div key={exp.id} style={{ marginBottom: templateOptions.spacing.itemSpacing }}>
                          <h3
                            className={cn("font-semibold", clickableClassName)}
                            style={{
                              color: templateOptions.colors?.primary,
                              fontWeight: templateOptions.fontWeight?.bold,
                            }}
                            onClick={() =>
                              handleClick(() =>
                                onEdit(
                                  { section: "experience", index, field: "jobTitle" },
                                  exp.jobTitle,
                                  `Job Title for ${exp.company || "Experience Item " + (index + 1)}`,
                                  false,
                                ),
                              )
                            }
                          >
                            {exp.jobTitle || "Job Title"}
                          </h3>
                          <p className="text-sm" style={{ color: templateOptions.colors?.secondary }}>
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "experience", index, field: "company" },
                                    exp.company,
                                    `Company for ${exp.jobTitle || "Experience Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {exp.company || "Company"}
                            </span>{" "}
                            |{" "}
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "experience", index, field: "location" },
                                    exp.location,
                                    `Location for ${exp.jobTitle || "Experience Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {exp.location || "Location"}
                            </span>
                          </p>
                          <p className="text-xs" style={{ color: templateOptions.colors.muted }}>
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "experience", index, field: "startDate" },
                                    exp.startDate,
                                    `Start Date for ${exp.jobTitle || "Experience Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {exp.startDate || "Start Date"}
                            </span>{" "}
                            -{" "}
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "experience", index, field: "endDate" },
                                    exp.endDate,
                                    `End Date for ${exp.jobTitle || "Experience Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {exp.endDate || "End Date"}
                            </span>
                          </p>
                          <p
                            className={cn("mt-2 whitespace-pre-wrap", clickableBlockClassName)}
                            style={{ color: templateOptions.colors.text }}
                            onClick={() =>
                              handleClick(() =>
                                onEdit(
                                  { section: "experience", index, field: "description" },
                                  exp.description,
                                  `Description for ${exp.jobTitle || "Experience Item " + (index + 1)}`,
                                  true,
                                ),
                              )
                            }
                          >
                            {exp.description || "Job description..."}
                          </p>
                        </div>
                      ))}
                    </div>,
                  )
                : null

            case "education":
              return education.length > 0
                ? renderSection(
                    "Education",
                    <GraduationCap className="mr-2 h-5 w-5" style={{ color: templateOptions.colors.accent }} />,
                    <div className="space-y-3">
                      {education.map((edu, index) => (
                        <div key={edu.id} style={{ marginBottom: templateOptions.spacing.itemSpacing }}>
                          <h3
                            className={cn("font-semibold", clickableClassName)}
                            style={{
                              color: templateOptions.colors.primary,
                              fontWeight: templateOptions.fontWeight.bold,
                            }}
                            onClick={() =>
                              handleClick(() =>
                                onEdit(
                                  { section: "education", index, field: "degree" },
                                  edu.degree,
                                  `Degree for ${edu.institution || "Education Item " + (index + 1)}`,
                                  false,
                                ),
                              )
                            }
                          >
                            {edu.degree || "Degree"}
                          </h3>
                          <p className="text-sm" style={{ color: templateOptions.colors.secondary }}>
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "education", index, field: "institution" },
                                    edu.institution,
                                    `Institution for ${edu.degree || "Education Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {edu.institution || "Institution"}
                            </span>{" "}
                            |{" "}
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "education", index, field: "location" },
                                    edu.location,
                                    `Location for ${edu.degree || "Education Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {edu.location || "Location"}
                            </span>
                          </p>
                          <p className="text-xs" style={{ color: templateOptions.colors.muted }}>
                            Graduated:{" "}
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "education", index, field: "graduationDate" },
                                    edu.graduationDate,
                                    `Graduation Date for ${edu.degree || "Education Item " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {edu.graduationDate || "Graduation Date"}
                            </span>
                          </p>
                          {edu.gpa && (
                            <p className="text-xs" style={{ color: templateOptions.colors.muted }}>
                              GPA:{" "}
                              <span
                                className={clickableClassName}
                                onClick={() =>
                                  handleClick(() =>
                                    onEdit(
                                      { section: "education", index, field: "gpa" },
                                      edu.gpa || "",
                                      `GPA for ${edu.degree || "Education Item " + (index + 1)}`,
                                      false,
                                    ),
                                  )
                                }
                              >
                                {edu.gpa}
                              </span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>,
                  )
                : null

            case "skills":
              return skills.length > 0
                ? renderSection(
                    "Skills",
                    <Lightbulb className="mr-2 h-5 w-5" style={{ color: templateOptions.colors.accent }} />,
                    <ul
                      className="grid grid-cols-2 gap-1"
                      style={{
                        listStyleType: templateOptions.sections.content.bulletStyle,
                        paddingLeft: templateOptions.sections.content.bulletStyle !== "none" ? "1.25rem" : "0",
                      }}
                    >
                      {skills.map((skill, index) => (
                        <li key={`skill-${skill.id || index}`} style={{ color: templateOptions.colors.text }}>
                          <span
                            className={clickableClassName}
                            onClick={() =>
                              handleClick(() =>
                                onEdit({ section: "skills", index, field: "name" }, skill.name, `Skill Name`, false),
                              )
                            }
                          >
                            {skill.name || "Skill Name"}
                          </span>{" "}
                          <span className="text-xs" style={{ color: templateOptions.colors.muted }}>
                            ({skill.proficiency})
                          </span>
                        </li>
                      ))}
                    </ul>,
                  )
                : null

            case "projects":
              return projects.length > 0
                ? renderSection(
                    "Projects",
                    <FolderGit2 className="mr-2 h-5 w-5" style={{ color: templateOptions.colors.accent }} />,
                    <div className="space-y-3">
                      {projects.map((project, index) => (
                        <div
                          key={`project-${project.id || index}`}
                          style={{ marginBottom: templateOptions.spacing.itemSpacing }}
                        >
                          <h3
                            className={cn("font-semibold", clickableClassName)}
                            style={{
                              color: templateOptions.colors.primary,
                              fontWeight: templateOptions.fontWeight.bold,
                            }}
                            onClick={() =>
                              handleClick(() =>
                                onEdit(
                                  { section: "projects", index, field: "name" },
                                  project.name,
                                  `Project Name for ${project.name || "Project " + (index + 1)}`,
                                  false,
                                ),
                              )
                            }
                          >
                            {project.name || "Project Name"}
                          </h3>
                          <p className="text-sm" style={{ color: templateOptions.colors.secondary }}>
                            <span
                              className={clickableClassName}
                              onClick={() =>
                                handleClick(() =>
                                  onEdit(
                                    { section: "projects", index, field: "technologies" },
                                    project.technologies,
                                    `Technologies for ${project.name || "Project " + (index + 1)}`,
                                    false,
                                  ),
                                )
                              }
                            >
                              {project.technologies || "Technologies"}
                            </span>
                          </p>
                          <p
                            className={cn("mt-1 whitespace-pre-wrap", clickableBlockClassName)}
                            style={{ color: templateOptions.colors.text }}
                            onClick={() =>
                              handleClick(() =>
                                onEdit(
                                  { section: "projects", index, field: "description" },
                                  project.description,
                                  `Description for ${project.name || "Project " + (index + 1)}`,
                                  true,
                                ),
                              )
                            }
                          >
                            {project.description || "Project description..."}
                          </p>
                        </div>
                      ))}
                    </div>,
                  )
                : null

            default:
              return null
          }
        })}
      </div>
    </div>
  )
}

export default ResumePreview
