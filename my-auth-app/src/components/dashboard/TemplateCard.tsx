import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Star, Award, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Template {
  id: string;
  name: string;
  category: string;
  rating: number;
  popularity: number;
  isPremium?: boolean;
  aiHint?: string;
}

interface TemplateCardProps {
  template: Template;
  style?: React.CSSProperties;
}

export default function TemplateCard({ template, style }: TemplateCardProps) {
  const handlePreview = () => {
    // In a real app, you might want to show a preview modal or navigate to a preview page
    console.log(`Previewing template: ${template.name}`);
  };

  const handleUseTemplate = () => {
    // Navigate to builder with this template
    window.location.href = `/builder?templateId=${template.id}`;
  };

  const getAtsScore = (): number => {
    // Convert 5-star rating back to ATS score (rating * 10)
    return Math.round(template.rating * 10);
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col group" style={style}>
      <CardHeader className="p-0 relative">
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-md flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Premium
          </div>
        )}
        
        {/* ATS Score Badge */}
        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-md flex items-center">
          <Award className="h-3 w-3 mr-1" />
          ATS: {getAtsScore()}%
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors line-clamp-2">
          {template.name}
        </CardTitle>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Tag className="h-3 w-3 mr-1 text-primary" />
          <span className="capitalize">{template.category.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" /> 
            {template.rating.toFixed(1)}
          </div>
          <Badge variant="outline" className="text-xs">
            {template.popularity}+ uses
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Link href={`/templates?preview=${template.id}`} className="flex-1">
          <Button size="sm" variant="outline" className="w-full group/btn">
            <Eye className="mr-2 h-4 w-4 group-hover/btn:text-primary transition-colors" /> 
            Preview
          </Button>
        </Link>
        <Button 
          size="sm" 
          className="flex-1 group/btn"
          onClick={handleUseTemplate}
        >
          <Pencil className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" /> 
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
