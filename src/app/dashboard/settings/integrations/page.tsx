
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
import { wooCommerceIntegrations, WooCommerceIntegration, businesses } from '@/lib/placeholder-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function WooCommerceIntegrationsPage() {
    const [integrations, setIntegrations] = React.useState(wooCommerceIntegrations);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

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
                            {integrations.map((integration) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
