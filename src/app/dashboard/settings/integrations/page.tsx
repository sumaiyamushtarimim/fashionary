
'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { businesses } from '@/lib/placeholder-data';

const WooLogo = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10">
        <title>WooCommerce</title>
        <path d="M4.352 16.204l-1.12 3.353L0 11.232l4.13-7.23L5.25 7.35l-2.06 3.882 1.162 5.023zm10.706-5.833L11.854.852 7.73 7.828l3.204 5.617 4.124-7.074zm-3.418 8.97l-3.203-5.616L4.31 18.27l4.128 5.728 3.203-5.616zm7.23-5.547l-1.162-5.023-2.06-3.88L20.75 4l-1.12-3.353-3.23 8.324 4.132 7.23 3.23-8.325zm-4.128 7.075l-4.123-5.728-4.128 5.728L12 24l4.13-5.728z"/>
    </svg>
);


export default function IntegrationsPage() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-semibold font-headline">Integrations</h1>
                <p className="text-muted-foreground">Sync product and order data with your favorite platforms.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Connect New WooCommerce Store
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Connect a WooCommerce Store</DialogTitle>
                        <DialogDescription>
                            Enter your WooCommerce store details to sync data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="store-name">Store Name</Label>
                            <Input id="store-name" placeholder="e.g., My Fashion Shop" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-url">Store URL</Label>
                            <Input id="store-url" type="url" placeholder="https://example.com" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="business">Select Business</Label>
                            <Select>
                                <SelectTrigger id="business">
                                    <SelectValue placeholder="Link to a business" />
                                </SelectTrigger>
                                <SelectContent>
                                    {businesses.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Link this store to a specific business in your system.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="consumer-key">Consumer Key</Label>
                            <Input id="consumer-key" placeholder="ck_xxxxxxxxxxxx" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="consumer-secret">Consumer Secret</Label>
                            <Input id="consumer-secret" type="password" placeholder="cs_xxxxxxxxxxxx" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Connect Store</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        <div className="grid gap-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <WooLogo />
              <div>
                  <CardTitle>Fashionary Main Store</CardTitle>
                  <CardDescription>
                    Business: <Badge variant="secondary">{businesses[0].name}</Badge>
                  </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Last sync: 5 minutes ago</p>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex justify-between items-center w-full">
                  <Button variant="outline">Sync Now</Button>
                  <Button variant="destructive">Disconnect</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
