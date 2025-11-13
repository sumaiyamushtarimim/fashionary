
'use client';

import { MoreHorizontal, PlusCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Courier = {
    id: string;
    name: string;
    configured: boolean;
};

const initialCourierServices: Courier[] = [
    { id: 'pathao', name: 'Pathao', configured: true },
    { id: 'redx', name: 'RedX', configured: true },
    { id: 'steadfast', name: 'Steadfast', configured: false },
];

const courierFields: Record<string, { label: string; placeholder: string; type?: string }[]> = {
    pathao: [
        { label: 'Client ID', placeholder: 'Enter your Pathao Client ID' },
        { label: 'Client Secret', placeholder: 'Enter your Pathao Client Secret', type: 'password' },
    ],
    redx: [
        { label: 'API Access Token', placeholder: 'Enter your RedX API Access Token', type: 'password' },
    ],
    steadfast: [
        { label: 'API Key', placeholder: 'Enter your Steadfast API Key' },
        { label: 'Secret Key', placeholder: 'Enter your Steadfast Secret Key', type: 'password' },
    ],
};


export default function CourierSettingsPage() {
    const [couriers, setCouriers] = React.useState(initialCourierServices);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedCourier, setSelectedCourier] = React.useState<Courier | null>(null);

    const handleEditClick = (courier: Courier) => {
        setSelectedCourier(courier);
        setIsDialogOpen(true);
    };
    
    const handleSaveChanges = () => {
        if(selectedCourier){
             setCouriers(prevCouriers => 
                prevCouriers.map(c => 
                    c.id === selectedCourier.id ? { ...c, configured: true } : c
                )
            );
        }
        setIsDialogOpen(false);
        setSelectedCourier(null);
    }

    const fields = selectedCourier ? courierFields[selectedCourier.id] : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Courier Settings</h2>
                <p className="text-muted-foreground">
                    Manage your shipping and courier service integrations.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Courier Services</CardTitle>
                        <CardDescription>
                            Connect and manage your courier service providers.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Courier</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Default</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {couriers.map((courier) => (
                                <TableRow key={courier.id}>
                                    <TableCell className="font-medium">{courier.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={courier.configured ? 'default' : 'secondary'}>
                                            {courier.configured ? 'Configured' : 'Not Configured'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch disabled={!courier.configured} checked={courier.id === 'pathao'} />
                                    </TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditClick(courier)}>
                                                        Edit Configuration
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configure {selectedCourier?.name}</DialogTitle>
                        <DialogDescription>
                            Enter the API credentials for {selectedCourier?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {fields.map((field) => (
                             <div className="space-y-2" key={field.label}>
                                <Label htmlFor={field.label}>{field.label}</Label>
                                <Input id={field.label} placeholder={field.placeholder} type={field.type || 'text'} />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveChanges}>Save Configuration</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
