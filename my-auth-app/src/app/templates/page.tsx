"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TemplateSelector from '@/components/resume/template-selector';
import DashboardHeader from "@/components/dashboard/Header";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ResumeTemplate } from '@/types/resume';
import { Toaster, toast } from 'sonner';
import { Palette, ArrowRight } from 'lucide-react';

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const router = useRouter();

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
  };

  const handleStartBuilding = () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }
    
    // Store selected template in localStorage
    localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
    
    // Redirect to builder
    router.push('/builder');
    toast.success(`Starting with "${selectedTemplate.name}" template`);
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
            Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose from our collection of ATS-optimized professional templates
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
              />
              
              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 text-center"
                >
                  <Button
                    onClick={handleStartBuilding}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-4"
                  >
                    <Palette className="h-5 w-5 mr-2" />
                    Start Building with {selectedTemplate.name}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
} 