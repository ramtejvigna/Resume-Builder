"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Eye, Download, Users, BarChartBig } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  progress?: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, progress, description }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-accent" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      {progress !== undefined && <Progress value={progress} className="mt-2 h-2" />}
    </CardContent>
  </Card>
);

export default function ResumeStats() {
  // Mock data - in a real app, this would come from an API
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    profileCompletion: 0,
  });

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalResumes: 5,
        totalViews: 128,
        totalDownloads: 32,
        profileCompletion: 75,
      });
    }, 500);
  }, []);
  
  return (
    <div className="mb-8">
        <h2 className="text-2xl font-headline font-semibold mb-4 text-primary flex items-center">
            <BarChartBig className="mr-2 h-6 w-6 text-accent" />
            Your Resume Statistics
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total Resumes" 
                value={stats.totalResumes} 
                icon={FileText} 
                description="+2 this month"
                progress={stats.totalResumes * 10} // Example progress logic
            />
            <StatCard 
                title="Resume Views" 
                value={stats.totalViews} 
                icon={Eye} 
                description="Across all shared links"
            />
            <StatCard 
                title="Downloads" 
                value={stats.totalDownloads} 
                icon={Download} 
                description="PDFs generated and downloaded"
            />
            <StatCard 
                title="Profile Completion" 
                value={`${stats.profileCompletion}%`} 
                icon={Users} 
                description="Complete your profile for better suggestions!"
                progress={stats.profileCompletion} 
            />
        </div>
    </div>
  );
}
