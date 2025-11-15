
'use client';

import { Copy, MoreHorizontal, PlusCircle, RefreshCw } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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
    const { toast } = useToast();
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
    
    const handleCopy = (textToCopy: string, fieldName: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({
            title: "Copied to clipboard",
            description: `${fieldName} has been copied.`,
        });
    };

    const generateRandomString = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    

    const fields = selectedCourier ? courierFields[selectedCourier.id] : [];
    const authToken = `Bearer ${generateRandomString(32)}`;
    const callbackUrl = `https://your-domain.com/api/webhooks/steadfast/${generateRandomString(12)}`;

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

                        {selectedCourier?.id === 'steadfast' && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Authorization Token (Bearer)</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Use this token in your Steadfast webhook settings for secure communication.
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <Input value={authToken} readOnly />
                                        <Button type="button" size="sm" variant="outline"><RefreshCw className="h-4 w-4" /></Button>
                                        <Button type="button" size="sm" onClick={() => handleCopy(authToken, 'Auth Token')}>
                                            <Copy className="h-4 w-4" />
                                            <span className="sr-only">Copy</span>
                                        </Button>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label>Callback URL</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Paste this URL into your Steadfast dashboard to receive automatic status updates.
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <Input value={callbackUrl} readOnly />
                                        <Button type="button" size="sm" variant="outline"><RefreshCw className="h-4 w-4" /></Button>
                                        <Button type="button" size="sm" onClick={() => handleCopy(callbackUrl, 'Callback URL')}>
                                            <Copy className="h-4 w-4" />
                                            <span className="sr-only">Copy</span>
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
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
