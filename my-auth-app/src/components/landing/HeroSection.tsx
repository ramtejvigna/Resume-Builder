"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Award, 
  FileText, 
  Play,
  Star
} from "lucide-react";
import Link from "next/link";

const floatingElements = [
  { icon: FileText, delay: 0, x: "20%", y: "20%" },
  { icon: Zap, delay: 0.5, x: "80%", y: "30%" },
  { icon: Award, delay: 1, x: "15%", y: "70%" },
  { icon: Star, delay: 1.5, x: "85%", y: "80%" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating Icons */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute text-primary/20"
            style={{ left: element.x, top: element.y }}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              y: [0, -20, 0], 
              rotate: [0, 5, -5, 0] 
            }}
            transition={{
              opacity: { delay: element.delay, duration: 1 },
              y: { 
                delay: element.delay + 1,
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                delay: element.delay + 1,
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Icon className="h-8 w-8 lg:h-12 lg:w-12" />
          </motion.div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 flex justify-center"
          >
            <Badge className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Resume Builder
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-foreground">
              Resumes in Minutes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Build ATS-friendly resumes with our AI-powered platform. Choose from 
            professional templates, get instant feedback, and land your dream job.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="font-semibold px-8 py-4 rounded-full border-2 hover:bg-muted/50 transition-all duration-300 group w-full sm:w-auto"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span>Join 50,000+ professionals</span>
            </div>
            
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
            
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              <span>98% ATS compatible</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 