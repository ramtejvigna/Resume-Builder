"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Copy, 
  Download, 
  Search,
  Loader2,
  FolderOpen,
  Clock 
} from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { resumeAPI, ResumeListItem } from '@/lib/api';
import { SavedResume, ResumeData, TemplateOptions } from '@/types/resume';
import { toast } from 'sonner';

interface ResumeManagerProps {
  onLoadResume: (resume: SavedResume) => void;
}

interface ResumeItem extends ResumeListItem {
  status: "Draft" | "Completed" | "Shared";
}

export default function ResumeManager({ onLoadResume }: ResumeManagerProps) {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const fetchedResumes = await resumeAPI.getAll();

      // Convert to ResumeItem with status
      const processedResumes: ResumeItem[] = fetchedResumes.map(resume => ({
        ...resume,
        status: getResumeStatus(resume)
      }));

      // Sort by updated_at (most recent first)
      processedResumes.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setResumes(processedResumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const getResumeStatus = (resume: ResumeListItem): "Draft" | "Completed" | "Shared" => {
    // Simple logic to determine status - you can enhance this based on your needs
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(resume.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate > 7) return "Draft";
    return Math.random() > 0.5 ? "Completed" : "Shared"; // Mock for now
  };

  const handleDelete = async (resumeId: string) => {
    try {
      setDeletingId(resumeId);
      await resumeAPI.delete(resumeId);
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadResume = async (resumeItem: ResumeItem) => {
    try {
      // Fetch full resume data
      const fullResume = await resumeAPI.getById(resumeItem.id);
      
      // Convert to SavedResume format
      const savedResume: SavedResume = {
        id: fullResume.id,
        title: fullResume.title,
        template: fullResume.template_details as any, // Type conversion needed
        template_name: fullResume.template_details?.name,
        personal_info: fullResume.personal_info as any, // Type conversion needed
        professional_summary: fullResume.professional_summary || '',
        experience: fullResume.experience,
        education: fullResume.education,
        skills: fullResume.skills,
        projects: fullResume.projects,
        additional_sections: fullResume.additional_sections,
        template_options: fullResume.template_options as any, // Type conversion needed
        is_public: fullResume.is_public,
        pdf_file: fullResume.pdf_file,
        created_at: fullResume.created_at,
        updated_at: fullResume.updated_at,
      };
      
      onLoadResume(savedResume);
    } catch (error) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume');
    }
  };

  const handleCopy = async (resume: ResumeItem) => {
    try {
      // Create a copy with a new title
      const fullResume = await resumeAPI.getById(resume.id);
      const copyData = {
        ...fullResume,
        title: `${fullResume.title} (Copy)`,
        id: undefined, // Remove ID to create new
        created_at: undefined,
        updated_at: undefined,
      };
      
      await resumeAPI.create(copyData);
      toast.success('Resume copied successfully');
      loadResumes(); // Refresh the list
    } catch (error) {
      console.error('Error copying resume:', error);
      toast.error('Failed to copy resume');
    }
  };

  const handleDownloadPDF = async (resume: ResumeItem) => {
    try {
      // Fetch full resume data to get PDF file
      const fullResume = await resumeAPI.getById(resume.id);
      
      if (fullResume.pdf_file) {
        // If PDF exists, download it
        const link = document.createElement('a');
        link.href = fullResume.pdf_file;
        link.download = `${resume.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.info('PDF not available for this resume');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resume.template_name && resume.template_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FolderOpen className="mr-2 h-5 w-5" />
            My Saved Resumes
          </span>
          <Badge variant="secondary">
            {resumes.length} Resume{resumes.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes by title or template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Resumes List */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading resumes...</span>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No resumes match your search.' : 'No saved resumes found.'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-muted-foreground">
                  Create your first resume to see it here!
                </p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredResumes.map((resume) => (
                  <Card key={resume.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="h-8 w-8 text-primary mr-3 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-primary truncate">
                              {resume.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Last modified: {timeAgo(resume.updated_at)}</span>
                              {resume.template_name && (
                                <>
                                  <span>•</span>
                                  <span>{resume.template_name}</span>
                                </>
                              )}
                            </div>
                            <Badge
                              variant={
                                resume.status === "Completed" ? "default" :
                                resume.status === "Shared" ? "outline" : "secondary"
                              }
                              className="mt-1 text-xs"
                            >
                              {resume.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleLoadResume(resume)}
                            title="Load and Edit"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Load
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(resume)}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(resume)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Delete"
                                disabled={deletingId === resume.id}
                              >
                                {deletingId === resume.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your resume "{resume.title}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(resume.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
