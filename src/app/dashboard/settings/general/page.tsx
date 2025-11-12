
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

export default function GeneralSettingsPage() {

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="mx-auto grid w-full max-w-6xl gap-6">
                <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold">General Settings</h1>
                    <p className="text-muted-foreground">Manage your store details, localization, and units of measurement.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Store Details</CardTitle>
                        <CardDescription>Update your store's information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="store-name">Store Name</Label>
                                <Input id="store-name" defaultValue="Fashionary" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="store-email">Contact Email</Label>
                                <Input id="store-email" type="email" defaultValue="contact@fashionary.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="store-address">Store Address</Label>
                            <Textarea id="store-address" defaultValue="123 Fashion Avenue, Dhaka, Bangladesh" />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button>Save</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Localization</CardTitle>
                        <CardDescription>Set your currency and timezone preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select defaultValue="BDT">
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BDT">Bangladeshi Taka (BDT)</SelectItem>
                                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="timezone">Timezone</Label>
                             <Select defaultValue="Asia/Dhaka">
                                <SelectTrigger id="timezone">
                                    <SelectValue placeholder="Select a timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Asia/Dhaka">(GMT+6:00) Dhaka</SelectItem>
                                    <SelectItem value="Etc/GMT-5">(GMT+5:00) Eastern Time (US & Canada)</SelectItem>
                                    <SelectItem value="Europe/London">(GMT+1:00) London</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4">
                        <Button>Save</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Units of Measurement</CardTitle>
                        <CardDescription>Set the default units for weight and dimensions.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="weight-unit">Weight unit</Label>
                            <Select defaultValue="kg">
                                <SelectTrigger id="weight-unit">
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                    <SelectItem value="g">Gram (g)</SelectItem>
                                    <SelectItem value="lbs">Pound (lbs)</SelectItem>
                                    <SelectItem value="oz">Ounce (oz)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="dimension-unit">Dimension unit</Label>
                             <Select defaultValue="cm">
                                <SelectTrigger id="dimension-unit">
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cm">Centimeter (cm)</SelectItem>
                                    <SelectItem value="m">Meter (m)</SelectItem>
                                    <SelectItem value="in">Inch (in)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4">
                        <Button>Save</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
