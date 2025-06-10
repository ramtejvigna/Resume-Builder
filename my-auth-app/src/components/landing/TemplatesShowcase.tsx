"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Eye, ArrowRight } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "ATS Professional",
    category: "Professional",
    atsScore: 98,
    preview: "/api/placeholder/300/400",
    description: "Clean, ATS-optimized template perfect for corporate environments.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    name: "Modern Creative",
    category: "Creative",
    atsScore: 95,
    preview: "/api/placeholder/300/400",
    description: "Contemporary design with creative elements that make you stand out.",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 3,
    name: "Executive Classic",
    category: "Executive",
    atsScore: 96,
    preview: "/api/placeholder/300/400",
    description: "Traditional executive format ideal for senior positions.",
    color: "from-gray-600 to-gray-800"
  },
  {
    id: 4,
    name: "Tech Focus",
    category: "Technology",
    atsScore: 94,
    preview: "/api/placeholder/300/400",
    description: "Optimized for technical roles with emphasis on skills and projects.",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 5,
    name: "Minimalist Clean",
    category: "Minimal",
    atsScore: 97,
    preview: "/api/placeholder/300/400",
    description: "Ultra-clean design with maximum white space for clarity.",
    color: "from-cyan-500 to-teal-600"
  },
  {
    id: 6,
    name: "Creative Portfolio",
    category: "Portfolio",
    atsScore: 88,
    preview: "/api/placeholder/300/400",
    description: "Perfect for creative professionals showcasing their work.",
    color: "from-orange-500 to-red-600"
  }
];

export default function TemplatesShowcase() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  return (
    <section id="templates" ref={ref} className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Professional Templates for 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Every Industry</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our collection of expertly designed templates, each optimized for 
            ATS systems and tailored to specific industries and career levels.
          </p>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setSelectedTemplate(template.id)}
              onHoverEnd={() => setSelectedTemplate(null)}
              className="group cursor-pointer"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-background">
                <div className="relative aspect-[3/4] overflow-hidden">
                  {/* Template Preview */}
                  <div className={`w-full h-full bg-gradient-to-br ${template.color} p-6 flex flex-col`}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex-1 flex flex-col">
                      <div className="space-y-3">
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                        
                        <div className="pt-4 space-y-2">
                          <div className="h-2 bg-gray-300 rounded w-full"></div>
                          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                        </div>
                        
                        <div className="pt-4 space-y-2">
                          <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* ATS Score Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center shadow-lg">
                    <Award className="h-3 w-3 mr-1" />
                    {template.atsScore}%
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: selectedTemplate === template.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Template
                    </Button>
                  </motion.div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {template.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {template.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Templates CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 lg:p-12 border border-primary/20">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Explore All Templates
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover our complete collection of over 50 professional templates, 
              each designed to help you land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Browse All Templates
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="font-semibold px-8 py-4 rounded-full border-2"
              >
                Start Building Free
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 