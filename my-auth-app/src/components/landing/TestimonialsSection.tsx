"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
    avatar: "SJ",
    content: "ResumeFlow helped me land my dream job at Google. The ATS optimization feature is game-changing!",
    rating: 5,
    company: "Google"
  },
  {
    name: "Michael Chen",
    role: "Product Manager at Microsoft",
    avatar: "MC",
    content: "The templates are beautiful and professional. I got 3 interview calls within a week of updating my resume.",
    rating: 5,
    company: "Microsoft"
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at Apple",
    avatar: "ER",
    content: "Amazing platform! The AI suggestions helped me articulate my experience much better.",
    rating: 5,
    company: "Apple"
  },
  {
    name: "David Kim",
    role: "Data Scientist at Meta",
    avatar: "DK",
    content: "Best resume builder I've used. Clean interface, great templates, and excellent ATS compatibility.",
    rating: 5,
    company: "Meta"
  },
  {
    name: "Lisa Thompson",
    role: "Marketing Director at Netflix",
    avatar: "LT",
    content: "Professional results in minutes. The real-time preview feature saved me so much time.",
    rating: 5,
    company: "Netflix"
  },
  {
    name: "James Wilson",
    role: "DevOps Engineer at Amazon",
    avatar: "JW",
    content: "Highly recommend! Got my current role thanks to the perfectly formatted resume from ResumeFlow.",
    rating: 5,
    company: "Amazon"
  }
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Loved by 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what successful professionals 
            are saying about ResumeFlow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${testimonial.avatar}&background=2E86AB&color=fff`} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 