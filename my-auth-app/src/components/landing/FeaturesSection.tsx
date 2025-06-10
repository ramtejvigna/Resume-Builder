"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Zap, 
  Award, 
  Palette, 
  Download, 
  Shield,
  Target,
  Clock,
  BarChart3,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Writing",
    description: "Let our AI suggest compelling content and optimize your resume for any job role.",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Create professional resumes in minutes, not hours. Our streamlined process saves you time.",
    color: "from-yellow-500 to-orange-600"
  },
  {
    icon: Award,
    title: "ATS Optimized",
    description: "98% ATS pass rate ensures your resume gets past automated screening systems.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Choose from dozens of professionally designed templates that make you stand out.",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Download your resume as PDF, Word, or share it online with a custom link.",
    color: "from-indigo-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Privacy Secure",
    description: "Your data is encrypted and secure. We never share your information with third parties.",
    color: "from-gray-500 to-slate-600"
  },
  {
    icon: Target,
    title: "Job Matching",
    description: "Get personalized job recommendations based on your skills and experience.",
    color: "from-red-500 to-pink-600"
  },
  {
    icon: Clock,
    title: "Real-time Preview",
    description: "See your changes instantly with our live preview feature. What you see is what you get.",
    color: "from-cyan-500 to-teal-600"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your resume performance with detailed analytics and improvement suggestions.",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Edit and manage your resumes on any device. Responsive design for all screen sizes.",
    color: "from-orange-500 to-amber-600"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Everything You Need to 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and features you need to create 
            outstanding resumes that get you hired.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className={`${index < 5 ? 'lg:col-span-1' : index < 8 ? 'xl:col-span-1 lg:col-span-1' : 'xl:col-span-1 lg:col-span-1'}`}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30 group">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.div>
                    
                    <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-12 border border-primary/20">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Build Your Perfect Resume?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of successful professionals who've transformed their careers 
              with our platform. Start building your dream resume today.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Building Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 