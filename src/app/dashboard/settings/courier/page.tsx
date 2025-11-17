
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCourierIntegrations, getCourierServices } from '@/services/integrations';
import { getBusinesses } from '@/services/partners';
import type { CourierIntegration, CourierService, Business } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const courierFields: Record<string, { label: string; placeholder: string; type?: string }[]> = {
    Pathao: [
        { label: 'Client ID', placeholder: 'Enter your Pathao Client ID' },
        { label: 'Client Secret', placeholder: 'Enter your Pathao Client Secret', type: 'password' },
    ],
    RedX: [
        { label: 'API Access Token', placeholder: 'Enter your RedX API Access Token', type: 'password' },
    ],
    Steadfast: [
        { label: 'API Key', placeholder: 'Enter your Steadfast API Key' },
        { label: 'Secret Key', placeholder: 'Enter your Steadfast Secret Key', type: 'password' },
    ],
};

export default function CourierSettingsPage() {
    const [integrations, setIntegrations] = React.useState<CourierIntegration[]>([]);
    const [businesses, setBusinesses] = React.useState<Business[]>([]);
    const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedIntegration, setSelectedIntegration] = React.useState<CourierIntegration | null>(null);
    const [dialogMode, setDialogMode] = React.useState<'add' | 'edit'>('add');

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getCourierIntegrations(),
            getBusinesses(),
            getCourierServices()
        ]).then(([integrationsData, businessesData, courierServicesData]) => {
            setIntegrations(integrationsData);
            setBusinesses(businessesData);
            setCourierServices(courierServicesData);
            setIsLoading(false);
        });
    }, []);

    const handleOpenDialog = (mode: 'add' | 'edit', integration?: CourierIntegration) => {
        setDialogMode(mode);
        setSelectedIntegration(integration || null);
        setIsDialogOpen(true);
    };

    const handleSaveChanges = () => {
        // Logic to save changes would go here
        setIsDialogOpen(false);
        setSelectedIntegration(null);
    };

    const fields = selectedIntegration ? courierFields[selectedIntegration.courierName] : [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Courier Settings</h2>
                <p className="text-muted-foreground">
                    Manage your shipping and courier service integrations for each business.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Courier Integrations</CardTitle>
                        <CardDescription>
                            Connect courier services for each of your business entities.
                        </CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog('add')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Integration
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Business</TableHead>
                                <TableHead>Courier</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                                    </TableRow>
                                ))
                            ) : integrations.length > 0 ? (
                                integrations.map((integration) => (
                                    <TableRow key={integration.id}>
                                        <TableCell className="font-medium">{integration.businessName}</TableCell>
                                        <TableCell>{integration.courierName}</TableCell>
                                        <TableCell>
                                            <Badge variant={integration.status === 'Active' ? 'default' : 'secondary'}>
                                                {integration.status}
                                            </Badge>
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
                                                        <DropdownMenuItem onClick={() => handleOpenDialog('edit', integration)}>
                                                            Edit Configuration
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        No courier integrations found.
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
                        <DialogTitle>
                            {dialogMode === 'edit' ? `Configure ${selectedIntegration?.courierName}` : 'Add New Courier Integration'}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the API credentials for this integration.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="business">Business</Label>
                            <Select defaultValue={selectedIntegration?.businessId} disabled={dialogMode==='edit'}>
                                <SelectTrigger id="business">
                                    <SelectValue placeholder="Select a business" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businesses.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="courier">Courier Service</Label>
                            <Select defaultValue={selectedIntegration?.courierName} disabled={dialogMode==='edit'}>
                                <SelectTrigger id="courier">
                                    <SelectValue placeholder="Select a courier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courierServices.map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedIntegration && courierFields[selectedIntegration.courierName]?.map((field) => (
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
