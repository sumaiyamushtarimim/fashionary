
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';


function LogoUploader({ title, description, currentImage: initialImage }: { title: string; description: string; currentImage: string }) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = React.useState<string | null>(initialImage);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                {previewImage ? (
                    <Image
                        src={previewImage}
                        alt={title}
                        width={96}
                        height={96}
                        className="object-contain"
                    />
                ) : (
                    <UploadCloud className="w-8 h-8 text-muted-foreground" />
                )}
            </div>
            <div className="flex-1">
                <p className="font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
                 <div className="mt-2 flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml"
                    />
                    <Button variant="outline" size="sm" onClick={handleUploadClick}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function BrandingSettingsPage() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Settings Saved",
            description: "Your branding settings have been updated.",
        });
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Branding &amp; Appearance</h2>
                <p className="text-muted-foreground">
                    Customize your store&apos;s logo and icons.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Company Logos</CardTitle>
                    <CardDescription>
                        Upload your company logos. They will be used across the app, invoices, and website.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   <LogoUploader
                        title="Standard Logo"
                        description="Used on light backgrounds (e.g., website header, invoices). PNG, JPG, or SVG."
                        currentImage="/logo-full.svg"
                   />
                    <LogoUploader
                        title="Logo Mark / Icon"
                        description="Used in compact spaces (e.g., sidebar, browser favicon). SVG or PNG recommended."
                        currentImage="/logo-icon.svg"
                   />
                   <LogoUploader
                        title="Logo for Dark Backgrounds"
                        description="A white or light-colored version of your logo for dark UI themes."
                        currentImage="/logo-white.svg"
                   />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>App Icons</CardTitle>
                    <CardDescription>
                        Icons used when users install the app on their mobile devices (PWA).
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-8">
                   <LogoUploader
                        title="App Icon"
                        description="The main icon for the progressive web app. Should be at least 512x512px. PNG format."
                        currentImage="/icons/icon-512x512.png"
                   />
                 </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}
