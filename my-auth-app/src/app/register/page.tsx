"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Mail, Lock, Loader2, UserPlus } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuth";
import LinkedInAuthButton from "@/components/LinkedInAuth";
import Logo from "@/components/icons/Logo";

interface RegistrationErrors {
  [key: string]: string | string[];
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState<RegistrationErrors | string>({});
  const [loading, setLoading] = useState(false);
  const { user, register, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/dashboard');
    }
  }, [authLoading, router, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific field error on change
    if (typeof errors === 'object' && errors !== null && errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    } else if (typeof errors === 'string') {
        setErrors({}); // Clear general string error
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.password !== formData.password_confirm) {
      setErrors({ password_confirm: "Passwords do not match." });
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (!result.success) {
      setErrors(result.error || "An unknown error occurred during registration.");
    }
    // Successful registration is handled by AuthContext redirecting to dashboard
    setLoading(false);
  };
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const displayErrors = () => {
    if (typeof errors === 'string') {
      return <p>{errors}</p>;
    }
    if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
      return (
        <ul className="list-disc list-inside">
          {Object.entries(errors).map(([key, value]) => (
            <li key={key} className="capitalize">
              {key.replace("_", " ")}: {Array.isArray(value) ? value.join(', ') : value}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4 animate-fade-in">
      <div className="absolute top-8 left-8">
        <Logo iconSize={6} textSize="text-xl" />
      </div>
      <Card className="w-full max-w-lg shadow-2xl animate-slide-in-up" style={{animationDelay: '0.2s'}}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
          <CardDescription>Join ResumeFlow today and craft your perfect resume.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" placeholder="John" required value={formData.first_name} onChange={handleChange} disabled={loading} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" placeholder="Doe" required value={formData.last_name} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="username" name="username" placeholder="johndoe" required value={formData.username} onChange={handleChange} className="pl-10" disabled={loading} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} className="pl-10" disabled={loading} />
              </div>
            </div>
             <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} className="pl-10" disabled={loading} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password_confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password_confirm" name="password_confirm" type="password" placeholder="••••••••" required value={formData.password_confirm} onChange={handleChange} className="pl-10" disabled={loading} />
              </div>
            </div>
            
            {(typeof errors === 'string' || (typeof errors === 'object' && errors !== null && Object.keys(errors).length > 0)) && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{displayErrors()}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <GoogleAuthButton />
            <LinkedInAuthButton />
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" passHref>
               <Button variant="link" className="p-0 h-auto font-semibold text-accent hover:text-primary">
                Sign In
              </Button>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
