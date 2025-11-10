import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold font-headline">Settings</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect your other services to Fashionary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage your integrations.</p>
          </CardContent>
          <CardContent>
            <Link href="/dashboard/settings/integrations" className="text-primary hover:underline">
              Go to Integrations
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
