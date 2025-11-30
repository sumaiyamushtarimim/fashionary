

'use client';

import { MoreHorizontal, PlusCircle, UploadCloud } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBusinesses } from '@/services/partners';
import type { Business } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function LogoUploader({ title, currentImage, onImageChange }: { title: string, currentImage: string | null | undefined, onImageChange: (file: File) => void}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex items-center gap-6 pt-4">
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
                 <div className="mt-2 flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/svg+xml"
                    />
                    <Button variant="outline" size="sm" type="button" onClick={handleUploadClick}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Logo
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function BusinessSettingsPage() {
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getBusinesses().then(data => {
            setAllBusinesses(data);
            setIsLoading(false);
        });
    }, []);

    const handleOpenDialog = (business?: Business) => {
        setEditingBusiness(business || null);
        setIsDialogOpen(true);
    };

    const handleSaveBusiness = (formData: {name: string, logoFile?: File}) => {
        if (editingBusiness) {
            // Edit logic
            setAllBusinesses(prev => prev.map(b => b.id === editingBusiness.id ? { ...b, name: formData.name, logo: formData.logoFile ? URL.createObjectURL(formData.logoFile) : b.logo } : b));
        } else {
            // Add logic
             const newBusiness: Business = {
                id: `BIZ${(allBusinesses.length + 1).toString().padStart(3, '0')}`,
                name: formData.name.trim(),
                logo: formData.logoFile ? URL.createObjectURL(formData.logoFile) : '/logo-icon.svg', // Default logo
            };
            setAllBusinesses(prev => [...prev, newBusiness]);
        }
        setIsDialogOpen(false);
        setEditingBusiness(null);
    };

    const BusinessForm = ({ business, onSave }: { business: Business | null, onSave: (data: {name: string, logoFile?: File}) => void }) => {
        const [name, setName] = useState(business?.name || '');
        const [logoFile, setLogoFile] = useState<File | undefined>();

        const handleSubmit = () => {
            if(name.trim()) {
                onSave({ name, logoFile });
            }
        };
        
        return (
            <>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="business-name">Business Name</Label>
                        <Input 
                            id="business-name" 
                            placeholder="e.g., Urban Threads"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <LogoUploader title="Business Logo" currentImage={business?.logo} onImageChange={setLogoFile} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>
                        {business ? 'Save Changes' : 'Add Business'}
                    </Button>
                </DialogFooter>
            </>
        )
    };


    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Business Settings</h2>
                <p className="text-muted-foreground">
                    Manage your different business entities or brands.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Businesses</CardTitle>
                        <CardDescription>
                            Add, edit, or remove your business profiles.
                        </CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Business
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Logo</TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                                    </TableRow>
                                ))
                            ) : allBusinesses.length > 0 ? (
                                allBusinesses.map((business) => (
                                    <TableRow key={business.id}>
                                         <TableCell>
                                            <Image
                                                src={business.logo || '/logo-icon.svg'}
                                                alt={`${business.name} logo`}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-contain"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{business.name}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleOpenDialog(business)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                        No businesses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingBusiness ? 'Edit Business' : 'Add New Business'}</DialogTitle>
                        <DialogDescription>
                            {editingBusiness ? `Update the details for ${editingBusiness.name}.` : 'Enter the details for your new business entity.'}
                        </DialogDescription>
                    </DialogHeader>
                    <BusinessForm business={editingBusiness} onSave={handleSaveBusiness} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
