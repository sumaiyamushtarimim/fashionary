
'use client';

import { MoreHorizontal, PlusCircle, Store } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { getWooCommerceIntegrations } from '@/services/integrations';
import { getBusinesses } from '@/services/partners';
import type { WooCommerceIntegration, Business } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function WooCommerceIntegrationsPage() {
    const [integrations, setIntegrations] = React.useState<WooCommerceIntegration[]>([]);
    const [businesses, setBusinesses] = React.useState<Business[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        setIsLoading(true);
        Promise.all([
            getWooCommerceIntegrations(),
            getBusinesses()
        ]).then(([integrationsData, businessesData]) => {
            setIntegrations(integrationsData);
            setBusinesses(businessesData);
            setIsLoading(false);
        });
    }, []);

    const renderTable = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    [...Array(2)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                        </TableRow>
                    ))
                ) : integrations.length > 0 ? (
                    integrations.map((integration) => (
                        <TableRow key={integration.id}>
                            <TableCell className="font-medium">{integration.storeName}</TableCell>
                            <TableCell>{integration.businessName}</TableCell>
                            <TableCell className="text-muted-foreground">{integration.storeUrl}</TableCell>
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
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Sync Products</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                            No WooCommerce integrations found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

    const renderCardList = () => (
        <div className="space-y-4">
             {isLoading ? (
                [...Array(2)].map((_, i) => (
                    <Card key={i}><CardContent className="p-4"><Skeleton className="h-24 w-full" /></CardContent></Card>
                ))
            ) : integrations.length > 0 ? (
                integrations.map((integration) => (
                    <Card key={integration.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{integration.storeName}</p>
                                    <p className="text-sm text-muted-foreground">{integration.businessName}</p>
                                </div>
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
                                        <DropdownMenuItem>Sync Products</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{integration.storeUrl}</p>
                            <Separator className="my-3" />
                            <div className="flex items-center">
                                <Badge variant={integration.status === 'Active' ? 'default' : 'secondary'}>
                                    {integration.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                 <div className="text-center text-muted-foreground py-8">No WooCommerce integrations found.</div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">WooCommerce Integrations</h2>
                <p className="text-muted-foreground">
                    Connect and manage your WooCommerce stores.
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Your Stores</CardTitle>
                        <CardDescription>
                            A list of all connected WooCommerce stores.
                        </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Integration
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add WooCommerce Integration</DialogTitle>
                                <DialogDescription>
                                    Enter the details for your new WooCommerce store.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business">Business</Label>
                                    <Select>
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
                                    <Label htmlFor="store-name">Store Name</Label>
                                    <Input id="store-name" placeholder="My Awesome Store" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store-url">Store URL</Label>
                                    <Input id="store-url" placeholder="https://example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consumer-key">Consumer Key</Label>
                                    <Input id="consumer-key" placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxx" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consumer-secret">Consumer Secret</Label>
                                    <Input id="consumer-secret" type="password" placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxx" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={() => setIsDialogOpen(false)}>Save Integration</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                   {isClient ? (
                        <>
                            <div className="hidden sm:block">{renderTable()}</div>
                            <div className="sm:hidden">{renderCardList()}</div>
                        </>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">Loading integrations...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
