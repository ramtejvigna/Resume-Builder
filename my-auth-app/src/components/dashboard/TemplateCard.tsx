import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Star, ThumbsUp, Tag } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  category: string;
  previewImage: string;
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
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col" style={style}>
      <CardHeader className="p-0 relative">
        <Image
          src={template.previewImage}
          alt={template.name}
          width={400}
          height={400}
          className="object-cover w-full"
          data-ai-hint={template.aiHint || "resume design"}
        />
        {template.isPremium && (
            <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded-full shadow-md flex items-center">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Premium
            </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline group-hover:text-accent transition-colors">{template.name}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Tag className="h-3 w-3 mr-1 text-accent" />
          {template.category}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" /> {template.rating.toFixed(1)}
          <ThumbsUp className="h-4 w-4 ml-3 mr-1 text-green-500" /> {template.popularity}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Button size="sm" variant="outline" className="flex-1 group">
            <Eye className="mr-2 h-4 w-4 group-hover:text-accent transition-colors" /> Preview
        </Button>
        <Button size="sm" className="flex-1 group">
            <Pencil className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
