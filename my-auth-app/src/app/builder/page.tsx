"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeForm from '@/components/resume/resume-form';
import ResumePreview from '@/components/resume/resume-preview';
import TemplateCustomizer from '@/components/resume/template-customizer';
import TemplateSelector from '@/components/resume/template-selector';
import ResumeManager from '@/components/resume/resume-manager';
import type { 
  ResumeData, 
  TemplateOptions, 
  PersonalInfo, 
  ExperienceEntry, 
  EducationEntry, 
  SkillEntry, 
  ProjectEntry,
  ResumeTemplate,
  SavedResume
} from '@/types/resume';
import { initialResumeData, initialTemplateOptions } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Download, 
  Loader2, 
  Palette, 
  FileText, 
  Save,
  Sparkles,
  Award,
  Eye,
  Settings
} from 'lucide-react';
import DirectEditModal from '@/components/resume/direct-edit-modal';
import DashboardHeader from "@/components/dashboard/Header";
import { resumeAPI, downloadPDF } from '@/lib/api';
import { toast, Toaster } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type EditingTarget =
  | { section: 'personalInfo'; field: keyof PersonalInfo }
  | { section: 'summary' }
  | { section: 'experience'; index: number; field: keyof ExperienceEntry }
  | { section: 'education'; index: number; field: keyof EducationEntry }
  | { section: 'skills'; index: number; field: keyof SkillEntry }
  | { section: 'projects'; index: number; field: keyof ProjectEntry };

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [templateOptions, setTemplateOptions] = useState<TemplateOptions>(initialTemplateOptions);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null);
  const [editingCurrentText, setEditingCurrentText] = useState('');
  const [editingLabel, setEditingLabel] = useState('');
  const [isEditingTextarea, setIsEditingTextarea] = useState(true);

  useEffect(() => {
    setIsClient(true);
    loadSavedData();
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('templateOptions', JSON.stringify(templateOptions));
    }
  }, [templateOptions, isClient]);

  const loadSavedData = () => {
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (e) {
        console.error("Error parsing saved resume data from localStorage", e);
      }
    }
    
    const savedTemplateOptions = localStorage.getItem('templateOptions');
    if (savedTemplateOptions) {
      try {
        setTemplateOptions(JSON.parse(savedTemplateOptions));
      } catch (e) {
        console.error("Error parsing saved template options from localStorage", e);
      }
    }

    // Load selected template from localStorage
    const savedSelectedTemplate = localStorage.getItem('selectedTemplate');
    if (savedSelectedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(savedSelectedTemplate));
      } catch (e) {
        console.error("Error parsing saved selected template from localStorage", e);
      }
    }

    // Load current resume ID
    const savedResumeId = localStorage.getItem('currentResumeId');
    if (savedResumeId) {
      setCurrentResumeId(savedResumeId);
    }
  };

  const openEditModal = (target: EditingTarget, currentText: string, label: string, isTextarea: boolean = true) => {
    setEditingTarget(target);
    setEditingCurrentText(currentText);
    setEditingLabel(label);
    setIsEditingTextarea(isTextarea);
    setIsEditModalOpen(true);
  };

  const handleSaveModalEdit = (newText: string) => {
    if (!editingTarget) return;

    setResumeData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); 

      switch (editingTarget.section) {
        case 'personalInfo':
          (newData.personalInfo[editingTarget.field] as any) = newText;
          break;
        case 'summary':
          newData.summary = newText;
          break;
        case 'experience':
          if (newData.experience[editingTarget.index]) {
            (newData.experience[editingTarget.index][editingTarget.field] as any) = newText;
          }
          break;
        case 'education':
          if (newData.education[editingTarget.index]) {
            (newData.education[editingTarget.index][editingTarget.field] as any) = newText;
          }
          break;
        case 'skills':
          if (newData.skills[editingTarget.index]) {
            (newData.skills[editingTarget.index][editingTarget.field] as any) = newText;
          }
          break;
        case 'projects':
          if (newData.projects[editingTarget.index]) {
            (newData.projects[editingTarget.index][editingTarget.field] as any) = newText;
          }
          break;
      }
      return newData;
    });
    setIsEditModalOpen(false);
    setEditingTarget(null);
  };

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    // Apply template styles to templateOptions
    setTemplateOptions(prev => ({
      ...prev,
      fontFamily: template.css_styles.fontFamily,
      fontSize: template.css_styles.fontSize,
      colors: template.css_styles.colors,
      spacing: template.css_styles.spacing,
    }));
    toast.success(`Applied "${template.name}" template`);
  };

  const handleLoadResume = (resume: SavedResume) => {
    setResumeData({
      personalInfo: resume.personal_info,
      summary: resume.professional_summary,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
    });
    setTemplateOptions(resume.template_options);
    setCurrentResumeId(resume.id);
    setActiveTab('edit');
  };

  const saveResume = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    try {
      setSaving(true);
      const resumePayload = {
        title: resumeTitle,
        template: selectedTemplate.id,
        personal_info: resumeData.personalInfo,
        professional_summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        template_options: templateOptions,
        additional_sections: {},
        is_public: false,
      };

      let savedResume;
      if (currentResumeId) {
        // Update existing resume
        savedResume = await resumeAPI.update(currentResumeId, resumePayload);
        toast.success('Resume updated successfully!');
      } else {
        // Create new resume
        savedResume = await resumeAPI.create(resumePayload);
        setCurrentResumeId(savedResume.id);
        localStorage.setItem('currentResumeId', savedResume.id);
        toast.success('Resume saved successfully!');
      }
      
      setShowSaveDialog(false);
      setResumeTitle('');
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveClick = () => {
    if (currentResumeId) {
      // If editing existing resume, save directly with current title
      setResumeTitle('Updated Resume');
      saveResume();
    } else {
      // If new resume, show dialog to enter title
      setShowSaveDialog(true);
    }
  };

  const generateClientSidePDF = async () => {
    try {
      setGeneratingPDF(true);
      const element = document.getElementById('resume-preview');
      if (!element) {
        throw new Error('Resume preview element not found');
      }

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create canvas from the resume preview
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Download the PDF
      const fileName = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleServerPDF = async () => {
    if (!currentResumeId) {
      toast.error('Please save your resume first to generate server PDF');
      return;
    }

    try {
      setGeneratingPDF(true);
      const pdfBlob = await resumeAPI.generatePDF(currentResumeId);
      const fileName = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      downloadPDF(pdfBlob, fileName);
      toast.success('Server PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate server PDF:', error);
      toast.error('Failed to generate server PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-6 mx-auto" />
          <h1 className="text-2xl font-headline text-primary mb-2">Resume Builder</h1>
          <p className="text-lg text-muted-foreground">Loading your creative workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
      <Toaster position="top-right" richColors />
      <DashboardHeader />
      
      <main className="container mx-auto flex-grow p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-primary mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Professional Resume Builder
          </h1>
          <p className="text-xl text-muted-foreground">
            Craft your professional story with ATS-optimized templates
          </p>
        </motion.div>

        {!selectedTemplate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="shadow-xl bg-background/80 backdrop-blur-sm p-8">
              <div className="max-w-md mx-auto">
                <Palette className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-primary mb-4">Choose a Template First</h2>
                <p className="text-muted-foreground mb-6">
                  You need to select a template before you can start building your resume.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={() => window.location.href = '/templates'}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Palette className="h-5 w-5 mr-2" />
                    Browse Templates
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/my-resumes'}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Load Existing Resume
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Template Info Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Palette className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-semibold text-primary">Selected Template: {selectedTemplate.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>ATS: {selectedTemplate.ats_score}%</span>
                      </Badge>
                      <Button
                        onClick={handleSaveClick}
                        disabled={saving}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {currentResumeId ? 'Update' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/templates'}
                        variant="outline"
                        size="sm"
                      >
                        Change Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/50 backdrop-blur-sm">
                <TabsTrigger value="edit" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Edit Resume</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview & Download</span>
                </TabsTrigger>
              </TabsList>

          <AnimatePresence mode="wait">

            <TabsContent value="edit" className="mt-0">
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                  <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl text-primary flex items-center">
                        <FileText className="h-6 w-6 mr-2" />
                        Edit Content
                      </CardTitle>
                      <CardDescription>
                        Fill in your details section by section. Click on text in the preview to edit directly.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="font-headline text-2xl text-primary flex items-center">
                            <Eye className="h-6 w-6 mr-2" />
                            Live Preview
                          </CardTitle>
                          <CardDescription>
                            See your resume update in real-time. Click any text to edit.
                          </CardDescription>
                        </div>
                        {selectedTemplate && (
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Award className="h-3 w-3" />
                            <span>ATS: {selectedTemplate.ats_score}%</span>
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div id="resume-preview">
                        <ResumePreview 
                          resumeData={resumeData} 
                          templateOptions={templateOptions}
                          onEdit={openEditModal}
                          selectedTemplate={selectedTemplate}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl text-primary flex items-center">
                        <Settings className="h-6 w-6 mr-2" />
                        Customize Style
                      </CardTitle>
                      <CardDescription>
                        Adjust fonts, colors, and layout to match your style.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TemplateCustomizer 
                        templateOptions={templateOptions} 
                        setTemplateOptions={setTemplateOptions} 
                      />
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-headline text-2xl text-primary flex items-center">
                          <Sparkles className="h-6 w-6 mr-2" />
                          Final Preview
                        </CardTitle>
                        <CardDescription>
                          Your resume as it will appear to employers
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={generateClientSidePDF}
                          disabled={generatingPDF}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {generatingPDF ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download PDF
                        </Button>
                        {currentResumeId && (
                          <Button
                            onClick={handleServerPDF}
                            disabled={generatingPDF}
                            variant="outline"
                          >
                            Server PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-8 rounded-lg shadow-inner">
                      <ResumePreview 
                        resumeData={resumeData} 
                        templateOptions={templateOptions}
                        onEdit={openEditModal}
                        isPreviewMode={true}
                        selectedTemplate={selectedTemplate}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            </AnimatePresence>
            </Tabs>
          </div>
        )}
      </main>

      {showSaveDialog && (
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Resume</DialogTitle>
              <DialogDescription>
                Give your resume a name to save it for future editing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="resume-title">Resume Title</Label>
                <Input
                  id="resume-title"
                  placeholder="Enter resume title (e.g., Software Engineer Resume)"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveResume()}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={saveResume} disabled={saving || !resumeTitle.trim()}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isEditModalOpen && editingTarget && (
        <DirectEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentText={editingCurrentText}
          onSave={handleSaveModalEdit}
          label={editingLabel}
          isTextarea={isEditingTextarea}
        />
      )}
    </div>
  );
}
