
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
import { getStockLocations } from '@/services/inventory';
import type { StockLocation } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function LocationsSettingsPage() {
    const [allLocations, setAllLocations] = useState<StockLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newLocationName, setNewLocationName] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getStockLocations().then(data => {
            setAllLocations(data);
            setIsLoading(false);
        });
    }, []);

    const handleAddLocation = () => {
        if (newLocationName.trim()) {
            const newLocation: StockLocation = {
                id: `LOC${(allLocations.length + 1).toString().padStart(3, '0')}`,
                name: newLocationName.trim(),
            };
            setAllLocations(prev => [...prev, newLocation]);
            setNewLocationName('');
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Stock Locations</h2>
                <p className="text-muted-foreground">
                    Manage your warehouses, showrooms, and other stock locations.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Locations</CardTitle>
                        <CardDescription>
                            Add, edit, or remove your stock locations.
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Location
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Location</DialogTitle>
                                <DialogDescription>
                                    Enter the name for your new stock location.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location-name">Location Name</Label>
                                    <Input 
                                        id="location-name" 
                                        placeholder="e.g., Showroom 3"
                                        value={newLocationName}
                                        onChange={(e) => setNewLocationName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddLocation}>Add Location</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location Name</TableHead>
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
                            ) : allLocations.length > 0 ? (
                                allLocations.map((location) => (
                                    <TableRow key={location.id}>
                                        <TableCell className="font-medium">{location.name}</TableCell>
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
                                        No locations found.
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
