"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit3, Trash2, Copy, Share2, Clock, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { resumeAPI, ResumeListItem } from "@/lib/api";
import { toast } from "sonner";

interface ResumeItem extends ResumeListItem {
  status: "Draft" | "Completed" | "Shared";
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} days ago`;
}

export default function RecentResumes() {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleCopy = async (resume: ResumeItem) => {
    try {
      // In a real app, you'd implement resume duplication
      toast.success(`"${resume.title}" copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy resume');
    }
  };

  const handleShare = async (resume: ResumeItem) => {
    try {
      // In a real app, you'd generate a shareable link
      const shareUrl = `${window.location.origin}/resume/${resume.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to create share link');
    }
  };

  const handleDownloadPDF = async (resume: ResumeItem) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf-generation' });
      
      // Get full resume data first
      const fullResume = await resumeAPI.getById(resume.id);
      
      const resumeElement = document.getElementById('resume-preview');
      if(!resumeElement) {
        toast.error('Resume preview element not found');
        return;
      }

      // Use the shared PDF generation utility
      const { generateClientPDF } = await import('@/lib/pdf-utils');
      await generateClientPDF(resumeElement, `${resume.title}.pdf`);
      
      toast.success('PDF downloaded successfully', { id: 'pdf-generation' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', { id: 'pdf-generation' });
    }
  };



  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
          <Clock className="mr-2 h-6 w-6 text-primary" />
          Recent Resumes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No resumes yet. Start creating your first resume!</p>
            <Link href="/builder">
              <Button>Create Resume</Button>
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {resumes.map((resume) => (
                <li key={resume.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/60 transition-colors">
                  <div className="flex items-center flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-primary mr-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/builder?resumeId=${resume.id}`}
                        className="font-semibold text-primary hover:underline block truncate"
                      >
                        {resume.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Last modified: {timeAgo(resume.updated_at)}
                        {resume.template_name && (
                          <span className="ml-2">• {resume.template_name}</span>
                        )}
                      </p>
                      <Badge
                        variant={
                          resume.status === "Completed" ? "default" :
                            resume.status === "Shared" ? "outline" : "secondary"
                        }
                        className="ml-2 scale-75 origin-left"
                      >
                        {resume.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button variant="ghost" size="icon" asChild title="Edit">
                      <Link href={`/builder?resumeId=${resume.id}`}>
                        <Edit3 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download PDF"
                      onClick={() => handleDownloadPDF(resume)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Copy"
                      onClick={() => handleCopy(resume)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Share"
                      onClick={() => handleShare(resume)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
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
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
