
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
import { getCourierIntegrations } from '@/services/integrations';
import { getCourierServices, getBusinesses } from '@/services/partners';
import type { CourierIntegration, CourierService, Business, PathaoCredentials, SteadfastCredentials, RedXCredentials, CarrybeeCredentials } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const pathaoFields = [
    { name: 'clientId', label: 'Client ID', placeholder: 'Enter your Pathao Client ID' },
    { name: 'clientSecret', label: 'Client Secret', placeholder: 'Enter your Pathao Client Secret', type: 'password' },
    { name: 'username', label: 'Username (Email)', placeholder: 'Your Pathao Login Email' },
    { name: 'password', label: 'Password', placeholder: 'Your Pathao Login Password', type: 'password' },
    { name: 'storeId', label: 'Store ID', placeholder: 'Your Pathao Store ID' },
];

const steadfastFields = [
    { name: 'apiKey', label: 'API Key', placeholder: 'Enter your Steadfast API Key' },
    { name: 'secretKey', label: 'Secret Key', placeholder: 'Enter your Steadfast Secret Key', type: 'password' },
];

const redxFields = [
     { name: 'accessToken', label: 'API Access Token', placeholder: 'Enter your RedX API Access Token', type: 'password' },
];

const carrybeeFields = [
    { name: 'clientId', label: 'Client ID', placeholder: 'Enter your Carrybee Client ID' },
    { name: 'clientSecret', label: 'Client Secret', placeholder: 'Enter your Carrybee Client Secret', type: 'password' },
    { name: 'clientContext', label: 'Client Context', placeholder: 'Enter your Carrybee Client Context' },
];


function CourierIntegrationDialog({
    isOpen,
    onOpenChange,
    mode,
    integration,
    businesses,
    courierServices,
    onSave,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    integration: Partial<CourierIntegration> | null;
    businesses: Business[];
    courierServices: CourierService[];
    onSave: (integration: Partial<CourierIntegration> | null) => void;
}) {
    const [currentIntegration, setCurrentIntegration] = React.useState(integration);

    React.useEffect(() => {
        setCurrentIntegration(integration);
    }, [integration]);

    const handleValueChange = (field: keyof CourierIntegration, value: any) => {
        setCurrentIntegration(prev => (prev ? { ...prev, [field]: value } : { [field]: value }));
    };

    const handleCredentialChange = (field: keyof (PathaoCredentials | SteadfastCredentials | RedXCredentials | CarrybeeCredentials), value: any) => {
         setCurrentIntegration(prev => ({
            ...prev,
            credentials: {
                ...(prev?.credentials || {}),
                [field]: value
            }
        }));
    };
    
    let fields: { name: string; label: string; placeholder: string; type?: string }[] = [];
    if (currentIntegration?.courierName === 'Pathao') {
        fields = pathaoFields;
    } else if (currentIntegration?.courierName === 'Steadfast') {
        fields = steadfastFields;
    } else if (currentIntegration?.courierName === 'RedX') {
        fields = redxFields;
    } else if (currentIntegration?.courierName === 'Carrybee') {
        fields = carrybeeFields;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg flex flex-col max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? `Configure ${currentIntegration?.courierName}` : 'Add New Courier Integration'}
                    </DialogTitle>
                    <DialogDescription>
                        Enter the API credentials for this integration.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto px-1">
                    <div className="space-y-2">
                        <Label htmlFor="business">Business</Label>
                        <Select
                            value={currentIntegration?.businessId}
                            onValueChange={(value) => handleValueChange('businessId', value)}
                            disabled={mode === 'edit'}
                        >
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
                        <Select
                            value={currentIntegration?.courierName}
                            onValueChange={(value: CourierService) => handleValueChange('courierName', value)}
                            disabled={mode === 'edit'}
                        >
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

                    {fields?.map((field) => (
                         <div className="space-y-2" key={field.name}>
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <Input
                                id={field.name}
                                placeholder={field.placeholder}
                                type={field.type || 'text'}
                                value={(currentIntegration?.credentials as any)?.[field.name] || ''}
                                onChange={(e) => handleCredentialChange(field.name as any, e.target.value)}
                            />
                        </div>
                    ))}

                    {currentIntegration?.courierName === 'Pathao' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="deliveryType">Delivery Type</Label>
                                <Select
                                    value={String(currentIntegration.deliveryType || 48)}
                                    onValueChange={(value) => handleValueChange('deliveryType', Number(value))}
                                >
                                    <SelectTrigger id="deliveryType"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="48">Normal Delivery (48 hours)</SelectItem>
                                        <SelectItem value="12">On Demand Delivery (12 hours)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="itemType">Item Type</Label>
                                 <Select
                                    value={String(currentIntegration.itemType || 2)}
                                    onValueChange={(value) => handleValueChange('itemType', Number(value))}
                                >
                                    <SelectTrigger id="itemType"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">Parcel</SelectItem>
                                        <SelectItem value="1">Document</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="mt-auto pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onSave(currentIntegration)}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function CourierSettingsPage() {
    const [integrations, setIntegrations] = React.useState<CourierIntegration[]>([]);
    const [businesses, setBusinesses] = React.useState<Business[]>([]);
    const [courierServices, setCourierServices] = React.useState<CourierService[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [selectedIntegration, setSelectedIntegration] = React.useState<Partial<CourierIntegration> | null>(null);
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
        setSelectedIntegration(integration || {});
        setIsDialogOpen(true);
    };

    const handleSaveChanges = (integration: Partial<CourierIntegration> | null) => {
        // Logic to save changes would go here
        console.log("Saving integration:", integration);
        setIsDialogOpen(false);
        setSelectedIntegration(null);
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Courier Settings</h2>
                <p className="text-muted-foreground">
                    Manage your shipping and courier service integrations for each business.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Set default values to be used across all courier dispatches.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="default-note">Default Office Note</Label>
                        <Textarea 
                            id="default-note" 
                            placeholder="e.g., Please call before delivery. Fragile item, handle with care." 
                        />
                        <p className="text-xs text-muted-foreground">
                            This note will be added to the office note field for new orders or when dispatching to a courier.
                        </p>
                    </div>
                    <Button>Save Settings</Button>
                </CardContent>
            </Card>

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

             <CourierIntegrationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                integration={selectedIntegration}
                businesses={businesses}
                courierServices={courierServices}
                onSave={handleSaveChanges}
            />
        </div>
    );
}
