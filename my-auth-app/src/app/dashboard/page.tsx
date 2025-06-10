"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle, Loader2 } from "lucide-react";
import ResumeStats from "@/components/dashboard/ResumeStats";
import TemplateCard, { type Template } from "@/components/dashboard/TemplateCard";
import RecentResumes from "@/components/dashboard/RecentResumes";
import DashboardHeader from "@/components/dashboard/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useState, useEffect } from "react";
import { templatesAPI, ResumeTemplate } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const fetchedTemplates = await templatesAPI.getAll();
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary/50 flex flex-col animate-fade-in">
        <DashboardHeader />
        <main className="flex-1 container p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">
                Welcome back, {user?.first_name || user?.username || "User"}!
              </h1>
              <p className="text-muted-foreground">Here's what's happening with your resumes.</p>
            </div>
            <Link href="/builder" passHref>
              <Button size="lg" className="group shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> 
                Create New Resume
              </Button>
            </Link>
          </div>

          <ResumeStats />

          <section className="animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-headline font-semibold text-primary flex items-center">
                <LayoutDashboard className="mr-2 h-6 w-6 text-accent" />
                Resume Templates
              </h2>
              <Link href="/templates" passHref>
                <Button variant="link" className="text-accent hover:text-primary">
                  View All Templates
                </Button>
              </Link>
            </div>
            
            {loadingTemplates ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-2 text-muted-foreground">Loading templates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.slice(0, 4).map((template, index) => (
                  <TemplateCard 
                    key={template.id} 
                    template={{
                      id: template.id,
                      name: template.name,
                      category: template.template_type,
                      previewImage: template.preview_image || "/placeholder-template.png",
                      rating: template.ats_score / 10, // Convert ATS score to 5-star rating
                      popularity: Math.floor(Math.random() * 1000) + 500, // Mock popularity for now
                      isPremium: template.is_premium,
                      aiHint: `resume ${template.template_type}`,
                    }} 
                    style={{animationDelay: `${index * 100 + 200}ms`}} 
                  />
                ))}
              </div>
            )}
          </section>

          <section className="animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <RecentResumes />
          </section>

        </main>
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} ResumeFlow. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
