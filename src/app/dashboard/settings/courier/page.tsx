
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
import Image from 'next/image';

const courierServices = [
    {
        id: 'steadfast',
        name: 'Steadfast',
        logo: '/images/steadfast-logo.png', // Assuming you will add logos to public/images
        description: 'Integrate with Steadfast for nationwide delivery.',
        fields: ['API Key', 'Secret Key']
    },
    {
        id: 'pathao',
        name: 'Pathao',
        logo: '/images/pathao-logo.png',
        description: 'Connect with Pathao for fast and reliable courier services.',
        fields: ['API Key', 'Secret Key']
    }
];


export default function CourierIntegrationsPage() {
    const [isEnabled, setIsEnabled] = React.useState<Record<string, boolean>>({
        steadfast: true,
        pathao: false,
    });

    const handleSave = (courierName: string) => {
        toast({
            title: "Settings Saved",
            description: `Your ${courierName} API settings have been updated.`,
        });
    };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold font-headline">Courier Integrations</h1>
        <p className="text-muted-foreground">Manage API integrations for your courier services.</p>
        <div className="grid gap-6 mt-4">
            {courierServices.map((courier) => (
                <Card key={courier.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                           {/* <Image src={courier.logo} alt={`${courier.name} Logo`} width={48} height={48} className="rounded-md" /> */}
                           <div className='flex-1'>
                                <CardTitle>{courier.name}</CardTitle>
                                <CardDescription>{courier.description}</CardDescription>
                           </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`${courier.id}-enabled`}
                                    checked={isEnabled[courier.id]}
                                    onCheckedChange={(checked) => setIsEnabled(prev => ({...prev, [courier.id]: checked}))}
                                />
                                <Label htmlFor={`${courier.id}-enabled`}>{isEnabled[courier.id] ? 'Enabled' : 'Disabled'}</Label>
                            </div>
                        </div>
                    </CardHeader>
                    {isEnabled[courier.id] && (
                        <>
                            <CardContent className="space-y-4">
                                {courier.fields.map(field => (
                                    <div key={field} className="space-y-2">
                                        <Label htmlFor={`${courier.id}-${field.toLowerCase().replace(' ', '-')}`}>{field}</Label>
                                        <Input id={`${courier.id}-${field.toLowerCase().replace(' ', '-')}`} placeholder={`Enter your ${field}`} />
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button onClick={() => handleSave(courier.name)}>Save</Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
