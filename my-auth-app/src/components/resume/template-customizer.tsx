"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Palette, Type, Layout, BracketsIcon as Spacing, Eye, Undo, Save } from "lucide-react"
import type { EnhancedTemplateOptions } from "@/types/resume"

interface EnhancedTemplateCustomizerProps {
    templateOptions: EnhancedTemplateOptions
    setTemplateOptions: (options: EnhancedTemplateOptions) => void
    onPreview?: () => void
    onSavePreset?: (name: string) => void
}

const fontFamilies = [
    "Inter, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Lato, sans-serif",
    "Montserrat, sans-serif",
    "Poppins, sans-serif",
    "Source Sans Pro, sans-serif",
    "Nunito, sans-serif",
    "Playfair Display, serif",
    "Merriweather, serif",
    "Lora, serif",
    "Crimson Text, serif",
    "PT Serif, serif",
    "Fira Code, monospace",
    "Source Code Pro, monospace",
]

const colorPresets = [
    {
        name: "Professional Blue",
        colors: {
            primary: "#1e40af",
            secondary: "#374151",
            accent: "#3b82f6",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
    },
    {
        name: "Modern Green",
        colors: {
            primary: "#059669",
            secondary: "#374151",
            accent: "#10b981",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
    },
    {
        name: "Creative Purple",
        colors: {
            primary: "#7c3aed",
            secondary: "#374151",
            accent: "#8b5cf6",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
    },
    {
        name: "Elegant Black",
        colors: {
            primary: "#000000",
            secondary: "#374151",
            accent: "#4b5563",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
    },
    {
        name: "Warm Orange",
        colors: {
            primary: "#ea580c",
            secondary: "#374151",
            accent: "#f97316",
            background: "#ffffff",
            text: "#111827",
            muted: "#6b7280",
        },
    },
]

export default function EnhancedTemplateCustomizer({
    templateOptions,
    setTemplateOptions,
    onPreview,
    onSavePreset,
}: EnhancedTemplateCustomizerProps) {
    const [activeTab, setActiveTab] = useState("typography")
    const [presetName, setPresetName] = useState("")

    const updateOptions = (updates: Partial<EnhancedTemplateOptions>) => {
        setTemplateOptions({ ...templateOptions, ...updates })
    }

    const updateNestedOptions = (path: string[], value: any) => {
        const newOptions = { ...templateOptions }
        let current = newOptions as any

        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]]
        }
        current[path[path.length - 1]] = value

        setTemplateOptions(newOptions)
    }

    const applyColorPreset = (preset: (typeof colorPresets)[0]) => {
        updateOptions({ colors: preset.colors })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Template Customizer</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="typography">
                            <Type className="h-4 w-4 mr-1" />
                            Typography
                        </TabsTrigger>
                        <TabsTrigger value="colors">
                            <Palette className="h-4 w-4 mr-1" />
                            Colors
                        </TabsTrigger>
                        <TabsTrigger value="layout">
                            <Layout className="h-4 w-4 mr-1" />
                            Layout
                        </TabsTrigger>
                        <TabsTrigger value="spacing">
                            <Spacing className="h-4 w-4 mr-1" />
                            Spacing
                        </TabsTrigger>
                        <TabsTrigger value="advanced">
                            <Eye className="h-4 w-4 mr-1" />
                            Advanced
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="typography" className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fontFamily">Font Family</Label>
                                <Select
                                    value={templateOptions.fontFamily}
                                    onValueChange={(value) => updateOptions({ fontFamily: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fontFamilies.map((font) => (
                                            <SelectItem key={font} value={font}>
                                                <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fontSize">Base Font Size</Label>
                                    <Select
                                        value={templateOptions.fontSize}
                                        onValueChange={(value) => updateOptions({ fontSize: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10px">10px - Small</SelectItem>
                                            <SelectItem value="11px">11px - Default</SelectItem>
                                            <SelectItem value="12px">12px - Medium</SelectItem>
                                            <SelectItem value="13px">13px - Large</SelectItem>
                                            <SelectItem value="14px">14px - Extra Large</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="lineHeight">Line Height</Label>
                                    <Select
                                        value={templateOptions.lineHeight}
                                        onValueChange={(value) => updateOptions({ lineHeight: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1.2">1.2 - Tight</SelectItem>
                                            <SelectItem value="1.4">1.4 - Normal</SelectItem>
                                            <SelectItem value="1.5">1.5 - Relaxed</SelectItem>
                                            <SelectItem value="1.6">1.6 - Loose</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Font Weights</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div>
                                        <Label className="text-sm">Normal</Label>
                                        <Select
                                            value={templateOptions.fontWeight.normal}
                                            onValueChange={(value) => updateNestedOptions(["fontWeight", "normal"], value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="300">300 - Light</SelectItem>
                                                <SelectItem value="400">400 - Normal</SelectItem>
                                                <SelectItem value="500">500 - Medium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Bold</Label>
                                        <Select
                                            value={templateOptions.fontWeight.bold}
                                            onValueChange={(value) => updateNestedOptions(["fontWeight", "bold"], value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="600">600 - Semi Bold</SelectItem>
                                                <SelectItem value="700">700 - Bold</SelectItem>
                                                <SelectItem value="800">800 - Extra Bold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Light</Label>
                                        <Select
                                            value={templateOptions.fontWeight.light}
                                            onValueChange={(value) => updateNestedOptions(["fontWeight", "light"], value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="200">200 - Extra Light</SelectItem>
                                                <SelectItem value="300">300 - Light</SelectItem>
                                                <SelectItem value="400">400 - Normal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="colors" className="space-y-6">
                        <div>
                            <Label>Color Presets</Label>
                            <div className="grid grid-cols-1 gap-2 mt-2">
                                {colorPresets.map((preset) => (
                                    <Button
                                        key={preset.name}
                                        variant="outline"
                                        className="justify-start h-auto p-3"
                                        onClick={() => applyColorPreset(preset)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex space-x-1">
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: preset.colors.primary }}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: preset.colors.accent }}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded-full border"
                                                    style={{ backgroundColor: preset.colors.secondary }}
                                                />
                                            </div>
                                            <span>{preset.name}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <Label>Custom Colors</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="primaryColor">Primary Color</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="color"
                                            value={templateOptions.colors.primary}
                                            onChange={(e) => updateNestedOptions(["colors", "primary"], e.target.value)}
                                            className="w-12 h-10 p-1 border rounded"
                                        />
                                        <Input
                                            value={templateOptions.colors.primary}
                                            onChange={(e) => updateNestedOptions(["colors", "primary"], e.target.value)}
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="accentColor">Accent Color</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="color"
                                            value={templateOptions.colors.accent}
                                            onChange={(e) => updateNestedOptions(["colors", "accent"], e.target.value)}
                                            className="w-12 h-10 p-1 border rounded"
                                        />
                                        <Input
                                            value={templateOptions.colors.accent}
                                            onChange={(e) => updateNestedOptions(["colors", "accent"], e.target.value)}
                                            placeholder="#3b82f6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="color"
                                            value={templateOptions.colors.secondary}
                                            onChange={(e) => updateNestedOptions(["colors", "secondary"], e.target.value)}
                                            className="w-12 h-10 p-1 border rounded"
                                        />
                                        <Input
                                            value={templateOptions.colors.secondary}
                                            onChange={(e) => updateNestedOptions(["colors", "secondary"], e.target.value)}
                                            placeholder="#374151"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="textColor">Text Color</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="color"
                                            value={templateOptions.colors.text}
                                            onChange={(e) => updateNestedOptions(["colors", "text"], e.target.value)}
                                            className="w-12 h-10 p-1 border rounded"
                                        />
                                        <Input
                                            value={templateOptions.colors.text}
                                            onChange={(e) => updateNestedOptions(["colors", "text"], e.target.value)}
                                            placeholder="#111827"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="layout" className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label>Layout Type</Label>
                                <Select
                                    value={templateOptions.layout.type}
                                    onValueChange={(value) => updateNestedOptions(["layout", "type"], value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single-column">Single Column</SelectItem>
                                        <SelectItem value="two-column">Two Column</SelectItem>
                                        <SelectItem value="sidebar">Sidebar</SelectItem>
                                        <SelectItem value="modern">Modern</SelectItem>
                                        <SelectItem value="creative">Creative</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Header Alignment</Label>
                                <Select
                                    value={templateOptions.layout.headerAlignment}
                                    onValueChange={(value) => updateNestedOptions(["layout", "headerAlignment"], value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="sectionDividers">Section Dividers</Label>
                                <Switch
                                    id="sectionDividers"
                                    checked={templateOptions.layout.sectionDividers}
                                    onCheckedChange={(checked) => updateNestedOptions(["layout", "sectionDividers"], checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="shadows">Drop Shadows</Label>
                                <Switch
                                    id="shadows"
                                    checked={templateOptions.layout.shadows}
                                    onCheckedChange={(checked) => updateNestedOptions(["layout", "shadows"], checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="showPhoto">Show Profile Photo</Label>
                                <Switch
                                    id="showPhoto"
                                    checked={templateOptions.showPhoto}
                                    onCheckedChange={(checked) => updateOptions({ showPhoto: checked })}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="spacing" className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label>Section Spacing: {templateOptions.spacing.sectionSpacing}</Label>
                                <Slider
                                    value={[Number.parseInt(templateOptions.spacing.sectionSpacing)]}
                                    onValueChange={([value]) => updateNestedOptions(["spacing", "sectionSpacing"], `${value}px`)}
                                    max={40}
                                    min={8}
                                    step={2}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label>Item Spacing: {templateOptions.spacing.itemSpacing}</Label>
                                <Slider
                                    value={[Number.parseInt(templateOptions.spacing.itemSpacing)]}
                                    onValueChange={([value]) => updateNestedOptions(["spacing", "itemSpacing"], `${value}px`)}
                                    max={20}
                                    min={4}
                                    step={1}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label>Paragraph Spacing: {templateOptions.spacing.paragraphSpacing}</Label>
                                <Slider
                                    value={[Number.parseInt(templateOptions.spacing.paragraphSpacing)]}
                                    onValueChange={([value]) => updateNestedOptions(["spacing", "paragraphSpacing"], `${value}px`)}
                                    max={16}
                                    min={2}
                                    step={1}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label>Page Margins</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <Label className="text-sm">Top</Label>
                                        <Input
                                            value={templateOptions.spacing.margins.top}
                                            onChange={(e) => updateNestedOptions(["spacing", "margins", "top"], e.target.value)}
                                            placeholder="20px"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Right</Label>
                                        <Input
                                            value={templateOptions.spacing.margins.right}
                                            onChange={(e) => updateNestedOptions(["spacing", "margins", "right"], e.target.value)}
                                            placeholder="20px"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Bottom</Label>
                                        <Input
                                            value={templateOptions.spacing.margins.bottom}
                                            onChange={(e) => updateNestedOptions(["spacing", "margins", "bottom"], e.target.value)}
                                            placeholder="20px"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm">Left</Label>
                                        <Input
                                            value={templateOptions.spacing.margins.left}
                                            onChange={(e) => updateNestedOptions(["spacing", "margins", "left"], e.target.value)}
                                            placeholder="20px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="customCSS">Custom CSS</Label>
                                <Textarea
                                    id="customCSS"
                                    value={templateOptions.customCSS || ""}
                                    onChange={(e) => updateOptions({ customCSS: e.target.value })}
                                    placeholder="/* Add your custom CSS here */&#10;.resume-header {&#10;  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);&#10;}"
                                    rows={8}
                                    className="font-mono text-sm"
                                />
                            </div>

                            <div>
                                <Label>Section Headers Style</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <Label className="text-sm">Text Transform</Label>
                                        <Select
                                            value={templateOptions.sections.sectionHeaders.textTransform}
                                            onValueChange={(value) =>
                                                updateNestedOptions(["sections", "sectionHeaders", "textTransform"], value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                                                <SelectItem value="capitalize">Capitalize</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Border Bottom</Label>
                                        <Input
                                            value={templateOptions.sections.sectionHeaders.borderBottom}
                                            onChange={(e) =>
                                                updateNestedOptions(["sections", "sectionHeaders", "borderBottom"], e.target.value)
                                            }
                                            placeholder="2px solid #3b82f6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label>Content Style</Label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div>
                                        <Label className="text-sm">Bullet Style</Label>
                                        <Select
                                            value={templateOptions.sections.content.bulletStyle}
                                            onValueChange={(value) => updateNestedOptions(["sections", "content", "bulletStyle"], value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="disc">Disc</SelectItem>
                                                <SelectItem value="circle">Circle</SelectItem>
                                                <SelectItem value="square">Square</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm">Link Color</Label>
                                        <div className="flex space-x-2">
                                            <Input
                                                type="color"
                                                value={templateOptions.sections.content.linkColor}
                                                onChange={(e) => updateNestedOptions(["sections", "content", "linkColor"], e.target.value)}
                                                className="w-12 h-10 p-1 border rounded"
                                            />
                                            <Input
                                                value={templateOptions.sections.content.linkColor}
                                                onChange={(e) => updateNestedOptions(["sections", "content", "linkColor"], e.target.value)}
                                                placeholder="#3b82f6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                            <Undo className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                        <Button variant="outline" size="sm" onClick={onPreview}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                        </Button>
                    </div>

                    <div className="flex space-x-2">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Preset name"
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                className="w-32"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSavePreset?.(presetName)}
                                disabled={!presetName.trim()}
                            >
                                <Save className="h-4 w-4 mr-1" />
                                Save Preset
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
