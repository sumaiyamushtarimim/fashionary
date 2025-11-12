
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function GeneralSettingsPage() {
    return (
        <form className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
                <p className="text-muted-foreground">
                    Manage your basic store information and preferences.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Store Details</CardTitle>
                    <CardDescription>
                        Update your business name, contact, and address.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input id="store-name" defaultValue="Fashionary" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="store-address">Store Address</Label>
                        <Input id="store-address" defaultValue="123 Fashion Ave, Dhaka, Bangladesh" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Localization</CardTitle>
                    <CardDescription>
                        Set your store's currency and timezone.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="BDT">
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BDT">Bangladeshi Taka (BDT)</SelectItem>
                                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="Asia/Dhaka">
                            <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asia/Dhaka">(GMT+6) Dhaka</SelectItem>
                                <SelectItem value="Etc/GMT-6">(GMT+6) Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Units of Measurement</CardTitle>
                    <CardDescription>
                        Define how units like weight and dimensions are displayed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="weight-unit">Weight Unit</Label>
                        <Select defaultValue="kg">
                            <SelectTrigger>
                                <SelectValue placeholder="Select weight unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                <SelectItem value="g">Gram (g)</SelectItem>
                                <SelectItem value="lb">Pound (lb)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dimension-unit">Dimension Unit</Label>
                        <Select defaultValue="cm">
                            <SelectTrigger>
                                <SelectValue placeholder="Select dimension unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cm">Centimeter (cm)</SelectItem>
                                <SelectItem value="m">Meter (m)</SelectItem>
                                <SelectItem value="in">Inch (in)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </form>
    );
}
