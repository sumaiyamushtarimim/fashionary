
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SmtpSettingsPage() {

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: `Your SMTP settings have been updated successfully.`,
        });
    };
    
    const handleTestEmail = () => {
         toast({
            title: "Sending Test Email",
            description: `An email has been sent to your account's address.`,
        });
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold font-headline">SMTP Settings</h1>
                <p className="text-muted-foreground">Configure your outgoing email server.</p>
                <div className="grid gap-6 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMTP Configuration</CardTitle>
                            <CardDescription>Enter the details of your SMTP server to send emails from the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">SMTP Host</Label>
                                    <Input id="smtp-host" placeholder="smtp.example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Input id="smtp-port" placeholder="587" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smtp-username">SMTP Username</Label>
                                <Input id="smtp-username" placeholder="your-username" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smtp-password">SMTP Password</Label>
                                <Input id="smtp-password" type="password" placeholder="••••••••••••" />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-encryption">Encryption</Label>
                                    <Select defaultValue="tls">
                                        <SelectTrigger id="smtp-encryption">
                                            <SelectValue placeholder="Select encryption" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="ssl">SSL</SelectItem>
                                            <SelectItem value="tls">TLS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="from-address">From Email Address</Label>
                                    <Input id="from-address" type="email" placeholder="no-reply@example.com" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4 flex justify-between">
                            <Button onClick={handleSave}>Save Settings</Button>
                            <Button variant="outline" onClick={handleTestEmail}>Send Test Email</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
