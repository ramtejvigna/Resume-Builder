
"use client";

import type { Dispatch, FC, SetStateAction } from 'react';
import type { TemplateOptions, TextAlign } from '@/types/resume';
import SectionCard from './section-card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette } from 'lucide-react';

interface TemplateCustomizerProps {
    templateOptions: TemplateOptions;
    setTemplateOptions: Dispatch<SetStateAction<TemplateOptions>>;
}

const fontFamilies = [
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
];

const fontSizes = [
    { label: '10px', value: '10px' },
    { label: '11px', value: '11px' },
    { label: '12px', value: '12px' },
    { label: '13px', value: '13px' },
    { label: '14px', value: '14px' },
    { label: '18px', value: '18px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '40px', value: '40px' },
];

const textAlignments: { label: string; value: TextAlign }[] = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
];

const TemplateCustomizer: FC<TemplateCustomizerProps> = ({ templateOptions, setTemplateOptions }) => {
    const handleOptionChange = (field: keyof TemplateOptions, value: string) => {
        setTemplateOptions(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SectionCard title="Customize Template" icon={<Palette className="h-5 w-5 text-muted-foreground" />}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select
                        value={templateOptions.fontFamily}
                        onValueChange={(value) => handleOptionChange('fontFamily', value)}
                    >
                        <SelectTrigger id="font-family">
                            <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                            {fontFamilies.map(font => (
                                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                    {font.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select
                        value={templateOptions.fontSize}
                        onValueChange={(value) => handleOptionChange('fontSize', value)}
                    >
                        <SelectTrigger id="font-size">
                            <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                            {fontSizes.map(size => (
                                <SelectItem key={size.value} value={size.value}>
                                    {size.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Text Alignment</Label>
                    <RadioGroup
                        value={templateOptions.textAlign}
                        onValueChange={(value) => handleOptionChange('textAlign', value as TextAlign)}
                        className="flex space-x-2 pt-2"
                    >
                        {textAlignments.map(align => (
                            <div key={align.value} className="flex items-center space-x-1">
                                <RadioGroupItem value={align.value} id={`align-${align.value}`} />
                                <Label htmlFor={`align-${align.value}`} className="font-normal cursor-pointer">{align.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
        </SectionCard>
    );
};

export default TemplateCustomizer;
