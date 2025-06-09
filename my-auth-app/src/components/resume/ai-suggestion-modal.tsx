"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { resumeContentSuggestion, type ResumeContentSuggestionInput } from '@/app/ai/flows/resume-content-suggestion';
// import { useToast } from '@/hooks/use-toast';

interface AISuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentText: string;
    onApplySuggestion: (suggestion: string) => void;
    context?: string; // e.g., "professional summary", "job description for role X"
    jobDescription?: string;
}

const AISuggestionModal: FC<AISuggestionModalProps> = ({
    isOpen,
    onClose,
    currentText,
    onApplySuggestion,
    context,
    jobDescription,
}) => {
    const [suggestion, setSuggestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>(currentText);
    // const { toast } = useToast();

    useEffect(() => {
        setEditedText(currentText);
        setSuggestion(''); // Reset suggestion when currentText changes or modal reopens
    }, [currentText, isOpen]);

    const handleGenerateSuggestion = async () => {
        setIsLoading(true);
        setSuggestion('');
        try {
            const input: ResumeContentSuggestionInput = {
                resumeContent: editedText,
                jobDescription: jobDescription,
            };
            const result = await resumeContentSuggestion(input);
            setSuggestion(result.improvedContent);
        } catch (error) {
            console.error('Error generating AI suggestion:', error);
            // toast({
            //     title: "Error",
            //     description: "Failed to generate AI suggestion. Please try again.",
            //     variant: "destructive",
            // });
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        onApplySuggestion(suggestion || editedText);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card">
                <DialogHeader>
                    <DialogTitle className="font-headline flex items-center">
                        <Wand2 className="mr-2 h-5 w-5 text-primary" />
                        AI Content Suggestion {context ? `for ${context}` : ''}
                    </DialogTitle>
                    <DialogDescription>
                        Improve your content with AI-powered suggestions. Edit your current text or generate a new suggestion.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-text">Your Current Text</Label>
                        <Textarea
                            id="current-text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            rows={5}
                            className="bg-background"
                        />
                    </div>
                    <Button onClick={handleGenerateSuggestion} disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Generate Suggestion
                    </Button>
                    {suggestion && (
                        <div className="grid gap-2">
                            <Label htmlFor="suggested-text">AI Suggestion</Label>
                            <Textarea
                                id="suggested-text"
                                value={suggestion}
                                readOnly
                                rows={5}
                                className="bg-muted text-muted-foreground"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply} disabled={!suggestion && editedText === currentText}>
                        Apply
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AISuggestionModal;
