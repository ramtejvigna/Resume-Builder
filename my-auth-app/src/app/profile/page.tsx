"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DashboardHeader from "@/components/dashboard/Header";
import { authAPI, User } from '@/lib/api';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Github,
  Linkedin,
  Globe,
  Save,
  Loader2,
  Edit,
  Camera
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  location: string;
  current_position: string;
  summary: string;
  years_of_experience: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormData>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await authAPI.getProfile();
      setUser(userData);
      reset({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        linkedin_url: userData.linkedin_url || '',
        github_url: userData.github_url || '',
        portfolio_url: userData.portfolio_url || '',
        location: userData.location || '',
        current_position: userData.current_position || '',
        summary: userData.summary || '',
        years_of_experience: userData.years_of_experience || 0,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true);
      const updatedUser = await authAPI.updateProfile(data);
      setUser(updatedUser);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-6 mx-auto" />
          <h1 className="text-2xl font-headline text-primary mb-2">Loading Profile</h1>
          <p className="text-lg text-muted-foreground">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-headline text-primary mb-2">Profile Not Found</h1>
          <p className="text-lg text-muted-foreground">Unable to load your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-secondary/20">
      <Toaster position="top-right" richColors />
      <DashboardHeader />
      
      <main className="container mx-auto flex-grow p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-2xl text-center text-muted-foreground">
            Manage your professional information and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={user.profile_picture} alt={user.first_name} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user.first_name, user.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-2xl">
                  {user.first_name} {user.last_name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {user.current_position || 'Professional'}
                </CardDescription>
                {user.provider && (
                  <Badge variant="outline" className="mt-2">
                    Signed in via {user.provider}
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.years_of_experience && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{user.years_of_experience} years experience</span>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  
                  {user.portfolio_url && (
                    <a
                      href={user.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-800"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Portfolio Website</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center">
                      <UserIcon className="h-6 w-6 mr-2" />
                      Professional Information
                    </CardTitle>
                    <CardDescription>
                      Update your professional details for better resume generation
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(!editing)}
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{editing ? 'Cancel' : 'Edit'}</span>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        {...register('first_name', { required: 'First name is required' })}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                      />
                      {errors.first_name && (
                        <p className="text-sm text-destructive">{errors.first_name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        {...register('last_name', { required: 'Last name is required' })}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                      />
                      {errors.last_name && (
                        <p className="text-sm text-destructive">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        {...register('location')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_position">Current Position</Label>
                      <Input
                        id="current_position"
                        {...register('current_position')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="Software Engineer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="years_of_experience">Years of Experience</Label>
                      <Input
                        id="years_of_experience"
                        type="number"
                        min="0"
                        max="50"
                        {...register('years_of_experience', { valueAsNumber: true })}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      {...register('summary')}
                      disabled={!editing}
                      className={!editing ? 'bg-muted' : ''}
                      placeholder="Brief description of your professional background and goals..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Social Links</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        {...register('linkedin_url')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        type="url"
                        {...register('github_url')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="portfolio_url">Portfolio URL</Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        {...register('portfolio_url')}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>

                  {editing && (
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving || !isDirty}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 