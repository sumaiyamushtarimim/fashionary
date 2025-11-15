
'use client';

import { MoreHorizontal, PlusCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
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

export default function BusinessSettingsPage() {
    const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getBusinesses().then(data => {
            setAllBusinesses(data);
            setIsLoading(false);
        });
    }, []);

    const handleAddBusiness = () => {
        if (newBusinessName.trim()) {
            const newBusiness: Business = {
                id: `BIZ${(allBusinesses.length + 1).toString().padStart(3, '0')}`,
                name: newBusinessName.trim(),
            };
            setAllBusinesses(prev => [...prev, newBusiness]);
            setNewBusinessName('');
            setIsDialogOpen(false);
        }
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Business
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Business</DialogTitle>
                                <DialogDescription>
                                    Enter the name for your new business entity.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business-name">Business Name</Label>
                                    <Input 
                                        id="business-name" 
                                        placeholder="e.g., Urban Threads"
                                        value={newBusinessName}
                                        onChange={(e) => setNewBusinessName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddBusiness}>Add Business</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                                        <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                                    </TableRow>
                                ))
                            ) : allBusinesses.length > 0 ? (
                                allBusinesses.map((business) => (
                                    <TableRow key={business.id}>
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
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24">
                                        No businesses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
