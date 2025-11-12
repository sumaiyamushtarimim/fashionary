
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function SmsGatewaySettingsPage() {
    return (
        <form className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">SMS Gateway Settings</h2>
                <p className="text-muted-foreground">
                    Configure your provider to send SMS notifications.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>SMS Provider</CardTitle>
                    <CardDescription>
                        Select and configure your SMS gateway provider.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="sms-provider">Provider</Label>
                        <Select defaultValue="twilio">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="twilio">Twilio</SelectItem>
                                <SelectItem value="vonage">Vonage</SelectItem>
                                <SelectItem value="ssl_wireless">SSL Wireless</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="account-sid">Account SID</Label>
                        <Input id="account-sid" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="auth-token">Auth Token</Label>
                        <Input id="auth-token" type="password" placeholder="••••••••••••••••••••" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="from-number">From Number</Label>
                        <Input id="from-number" placeholder="+15017122661" />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>Save Configuration</Button>
            </div>
        </form>
    );
}
