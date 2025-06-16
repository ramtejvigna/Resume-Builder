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
import { resumeAPI } from '@/lib/api';
import { toast, Toaster } from 'sonner';

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

  const handleClientPDF = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first to generate PDF');
      return;
    }

    try {
      setGeneratingPDF(true);
      
      // Create resume data object for PDF generation
      const resumeForPDF = {
        personal_info: resumeData.personalInfo,
        professional_summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        projects: resumeData.projects,
        template_options: templateOptions,
      };

      const resumeElement = document.getElementById('resume-preview');
      if(!resumeElement) {
        toast.error('Resume preview element not found');
        return;
      }

      const fileName = resumeData.personalInfo.name 
        ? `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';

      // Use the shared PDF generation utility
      const { generateClientPDF } = await import('@/lib/pdf-utils');
      await generateClientPDF(resumeElement, fileName);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadClick = () => {
    handleClientPDF();
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
                        onClick={handleDownloadClick}
                        disabled={generatingPDF || !selectedTemplate}
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        {generatingPDF ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Download PDF
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

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="edit">
                      <FileText className="h-4 w-4 mr-2" />
                      Edit
                    </TabsTrigger>
                    <TabsTrigger value="customize">
                      <Palette className="h-4 w-4 mr-2" />
                      Customize
                    </TabsTrigger>
                    <TabsTrigger value="manage">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit" className="mt-4">
                    <ResumeForm
                      resumeData={resumeData}
                      setResumeData={setResumeData}
                    />
                  </TabsContent>
                  <TabsContent value="customize" className="mt-4">
                    <TemplateCustomizer
                      templateOptions={templateOptions}
                      setTemplateOptions={setTemplateOptions}
                    />
                  </TabsContent>
                  <TabsContent value="manage" className="mt-4">
                    <ResumeManager
                      currentResumeData={resumeData}
                      currentTemplateOptions={templateOptions}
                      onLoadResume={handleLoadResume}
                      selectedTemplate={selectedTemplate?.id}
                    />
                  </TabsContent>
                </Tabs>
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="sticky top-4">
                  <CardContent className="p-0">
                    <div className="overflow-auto max-h-[calc(100vh-200px)]">
                      <ResumePreview
                        resumeData={resumeData}
                        templateOptions={templateOptions}
                        onEdit={openEditModal}
                        selectedTemplate={selectedTemplate}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}

        {/* Save Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Resume</DialogTitle>
              <DialogDescription>
                Enter a title for your resume to save it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                />
              </div>
              <Button
                onClick={saveResume}
                disabled={saving || !resumeTitle.trim()}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Resume
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <DirectEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveModalEdit}
          currentText={editingCurrentText}
          label={editingLabel}
          isTextarea={isEditingTextarea}
        />
      </main>
    </div>
  );
}
