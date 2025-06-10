"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TemplatePreview from './template-preview';
import { templatesAPI } from '@/lib/api';
import { ResumeTemplate as APIResumeTemplate } from '@/lib/api';
import { ResumeTemplate } from '@/types/resume';
import { 
  Star, 
  Award, 
  Zap, 
  Palette, 
  Briefcase, 
  FileText, 
  Loader2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface TemplateSelectorProps {
  selectedTemplate?: ResumeTemplate | null;
  onTemplateSelect: (template: ResumeTemplate) => void;
  onClose?: () => void;
}

const templateTypeIcons = {
  ats_friendly: Award,
  modern: Zap,
  creative: Palette,
  professional: Briefcase,
  classic: FileText,
  minimal: Star,
};

const templateTypeColors = {
  ats_friendly: 'bg-green-100 text-green-800 border-green-200',
  modern: 'bg-blue-100 text-blue-800 border-blue-200',
  creative: 'bg-purple-100 text-purple-800 border-purple-200',
  professional: 'bg-gray-100 text-gray-800 border-gray-200',
  classic: 'bg-amber-100 text-amber-800 border-amber-200',
  minimal: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function TemplateSelector({ selectedTemplate, onTemplateSelect, onClose }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const apiData = await templatesAPI.getAll();
      // Convert API templates to local types
      const convertedTemplates: ResumeTemplate[] = apiData.map((apiTemplate: APIResumeTemplate) => ({
        id: apiTemplate.id,
        name: apiTemplate.name,
        template_type: apiTemplate.template_type,
        description: apiTemplate.description,
        preview_image: apiTemplate.preview_image,
        css_styles: {
          fontFamily: apiTemplate.css_styles?.fontFamily || 'Inter, sans-serif',
          fontSize: apiTemplate.css_styles?.fontSize || '11px',
          lineHeight: apiTemplate.css_styles?.lineHeight || '1.5',
          colors: {
            primary: apiTemplate.css_styles?.colors?.primary || '#000000',
            secondary: apiTemplate.css_styles?.colors?.secondary || '#333333',
            accent: apiTemplate.css_styles?.colors?.accent || '#2E86AB',
          },
          spacing: {
            sectionSpacing: apiTemplate.css_styles?.spacing?.sectionSpacing || '16px',
            itemSpacing: apiTemplate.css_styles?.spacing?.itemSpacing || '8px',
          },
        },
        layout_config: {
          layout: apiTemplate.layout_config?.layout || 'standard',
          sections_order: apiTemplate.layout_config?.sections_order || [],
          show_photo: apiTemplate.layout_config?.show_photo || false,
          bullet_style: apiTemplate.layout_config?.bullet_style || 'standard',
        },
        ats_score: apiTemplate.ats_score,
        is_premium: apiTemplate.is_premium,
        created_at: apiTemplate.created_at,
        updated_at: apiTemplate.updated_at,
      }));
      setTemplates(convertedTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => 
    selectedType === 'all' || template.template_type === selectedType
  );

  const templateTypes = [
    { value: 'all', label: 'All Templates', count: templates.length },
    { value: 'ats_friendly', label: 'ATS Friendly', count: templates.filter(t => t.template_type === 'ats_friendly').length },
    { value: 'modern', label: 'Modern', count: templates.filter(t => t.template_type === 'modern').length },
    { value: 'professional', label: 'Professional', count: templates.filter(t => t.template_type === 'professional').length },
    { value: 'creative', label: 'Creative', count: templates.filter(t => t.template_type === 'creative').length },
    { value: 'minimal', label: 'Minimal', count: templates.filter(t => t.template_type === 'minimal').length },
    { value: 'classic', label: 'Classic', count: templates.filter(t => t.template_type === 'classic').length },
  ];

  const getATSScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 90) return 'text-blue-600 bg-blue-50';
    if (score >= 85) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handlePreviewTemplate = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleSelectFromPreview = () => {
    if (previewTemplate) {
      onTemplateSelect(previewTemplate);
      setIsPreviewOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Choose Your Template</h2>
        <p className="text-muted-foreground">Select from our collection of ATS-optimized resume templates</p>
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-6">
          {templateTypes.map((type) => (
            <TabsTrigger 
              key={type.value} 
              value={type.value}
              className="text-xs lg:text-sm"
            >
              {type.label}
              {type.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {type.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[600px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => {
                const IconComponent = templateTypeIcons[template.template_type as keyof typeof templateTypeIcons] || FileText;
                const isSelected = selectedTemplate?.id === template.id;
                
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                          </div>
                          {template.is_premium && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={templateTypeColors[template.template_type as keyof typeof templateTypeColors]}
                          >
                            {template.template_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getATSScoreColor(template.ats_score)}`}>
                            ATS: {template.ats_score}%
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-sm mb-4">
                          {template.description}
                        </CardDescription>
                        
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Font:</span>
                            <span className="font-medium">{template.css_styles.fontFamily.split(',')[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Layout:</span>
                            <span className="font-medium capitalize">{template.layout_config.layout.replace('-', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Photo:</span>
                            <span className="font-medium">{template.layout_config.show_photo ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewTemplate(template);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            className={`flex-1 transition-all duration-200 ${
                              isSelected 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTemplateSelect(template);
                            }}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Tabs>

      {onClose && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onClose}>
            Close Template Selector
          </Button>
        </div>
      )}

      {previewTemplate && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{previewTemplate.name} Preview</span>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Award className="h-3 w-3" />
                  <span>ATS: {previewTemplate.ats_score}%</span>
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <TemplatePreview template={previewTemplate} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleSelectFromPreview}>
                  Select This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 