
"use client";

import { useState, useEffect } from 'react';
import ResumeForm from '@/components/resume/resume-form';
import ResumePreview from '@/components/resume/resume-preview';
import TemplateCustomizer from '@/components/resume/template-customizer';
import type { ResumeData, TemplateOptions, PersonalInfo, ExperienceEntry, EducationEntry, SkillEntry, ProjectEntry } from '@/types/resume';
import { initialResumeData, initialTemplateOptions } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import DirectEditModal from '@/components/resume/direct-edit-modal';
import DashboardHeader from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [isClient, setIsClient] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null);
  const [editingCurrentText, setEditingCurrentText] = useState('');
  const [editingLabel, setEditingLabel] = useState('');
  const [isEditingTextarea, setIsEditingTextarea] = useState(true);


  useEffect(() => {
    setIsClient(true);
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
      }
      return newData;
    });
    setIsEditModalOpen(false);
    setEditingTarget(null);
  };


  const handleExportPdf = () => {
    console.log("Exporting PDF with data:", resumeData, "and options:", templateOptions);
    window.print();
  };
  
  const handleExportGDocs = () => {
    console.log("Exporting to Google Docs with data:", resumeData, "and options:", templateOptions);
  };


  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <h1 className="text-2xl font-headline text-primary mb-2">Resume Builder</h1>
        <p className="text-lg text-muted-foreground">Loading your creative workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50 animate-fade-in">
      <DashboardHeader />
      <main className="container mx-auto flex-grow  p-8">
        <div className="mb-8 text-center lg:text-left">
            <p className="text-2xl text-center text-muted-foreground">Craft your professional story with ease and style.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <Card className="shadow-lg animate-slide-in-up">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Edit Your Content</CardTitle>
                <CardDescription>Fill in your details section by section. Click on text in the preview to edit directly.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="sticky top-24 space-y-6"> {/* Adjust top if header height changes (h-16 -> 64px; 64px + 32px = 96px -> top-24) */}
              <Card className="shadow-lg animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Live Preview</CardTitle>
                  <CardDescription>See your resume update in real-time. Click any text to edit.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumePreview 
                    resumeData={resumeData} 
                    templateOptions={templateOptions}
                    onEdit={openEditModal} 
                  />
                </CardContent>
              </Card>
              
              <Card className="shadow-lg animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary">Customize Appearance</CardTitle>
                  <CardDescription>Adjust fonts, colors, and layout to match your style.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateCustomizer templateOptions={templateOptions} setTemplateOptions={setTemplateOptions} />
                </CardContent>
              </Card>

              <Card className="shadow-lg animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Export Options</CardTitle>
                    <CardDescription>Download or share your masterpiece.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors duration-150 shadow-md hover:shadow-lg"
                    onClick={handleExportPdf}
                    aria-label="Export Resume as PDF"
                    >
                    <Download className="mr-2 h-5 w-5" /> Export PDF / Print
                    </Button>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                        variant="outline"
                        className="w-full transition-colors duration-150 shadow hover:shadow-md"
                        aria-label="Export Resume to Google Docs"
                        >
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.524 8.248c.492-2.444 2.634-4.248 5.476-4.248 2.662 0 4.943 1.617 5.594 3.952.245-.07.497-.11.756-.11 1.807 0 3.15.91 3.15 2.365 0 .66-.418 1.327-1.178 1.736C18.7 13.07 17.4 14 15.6 14H8.9c-2.89 0-4.434-1.747-4.434-3.883 0-1.51.78-2.845 2.058-3.87ZM17.5 15l-2 2H8.5l-2-2h11Z M5 19.5c0-.276.224-.5.5-.5h13c.276 0 .5.224.5.5s-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5Z M8 6C6.343 6 5 7.343 5 9s1.343 3 3 3h8c1.657 0 3-1.343 3-3s-1.343-3-3-3H8Z"></path></svg>
                        Export to Google Docs
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Google Docs Export</AlertDialogTitle>
                        <AlertDialogDescription>
                            This feature is currently under development. For now, your resume data will be logged to the console.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExportGDocs}>Proceed & Log Data</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
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
