export const generateClientPDF = async (resume: HTMLElement, filename: string) => {
    try {
        // Dynamic import to avoid SSR issues
        const html2canvas = (await import('html2canvas')).default;
        const jsPDF = (await import('jspdf')).default;

        // Wait for any fonts to load
        await new Promise(resolve => setTimeout(resolve, 500));

        // Convert any oklch colors to hex before rendering
        const elements = resume.querySelectorAll('*');
        
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.getPropertyValue('color');
            const backgroundColor = style.getPropertyValue('background-color');
            if (color.includes('oklch')) {
                (el as HTMLElement).style.color = '#000000'; // Fallback to black
            }
            if (backgroundColor.includes('oklch')) {
                (el as HTMLElement).style.backgroundColor = '#ffffff'; // Fallback to white
            }
        });

        // Generate canvas
        const canvas = await html2canvas(resume, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794,
            windowHeight: resume.scrollHeight
        });

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
        
        const scaledWidth = imgWidth * 0.264583 * ratio;
        const scaledHeight = imgHeight * 0.264583 * ratio;
        
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;

        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        pdf.save(filename);

    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
};