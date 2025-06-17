import type { ResumeData, EnhancedTemplateOptions, PDFGenerationOptions } from "@/types/resume"

export class EnhancedPDFGenerator {
    private static instance: EnhancedPDFGenerator

    public static getInstance(): EnhancedPDFGenerator {
        if (!EnhancedPDFGenerator.instance) {
            EnhancedPDFGenerator.instance = new EnhancedPDFGenerator()
        }
        return EnhancedPDFGenerator.instance
    }

    async generatePDF(
        resumeData: ResumeData,
        templateOptions: EnhancedTemplateOptions,
        pdfOptions: PDFGenerationOptions = {
            format: "A4",
            orientation: "portrait",
            quality: "high",
            includeLinks: true,
            embedFonts: true,
            compression: true,
        },
    ): Promise<Blob> {
        // Create a temporary container for PDF generation
        const container = this.createPDFContainer(resumeData, templateOptions)
        document.body.appendChild(container)

        try {
            // Wait for fonts and images to load
            await this.waitForAssets()

            // Apply PDF-specific styles
            this.applyPDFStyles(container, templateOptions, pdfOptions)

            // Generate PDF using html2canvas and jsPDF
            const pdf = await this.generateFromHTML(container, pdfOptions)

            return pdf
        } finally {
            // Clean up
            document.body.removeChild(container)
        }
    }

    private createPDFContainer(resumeData: ResumeData, templateOptions: EnhancedTemplateOptions): HTMLElement {
        const container = document.createElement("div")
        container.id = "pdf-generation-container"
        container.style.position = "absolute"
        container.style.left = "-9999px"
        container.style.top = "0"
        container.style.width = "794px" // A4 width in pixels at 96 DPI
        container.style.minHeight = "1123px" // A4 height in pixels at 96 DPI
        container.style.backgroundColor = templateOptions.colors.background
        container.style.fontFamily = templateOptions.fontFamily
        container.style.fontSize = templateOptions.fontSize
        container.style.lineHeight = templateOptions.lineHeight
        container.style.color = templateOptions.colors.text
        container.style.padding = `${templateOptions.spacing.margins.top} ${templateOptions.spacing.margins.right} ${templateOptions.spacing.margins.bottom} ${templateOptions.spacing.margins.left}`

        // Generate HTML content
        container.innerHTML = this.generateHTMLContent(resumeData, templateOptions)

        return container
    }

    private generateHTMLContent(resumeData: ResumeData, templateOptions: EnhancedTemplateOptions): string {
        const { personalInfo, summary, experience, education, skills, projects } = resumeData

        let html = ""

        // Header section
        html += this.generateHeaderHTML(personalInfo, templateOptions)

        // Sections based on order
        templateOptions.sectionsOrder.forEach((sectionKey) => {
            if (!templateOptions.sectionsVisibility[sectionKey]) return

            switch (sectionKey) {
                case "summary":
                    if (summary) {
                        html += this.generateSectionHTML("Professional Summary", summary, templateOptions, "summary")
                    }
                    break
                case "experience":
                    if (experience.length > 0) {
                        html += this.generateExperienceHTML(experience, templateOptions)
                    }
                    break
                case "education":
                    if (education.length > 0) {
                        html += this.generateEducationHTML(education, templateOptions)
                    }
                    break
                case "skills":
                    if (skills.length > 0) {
                        html += this.generateSkillsHTML(skills, templateOptions)
                    }
                    break
                case "projects":
                    if (projects.length > 0) {
                        html += this.generateProjectsHTML(projects, templateOptions)
                    }
                    break
            }
        })

        return html
    }

    private generateHeaderHTML(personalInfo: any, templateOptions: EnhancedTemplateOptions): string {
        const headerStyle = `
      background-color: ${templateOptions.sections.header.backgroundColor};
      color: ${templateOptions.sections.header.textColor};
      padding: ${templateOptions.sections.header.padding};
      border-bottom: ${templateOptions.sections.header.borderBottom};
      border-radius: ${templateOptions.layout.borderRadius};
      text-align: ${templateOptions.layout.headerAlignment};
      margin-bottom: ${templateOptions.spacing.sectionSpacing};
    `

        let html = `<div style="${headerStyle}">`

        // Profile photo
        if (personalInfo.photoUrl && templateOptions.showPhoto) {
            const photoStyle = `
        width: 96px;
        height: 96px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid ${templateOptions.colors.primary};
        margin: ${templateOptions.layout.headerAlignment === "center" ? "0 auto 16px auto" : "0 0 16px 0"};
        display: block;
      `
            html += `<img src="${personalInfo.photoUrl}" alt="${personalInfo.name || "Profile"}" style="${photoStyle}" />`
        }

        // Name
        const nameStyle = `
      font-size: calc(${templateOptions.fontSize} * 2.2);
      font-weight: ${templateOptions.fontWeight.bold};
      color: ${templateOptions.sections.header.textColor || templateOptions.colors.primary};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      margin-top: 0;
    `
        html += `<h1 style="${nameStyle}">${personalInfo.name || "Your Name"}</h1>`

        // Contact info
        const contactStyle = `
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 14px;
      justify-content: ${templateOptions.layout.headerAlignment === "center" ? "center" : templateOptions.layout.headerAlignment === "right" ? "flex-end" : "flex-start"};
    `

        html += `<div style="${contactStyle}">`

        if (personalInfo.email) {
            html += `<a href="mailto:${personalInfo.email}" style="color: ${templateOptions.sections.content.linkColor}; text-decoration: ${templateOptions.sections.content.linkDecoration};">${personalInfo.email}</a>`
        }
        if (personalInfo.phone) {
            html += `<a href="tel:${personalInfo.phone}" style="color: ${templateOptions.sections.content.linkColor}; text-decoration: ${templateOptions.sections.content.linkDecoration};">${personalInfo.phone}</a>`
        }
        if (personalInfo.linkedin) {
            html += `<a href="${personalInfo.linkedin}" style="color: ${templateOptions.sections.content.linkColor}; text-decoration: ${templateOptions.sections.content.linkDecoration};">LinkedIn</a>`
        }
        if (personalInfo.github) {
            html += `<a href="${personalInfo.github}" style="color: ${templateOptions.sections.content.linkColor}; text-decoration: ${templateOptions.sections.content.linkDecoration};">GitHub</a>`
        }
        if (personalInfo.portfolio) {
            html += `<a href="${personalInfo.portfolio}" style="color: ${templateOptions.sections.content.linkColor}; text-decoration: ${templateOptions.sections.content.linkDecoration};">Portfolio</a>`
        }

        html += "</div></div>"

        return html
    }

    private generateSectionHTML(
        title: string,
        content: string,
        templateOptions: EnhancedTemplateOptions,
        sectionType: string,
    ): string {
        const sectionStyle = `margin-bottom: ${templateOptions.spacing.sectionSpacing};`

        const headerStyle = `
      font-size: ${templateOptions.sections.sectionHeaders.fontSize};
      color: ${templateOptions.sections.sectionHeaders.color};
      font-weight: ${templateOptions.sections.sectionHeaders.fontWeight};
      text-transform: ${templateOptions.sections.sectionHeaders.textTransform};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      ${templateOptions.layout.sectionDividers ? `border-bottom: ${templateOptions.sections.sectionHeaders.borderBottom}; padding-bottom: 8px;` : ""}
      margin-top: 0;
    `

        const contentStyle = `
      color: ${templateOptions.colors.text};
      margin-bottom: ${templateOptions.spacing.paragraphSpacing};
      white-space: pre-wrap;
      line-height: ${templateOptions.lineHeight};
    `

        return `
      <div style="${sectionStyle}">
        <h2 style="${headerStyle}">${title.toUpperCase()}</h2>
        <p style="${contentStyle}">${content}</p>
      </div>
    `
    }

    private generateExperienceHTML(experience: any[], templateOptions: EnhancedTemplateOptions): string {
        const sectionStyle = `margin-bottom: ${templateOptions.spacing.sectionSpacing};`

        const headerStyle = `
      font-size: ${templateOptions.sections.sectionHeaders.fontSize};
      color: ${templateOptions.sections.sectionHeaders.color};
      font-weight: ${templateOptions.sections.sectionHeaders.fontWeight};
      text-transform: ${templateOptions.sections.sectionHeaders.textTransform};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      ${templateOptions.layout.sectionDividers ? `border-bottom: ${templateOptions.sections.sectionHeaders.borderBottom}; padding-bottom: 8px;` : ""}
      margin-top: 0;
    `

        let html = `
      <div style="${sectionStyle}">
        <h2 style="${headerStyle}">WORK EXPERIENCE</h2>
    `

        experience.forEach((exp) => {
            const itemStyle = `margin-bottom: ${templateOptions.spacing.itemSpacing};`
            const titleStyle = `
        font-weight: ${templateOptions.fontWeight.bold};
        color: ${templateOptions.colors.primary};
        margin-bottom: 4px;
        margin-top: 0;
      `
            const companyStyle = `
        font-size: 14px;
        color: ${templateOptions.colors.secondary};
        margin-bottom: 2px;
      `
            const dateStyle = `
        font-size: 12px;
        color: ${templateOptions.colors.muted};
        margin-bottom: 8px;
      `
            const descStyle = `
        color: ${templateOptions.colors.text};
        white-space: pre-wrap;
        line-height: ${templateOptions.lineHeight};
        margin-bottom: 0;
      `

            html += `
        <div style="${itemStyle}">
          <h3 style="${titleStyle}">${exp.jobTitle || "Job Title"}</h3>
          <p style="${companyStyle}">${exp.company || "Company"} | ${exp.location || "Location"}</p>
          <p style="${dateStyle}">${exp.startDate || "Start Date"} - ${exp.endDate || "End Date"}</p>
          <p style="${descStyle}">${exp.description || "Job description..."}</p>
        </div>
      `
        })

        html += "</div>"
        return html
    }

    private generateEducationHTML(education: any[], templateOptions: EnhancedTemplateOptions): string {
        const sectionStyle = `margin-bottom: ${templateOptions.spacing.sectionSpacing};`

        const headerStyle = `
      font-size: ${templateOptions.sections.sectionHeaders.fontSize};
      color: ${templateOptions.sections.sectionHeaders.color};
      font-weight: ${templateOptions.sections.sectionHeaders.fontWeight};
      text-transform: ${templateOptions.sections.sectionHeaders.textTransform};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      ${templateOptions.layout.sectionDividers ? `border-bottom: ${templateOptions.sections.sectionHeaders.borderBottom}; padding-bottom: 8px;` : ""}
      margin-top: 0;
    `

        let html = `
      <div style="${sectionStyle}">
        <h2 style="${headerStyle}">EDUCATION</h2>
    `

        education.forEach((edu) => {
            const itemStyle = `margin-bottom: ${templateOptions.spacing.itemSpacing};`
            const titleStyle = `
        font-weight: ${templateOptions.fontWeight.bold};
        color: ${templateOptions.colors.primary};
        margin-bottom: 4px;
        margin-top: 0;
      `
            const institutionStyle = `
        font-size: 14px;
        color: ${templateOptions.colors.secondary};
        margin-bottom: 2px;
      `
            const dateStyle = `
        font-size: 12px;
        color: ${templateOptions.colors.muted};
        margin-bottom: 0;
      `

            html += `
        <div style="${itemStyle}">
          <h3 style="${titleStyle}">${edu.degree || "Degree"}</h3>
          <p style="${institutionStyle}">${edu.institution || "Institution"} | ${edu.location || "Location"}</p>
          <p style="${dateStyle}">Graduated: ${edu.graduationDate || "Graduation Date"}</p>
          ${edu.gpa ? `<p style="${dateStyle}">GPA: ${edu.gpa}</p>` : ""}
        </div>
      `
        })

        html += "</div>"
        return html
    }

    private generateSkillsHTML(skills: any[], templateOptions: EnhancedTemplateOptions): string {
        const sectionStyle = `margin-bottom: ${templateOptions.spacing.sectionSpacing};`

        const headerStyle = `
      font-size: ${templateOptions.sections.sectionHeaders.fontSize};
      color: ${templateOptions.sections.sectionHeaders.color};
      font-weight: ${templateOptions.sections.sectionHeaders.fontWeight};
      text-transform: ${templateOptions.sections.sectionHeaders.textTransform};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      ${templateOptions.layout.sectionDividers ? `border-bottom: ${templateOptions.sections.sectionHeaders.borderBottom}; padding-bottom: 8px;` : ""}
      margin-top: 0;
    `

        const listStyle = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      list-style-type: ${templateOptions.sections.content.bulletStyle};
      padding-left: ${templateOptions.sections.content.bulletStyle !== "none" ? "20px" : "0"};
      margin: 0;
    `

        const itemStyle = `
      color: ${templateOptions.colors.text};
      margin-bottom: 2px;
    `

        let html = `
      <div style="${sectionStyle}">
        <h2 style="${headerStyle}">SKILLS</h2>
        <ul style="${listStyle}">
    `

        skills.forEach((skill) => {
            html += `
        <li style="${itemStyle}">
          ${skill.name || "Skill Name"} <span style="font-size: 12px; color: ${templateOptions.colors.muted};">(${skill.proficiency})</span>
        </li>
      `
        })

        html += "</ul></div>"
        return html
    }

    private generateProjectsHTML(projects: any[], templateOptions: EnhancedTemplateOptions): string {
        const sectionStyle = `margin-bottom: ${templateOptions.spacing.sectionSpacing};`

        const headerStyle = `
      font-size: ${templateOptions.sections.sectionHeaders.fontSize};
      color: ${templateOptions.sections.sectionHeaders.color};
      font-weight: ${templateOptions.sections.sectionHeaders.fontWeight};
      text-transform: ${templateOptions.sections.sectionHeaders.textTransform};
      margin-bottom: ${templateOptions.spacing.itemSpacing};
      ${templateOptions.layout.sectionDividers ? `border-bottom: ${templateOptions.sections.sectionHeaders.borderBottom}; padding-bottom: 8px;` : ""}
      margin-top: 0;
    `

        let html = `
      <div style="${sectionStyle}">
        <h2 style="${headerStyle}">PROJECTS</h2>
    `

        projects.forEach((project) => {
            const itemStyle = `margin-bottom: ${templateOptions.spacing.itemSpacing};`
            const titleStyle = `
        font-weight: ${templateOptions.fontWeight.bold};
        color: ${templateOptions.colors.primary};
        margin-bottom: 4px;
        margin-top: 0;
      `
            const techStyle = `
        font-size: 14px;
        color: ${templateOptions.colors.secondary};
        margin-bottom: 8px;
      `
            const descStyle = `
        color: ${templateOptions.colors.text};
        white-space: pre-wrap;
        line-height: ${templateOptions.lineHeight};
        margin-bottom: 0;
      `

            html += `
        <div style="${itemStyle}">
          <h3 style="${titleStyle}">${project.name || "Project Name"}</h3>
          <p style="${techStyle}">${project.technologies || "Technologies"}</p>
          <p style="${descStyle}">${project.description || "Project description..."}</p>
        </div>
      `
        })

        html += "</div>"
        return html
    }

    private applyPDFStyles(
        container: HTMLElement,
        templateOptions: EnhancedTemplateOptions,
        pdfOptions: PDFGenerationOptions,
    ): void {
        // Apply custom CSS if provided
        if (templateOptions.customCSS) {
            const style = document.createElement("style")
            style.textContent = templateOptions.customCSS
            container.appendChild(style)
        }

        // Apply PDF-specific optimizations
        const pdfStyles = `
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      a {
        color: ${templateOptions.sections.content.linkColor} !important;
        text-decoration: ${templateOptions.sections.content.linkDecoration} !important;
      }
      
      @media print {
        body { margin: 0; }
        .page-break { page-break-before: always; }
      }
    `

        const styleElement = document.createElement("style")
        styleElement.textContent = pdfStyles
        container.appendChild(styleElement)
    }

    private async waitForAssets(): Promise<void> {
        // Wait for fonts to load
        if (document.fonts) {
            await document.fonts.ready
        }

        // Wait for images to load
        const images = document.querySelectorAll("img")
        const imagePromises = Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve()

            return new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
                setTimeout(reject, 5000) // 5 second timeout
            })
        })

        await Promise.allSettled(imagePromises)

        // Additional wait for rendering
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    public async generateFromHTML(container: HTMLElement, pdfOptions: PDFGenerationOptions): Promise<Blob> {
        const html2canvas = (await import("html2canvas")).default
        const jsPDF = (await import("jspdf")).default

        // Configure canvas options based on quality setting
        const canvasOptions = {
            scale: pdfOptions.quality === "high" ? 3 : pdfOptions.quality === "print" ? 4 : 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: container.style.backgroundColor || "#ffffff",
            logging: false,
            windowWidth: 794,
            windowHeight: container.scrollHeight,
            onclone: (clonedDoc: Document) => {
                // Ensure all styles are preserved in the clone
                const clonedContainer = clonedDoc.getElementById("pdf-generation-container")
                if (clonedContainer) {
                    clonedContainer.style.position = "static"
                    clonedContainer.style.left = "auto"
                    clonedContainer.style.top = "auto"
                }
            },
        }

        // Generate canvas
        const canvas = await html2canvas(container, canvasOptions)

        // Create PDF
        const pdf = new jsPDF({
            orientation: pdfOptions.orientation,
            unit: "mm",
            format: pdfOptions.format.toLowerCase() as any,
            compress: pdfOptions.compression,
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()

        const imgWidth = canvas.width
        const imgHeight = canvas.height

        // Calculate scaling to fit page
        const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583))

        const scaledWidth = imgWidth * 0.264583 * ratio
        const scaledHeight = imgHeight * 0.264583 * ratio

        const x = (pdfWidth - scaledWidth) / 2
        const y = (pdfHeight - scaledHeight) / 2

        // Add image to PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, scaledWidth, scaledHeight)

        return pdf.output('blob')
    }
}

// Export utility function for easy use
export const generateEnhancedPDF = async (
    resumeData: ResumeData,
    templateOptions: EnhancedTemplateOptions,
    filename: string,
    pdfOptions?: Partial<PDFGenerationOptions>,
): Promise<void> => {
    const generator = EnhancedPDFGenerator.getInstance()
    const blob = await generator.generatePDF(resumeData, templateOptions, {
        format: "A4",
        orientation: "portrait",
        quality: "high",
        includeLinks: true,
        embedFonts: true,
        compression: true,
        ...pdfOptions,
    })

    // Download the PDF
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export const generateClientPDF = async (element: HTMLElement, fileName: string): Promise<void> => {
    try {
        const pdfGenerator = EnhancedPDFGenerator.getInstance();
        const pdfBlob = await pdfGenerator.generateFromHTML(element, {
            format: "A4",
            orientation: "portrait",
            quality: "high",
            includeLinks: true,
            embedFonts: true,
            compression: true,
        });

        // Create a download link and trigger it
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
