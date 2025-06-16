"use client";

import LandingHeader from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TemplatesShowcase from "@/components/landing/TemplatesShowcase";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TemplatesShowcase />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
}
