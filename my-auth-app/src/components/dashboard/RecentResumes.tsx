"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit3, Trash2, Copy, Share2, Clock } from "lucide-react";
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

interface ResumeItem {
  id: string;
  title: string;
  lastModified: string; // Should be a date string
  version: string;
  status: "Draft" | "Completed" | "Shared";
}

const mockResumes: ResumeItem[] = [
  { id: "1", title: "Software Engineer Resume", lastModified: "2024-07-20T10:30:00Z", version: "v2.1", status: "Completed" },
  { id: "2", title: "Product Manager Application", lastModified: "2024-07-18T15:00:00Z", version: "v1.0", status: "Draft" },
  { id: "3", title: "UX Designer Portfolio CV", lastModified: "2024-07-15T09:00:00Z", version: "v3.0 (Shared)", status: "Shared" },
  { id: "4", title: "My First Resume Attempt", lastModified: "2024-06-30T12:00:00Z", version: "v0.5", status: "Draft" },
];

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

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => setResumes(mockResumes), 700);
    }, []);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-primary flex items-center">
            <Clock className="mr-2 h-6 w-6 text-accent" />
            Recent Resumes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {resumes.length === 0 ? (
            <p className="text-muted-foreground">No recent resumes. <Link href="/dashboard/create-resume"><Button variant="link" className="p-0 h-auto">Create one now!</Button></Link></p>
        ) : (
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-4">
            {resumes.map((resume) => (
              <li key={resume.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/60 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-primary mr-4 shrink-0" />
                  <div>
                    <Link href={`/editor/${resume.id}`} className="font-semibold text-primary hover:underline">{resume.title}</Link>
                    <p className="text-xs text-muted-foreground">
                      Last modified: {timeAgo(resume.lastModified)} ({resume.version})
                      <Badge variant={resume.status === "Completed" ? "default" : resume.status === "Shared" ? "outline" : "secondary"} className="ml-2 scale-75 origin-left">
                        {resume.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/editor/${resume.id}`}><Edit3 className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" title="Copy"><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Share"><Share2 className="h-4 w-4" /></Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                        <Trash2 className="h-4 w-4" />
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
                          onClick={() => console.log(`Deleting resume ${resume.id}`)}
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
