"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { resumeAPI } from '@/lib/api';
import { ResumeData, TemplateOptions, SavedResume } from '@/types/resume';
import { 
  Save, 
  FileText, 
  Download, 
  Trash2, 
  Edit, 
  Plus, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ResumeManagerProps {
  currentResumeData: ResumeData;
  currentTemplateOptions: TemplateOptions;
  onLoadResume: (resume: SavedResume) => void;
  selectedTemplate?: string;
}

export default function ResumeManager({ 
  currentResumeData, 
  currentTemplateOptions, 
  onLoadResume,
  selectedTemplate 
}: ResumeManagerProps) {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeAPI.getAll();
      // Convert to SavedResume format
      const savedResumes: SavedResume[] = await Promise.all(
        data.map(async (item) => {
          const fullResume = await resumeAPI.getById(item.id);
          return {
            id: fullResume.id,
            title: fullResume.title,
            template_name: fullResume.template_details?.name,
            personal_info: {
              name: fullResume.personal_info?.name || '',
              email: fullResume.personal_info?.email || '',
              phone: fullResume.personal_info?.phone || '',
              linkedin: fullResume.personal_info?.linkedin || '',
              github: fullResume.personal_info?.github || '',
              portfolio: fullResume.personal_info?.portfolio || '',
              photoUrl: fullResume.personal_info?.photoUrl || '',
            },
            professional_summary: fullResume.professional_summary || '',
            experience: fullResume.experience || [],
            education: fullResume.education || [],
            skills: fullResume.skills || [],
            projects: fullResume.projects || [],
            additional_sections: fullResume.additional_sections || {},
            template_options: {
              fontFamily: fullResume.template_options?.fontFamily || currentTemplateOptions.fontFamily,
              fontSize: fullResume.template_options?.fontSize || currentTemplateOptions.fontSize,
              textAlign: fullResume.template_options?.textAlign || currentTemplateOptions.textAlign,
              colors: fullResume.template_options?.colors || currentTemplateOptions.colors,
              spacing: fullResume.template_options?.spacing || currentTemplateOptions.spacing,
            },
            is_public: fullResume.is_public || false,
            pdf_file: fullResume.pdf_file,
            created_at: fullResume.created_at,
            updated_at: fullResume.updated_at,
          };
        })
      );
      setResumes(savedResumes);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!newResumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }

    try {
      setSaving(true);
      const resumeData = {
        title: newResumeTitle,
        template: selectedTemplate,
        personal_info: currentResumeData.personalInfo,
        professional_summary: currentResumeData.summary,
        experience: currentResumeData.experience,
        education: currentResumeData.education,
        skills: currentResumeData.skills,
        projects: currentResumeData.projects,
        template_options: currentTemplateOptions,
        additional_sections: {},
        is_public: false,
      };

      await resumeAPI.create(resumeData);
      toast.success('Resume saved successfully!');
      setNewResumeTitle('');
      setIsDialogOpen(false);
      loadResumes();
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const deleteResume = async (resumeId: string) => {
    try {
      setDeleting(resumeId);
      await resumeAPI.delete(resumeId);
      toast.success('Resume deleted successfully');
      loadResumes();
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const generatePDF = async (resume: SavedResume) => {
    try {
      setGeneratingPDF(resume.id);
      
      const resumeElement = document.getElementById('resume-preview');
      if(!resumeElement) {
        toast.error('Resume preview element not found');
        return;
      }

      // Use the shared PDF generation utility
      const { generateClientPDF } = await import('@/lib/pdf-utils');
      await generateClientPDF(resumeElement, `${resume.title}.pdf`);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPDF(null);
    }
  };



  const loadResumeData = (resume: SavedResume) => {
    onLoadResume(resume);
    toast.success(`Loaded "${resume.title}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary">My Resumes</h3>
          <p className="text-muted-foreground">Manage your saved resumes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Save Current Resume
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Resume</DialogTitle>
              <DialogDescription>
                Give your resume a name to save it for later use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter resume title (e.g., Software Engineer Resume)"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveResume()}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveResume} disabled={saving}>
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
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading resumes...</span>
        </div>
      ) : resumes.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold mb-2">No Saved Resumes</h4>
          <p className="text-muted-foreground mb-4">
            Save your current resume to access it later and create multiple versions.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Save Your First Resume
          </Button>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {resume.title}
                          </CardTitle>
                          {resume.template_name && (
                            <Badge variant="outline" className="mt-1">
                              {resume.template_name}
                            </Badge>
                          )}
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Updated {formatDistanceToNow(new Date(resume.updated_at), { addSuffix: true })}
                        </div>
                        {resume.personal_info?.name && (
                          <div>Name: {resume.personal_info.name}</div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadResumeData(resume)}
                          className="w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Load & Edit
                        </Button>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePDF(resume)}
                            disabled={generatingPDF === resume.id}
                            className="flex-1"
                          >
                            {generatingPDF === resume.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteResume(resume.id)}
                            disabled={deleting === resume.id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deleting === resume.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}
    </div>
  );
} 