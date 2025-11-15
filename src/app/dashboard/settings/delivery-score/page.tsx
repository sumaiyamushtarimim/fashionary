'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const settingsSchema = z.object({
    apiKey: z.string().min(1, "API Key is required."),
});

export default function DeliveryScoreSettingsPage() {
    const { toast } = useToast();
    const [isReportPageEnabled, setIsReportPageEnabled] = useState(true);

    const settingsForm = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            apiKey: "example_api_key", // Replace with a call to get the saved key
        },
    });

    function onSettingsSubmit(values: z.infer<typeof settingsSchema>) {
        console.log("Saving Courier Search API Key:", values);
        toast({
            title: "Settings Saved",
            description: "Your Hoorin Courier Search API Key has been saved.",
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Delivery Score Settings</h2>
                <p className="text-muted-foreground">
                    Configure the API key for the Hoorin Courier Search service and manage related features.
                </p>
            </div>
            <Card>
                <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
                        <CardHeader>
                            <CardTitle>API Configuration</CardTitle>
                            <CardDescription>
                                Enter your API key from the Hoorin Dash portal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={settingsForm.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••••••••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardContent>
                            <Button type="submit">Save API Key</Button>
                        </CardContent>
                    </form>
                </Form>
            </Card>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Feature Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="enable-report-page" className="text-base">
                                Enable Courier Report Page
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Adds a dedicated page to search for courier reports by phone number.
                            </p>
                        </div>
                        <Switch
                            id="enable-report-page"
                            checked={isReportPageEnabled}
                            onCheckedChange={setIsReportPageEnabled}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
