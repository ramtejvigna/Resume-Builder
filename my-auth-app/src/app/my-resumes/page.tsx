"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ResumeManager from '@/components/resume/resume-manager';
import DashboardHeader from "@/components/dashboard/Header";
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { SavedResume, ResumeData } from '@/types/resume';
import { Toaster, toast } from 'sonner';
import { FolderOpen } from 'lucide-react';

export default function MyResumesPage() {
  const router = useRouter();

  const handleLoadResume = (resume: SavedResume) => {
    // Store the loaded resume data in localStorage
    const resumeData: ResumeData = {
      personalInfo: resume.personal_info,
      summary: resume.professional_summary,
      experience: resume.experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
    };
    
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    localStorage.setItem('templateOptions', JSON.stringify(resume.template_options));
    localStorage.setItem('currentResumeId', resume.id);
    
    if (resume.template) {
      localStorage.setItem('selectedTemplate', JSON.stringify(resume.template));
    }
    
    // Redirect to builder
    router.push('/builder');
    toast.success(`Loaded "${resume.title}" for editing`);
  };

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
            My Resumes
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage, edit, and download your saved resumes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <ResumeManager
                onLoadResume={handleLoadResume}
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
} 