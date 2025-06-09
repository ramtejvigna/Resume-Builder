"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import ResumeStats from "@/components/dashboard/ResumeStats";
import TemplateCard, { type Template } from "@/components/dashboard/TemplateCard";
import RecentResumes from "@/components/dashboard/RecentResumes";
import DashboardHeader from "@/components/dashboard/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

const mockTemplates: Template[] = [
  { id: "1", name: "Modern Edge", category: "Modern", previewImage: "", rating: 4.8, popularity: 1200, aiHint: "resume modern" },
  { id: "2", name: "Classic Professional", category: "Classic", previewImage: "", rating: 4.5, popularity: 950, aiHint: "resume classic" },
  { id: "3", name: "Creative Spark", category: "Creative", previewImage: "", rating: 4.7, popularity: 800, isPremium: true, aiHint: "resume creative" },
  { id: "4", name: "ATS Optimized", category: "ATS-Friendly", previewImage: "", rating: 4.9, popularity: 1500, aiHint: "resume ATS" },
  { id: "5", name: "Minimalist Clean", category: "Modern", previewImage: "", rating: 4.6, popularity: 700, aiHint: "resume minimal" },
  { id: "6", name: "Corporate Standard", category: "Classic", previewImage: "", rating: 4.3, popularity: 600, aiHint: "resume corporate" },
  { id: "7", name: "Visual Impact", category: "Creative", previewImage: "", rating: 4.8, popularity: 900, isPremium: true, aiHint: "resume visual" },
  { id: "8", name: "Simple ATS", category: "ATS-Friendly", previewImage: "", rating: 4.7, popularity: 1100, aiHint: "resume simple" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary/50 flex flex-col animate-fade-in">
        <DashboardHeader />
        <main className="flex-1 container p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-primary">Welcome back, {user?.first_name || user?.last_name || "User"}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your resumes.</p>
            </div>
            <Link href="/builder" passHref>
              <Button size="lg" className="group shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> Create New Resume
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
                  <Link href="/dashboard/templates" passHref>
                    <Button variant="link" className="text-accent hover:text-primary">View All Templates</Button>
                  </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockTemplates.slice(0,4).map((template, index) => ( // Show first 4 templates
                  <TemplateCard 
                      key={template.id} 
                      template={template} 
                      style={{animationDelay: `${index * 100 + 200}ms`}} 
                  />
              ))}
              </div>
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
