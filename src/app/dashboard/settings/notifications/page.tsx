
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { allStatuses } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { purchaseOrders } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import type { PurchaseOrderStatus } from '@/types';


const orderVariables = [
    { name: 'Customer Name', value: '{{customerName}}' },
    { name: 'Order ID', value: '{{orderId}}' },
    { name: 'Order Total', value: '{{orderTotal}}' },
    { name: 'Order Date', value: '{{orderDate}}' },
    { name: 'Shipping Address', value: '{{shippingAddress}}' },
];

const purchaseVariables = [
    { name: 'PO Number', value: '{{poNumber}}' },
    { name: 'Supplier Name', value: '{{supplierName}}' },
    { name: 'Vendor Name', value: '{{vendorName}}' },
    { name: 'PO Total', value: '{{poTotal}}' },
    { name: 'PO Date', value: '{{poDate}}' },
];

const staffVariables = [
    { name: 'Staff Name', value: '{{staffName}}' },
    { name: 'Payment Amount', value: '{{paymentAmount}}' },
    { name: 'Payment Date', value: '{{paymentDate}}' },
    { name: 'Due Amount', value: '{{dueAmount}}' },
];

const purchaseStatuses: PurchaseOrderStatus[] = ['Fabric Ordered', 'Printing', 'Cutting', 'Received'];

function NotificationTemplateEditor({ title, variables }: { title: string, variables: {name: string; value: string}[] }) {
    return (
        <AccordionContent>
            <div className="grid gap-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label>Enable Notifications</Label>
                        <p className="text-xs text-muted-foreground">Turn on/off SMS and Email for this status.</p>
                    </div>
                    <Switch />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`sms-${title}`}>SMS Template</Label>
                    <Textarea id={`sms-${title}`} placeholder={`Your order {{orderId}} is now ${title}.`} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor={`email-${title}`}>Email Template</Label>
                    <Textarea id={`email-${title}`} placeholder={`Hi {{customerName}}, Your order {{orderId}} has been updated to ${title}.`} rows={5} />
                </div>
                <div>
                    <p className="text-sm font-medium">Available Variables</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {variables.map(v => <Badge key={v.value} variant="secondary" className="font-mono">{v.value}</Badge>)}
                    </div>
                </div>
                <Button size="sm" className="ml-auto">Save Template</Button>
            </div>
        </AccordionContent>
    );
}

export default function NotificationsSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Notification Settings</h2>
                <p className="text-muted-foreground">
                    Customize SMS and Email templates for various events.
                </p>
            </div>

            <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="orders">Order Status</TabsTrigger>
                    <TabsTrigger value="purchases">Purchases</TabsTrigger>
                    <TabsTrigger value="staff">Staff Payments</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Order Notifications</CardTitle>
                            <CardDescription>
                                Set templates for automated messages sent to customers when their order status changes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {allStatuses.map((status) => (
                                    <AccordionItem value={status} key={status}>
                                        <AccordionTrigger>{status}</AccordionTrigger>
                                        <NotificationTemplateEditor title={status} variables={orderVariables} />
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="purchases">
                     <Card>
                        <CardHeader>
                            <CardTitle>Purchase Order Notifications</CardTitle>
                            <CardDescription>
                                Set templates for automated messages sent to suppliers or vendors for PO updates.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full">
                                {purchaseStatuses.map((status) => (
                                    <AccordionItem value={status} key={status}>
                                        <AccordionTrigger>{status}</AccordionTrigger>
                                        <NotificationTemplateEditor title={status} variables={purchaseVariables} />
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="staff">
                     <Card>
                        <CardHeader>
                            <CardTitle>Staff Payment Notifications</CardTitle>
                            <CardDescription>
                                Set templates for messages sent to staff members upon payment.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="payment-cleared">
                                    <AccordionTrigger>Payment Cleared</AccordionTrigger>
                                    <NotificationTemplateEditor title="Payment Cleared" variables={staffVariables} />
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
