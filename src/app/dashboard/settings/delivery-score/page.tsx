
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

const settingsSchema = z.object({
    apiKey: z.string().min(1, "API Key is required."),
});

export default function DeliveryScoreSettingsPage() {
    const { toast } = useToast();

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
                    Configure the API key for the Hoorin Courier Search service.
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
        </div>
    );
}
