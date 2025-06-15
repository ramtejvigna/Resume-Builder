"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Eye, Download, Users, BarChartBig, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardAPI } from "@/lib/api";
import { toast } from "sonner";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  progress?: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  progress, 
  description, 
  isLoading = false 
}) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 animate-slide-in-up">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary dark:text-accent" />
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-primary">{value}</div>
          {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
          {progress !== undefined && <Progress value={progress} className="mt-2 h-2" />}
        </>
      )}
    </CardContent>
  </Card>
);

export default function ResumeStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalViews: 0,
    totalDownloads: 0,
    profileCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await dashboardAPI.getStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };



  const getMonthlyChange = (total: number): string => {
    // Mock monthly change calculation
    const change = Math.floor(Math.random() * 5) + 1;
    return `+${change} this month`;
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-headline font-semibold mb-4 text-primary flex items-center">
        <BarChartBig className="mr-2 h-6 w-6 text-primary dark:text-accent" />
        Your Resume Statistics
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Resumes" 
          value={stats.totalResumes} 
          icon={FileText} 
          description={stats.totalResumes > 0 ? getMonthlyChange(stats.totalResumes) : "Create your first resume!"}
          progress={Math.min(stats.totalResumes * 20, 100)} // Max out at 5 resumes
          isLoading={loading}
        />
        <StatCard 
          title="Resume Views" 
          value={stats.totalViews} 
          icon={Eye} 
          description="Across all shared links"
          isLoading={loading}
        />
        <StatCard 
          title="Downloads" 
          value={stats.totalDownloads} 
          icon={Download} 
          description="PDFs generated and downloaded"
          isLoading={loading}
        />
        <StatCard 
          title="Profile Completion" 
          value={`${stats.profileCompletion}%`} 
          icon={Users} 
          description={
            stats.profileCompletion < 100 
              ? "Complete your profile for better suggestions!" 
              : "Profile complete! 🎉"
          }
          progress={stats.profileCompletion} 
          isLoading={loading}
        />
      </div>
    </div>
  );
}
