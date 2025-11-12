
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

const smsGateways = [
    {
        id: 'twilio',
        name: 'Twilio',
        fields: ['Account SID', 'Auth Token', 'From Number']
    },
    {
        id: 'vonage',
        name: 'Vonage (Nexmo)',
        fields: ['API Key', 'API Secret']
    },
    {
        id: 'infobip',
        name: 'Infobip',
        fields: ['Base URL', 'API Key']
    },
    {
        id: 'ssl_wireless',
        name: 'SSL Wireless',
        fields: ['API Token', 'SID', 'Domain']
    }
];

export default function SmsGatewayPage() {
    const [selectedGateway, setSelectedGateway] = React.useState('twilio');

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: `Your SMS gateway settings have been updated.`,
        });
    };

    const currentGateway = smsGateways.find(g => g.id === selectedGateway);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold font-headline">SMS Gateway</h1>
                <p className="text-muted-foreground">Configure your SMS provider to send notifications and OTPs.</p>
                <div className="grid gap-6 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SMS Provider</CardTitle>
                            <CardDescription>Select and configure your preferred SMS gateway.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="gateway-provider">Gateway Provider</Label>
                                <Select value={selectedGateway} onValueChange={setSelectedGateway}>
                                    <SelectTrigger id="gateway-provider">
                                        <SelectValue placeholder="Select a provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {smsGateways.map((gateway) => (
                                            <SelectItem key={gateway.id} value={gateway.id}>{gateway.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {currentGateway && (
                                <div className="space-y-4 pt-4 border-t">
                                    {currentGateway.fields.map(field => (
                                        <div key={field} className="space-y-2">
                                            <Label htmlFor={`${currentGateway.id}-${field.toLowerCase().replace(/\s+/g, '-')}`}>{field}</Label>
                                            <Input id={`${currentGateway.id}-${field.toLowerCase().replace(/\s+/g, '-')}`} placeholder={`Enter your ${field}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button onClick={handleSave}>Save</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
