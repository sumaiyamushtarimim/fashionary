
'use client';

import { Facebook, MessageSquare, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const integrations = [
    {
        name: 'Facebook Pages',
        description: 'Connect your Facebook pages to manage comments and messages.',
        icon: Facebook,
        connected: true,
    },
    {
        name: 'Messenger',
        description: 'Enable Messenger for direct customer communication.',
        icon: MessageSquare,
        connected: false,
    },
    {
        name: 'Genkit AI',
        description: 'Power your responses with Generative AI.',
        icon: Bot,
        connected: true,
    },
];

export default function IntegrationsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
                <p className="text-muted-foreground">
                    Connect third-party services to enhance your workflow.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Available Integrations</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border">
                    {integrations.map((integration) => (
                        <div key={integration.name} className="flex items-center justify-between py-4">
                            <div className="flex items-start gap-4">
                                <integration.icon className="h-6 w-6 text-muted-foreground mt-1" />
                                <div>
                                    <p className="font-medium">{integration.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {integration.description}
                                    </p>
                                </div>
                            </div>
                            {integration.connected ? (
                                <Button variant="secondary">Manage</Button>
                            ) : (
                                <Button>Connect</Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
