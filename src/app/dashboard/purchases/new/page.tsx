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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, Dot } from "lucide-react";

const steps = [
  { name: "Fabric Order", status: "current" },
  { name: "Printing", status: "upcoming" },
  { name: "Cutting", status: "upcoming" },
  { name: "Delivery & Finish", status: "upcoming" },
];

export default function NewPurchaseOrderPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold">
            Create New Purchase Order
          </h1>
          <p className="text-muted-foreground">
            Follow the steps to create a new production batch.
          </p>
        </div>
        <Button variant="outline">Save Draft</Button>
      </div>

      <nav aria-label="Progress">
        <ol
          role="list"
          className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
        >
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === "current" ? (
                <a href="#" className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-primary">
                      {step.name}
                    </span>
                  </span>
                </a>
              ) : step.status === "complete" ? (
                <a href="#" className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary group-hover:bg-primary/80">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </a>
              ) : (
                <a href="#" className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                      <Circle className="h-6 w-6 text-gray-500" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </span>
                </a>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0H22L0.5 80H0.5V0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Fabric Order Details</CardTitle>
                    <CardDescription>Select the product and specify fabric quantity and cost.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                         <div className="space-y-2">
                            <Label htmlFor="product">Select Product</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product to produce" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="prod1">Organic Cotton T-Shirt</SelectItem>
                                    <SelectItem value="prod2">Slim Fit Denim Jeans</SelectItem>
                                    <SelectItem value="prod3">Three-Piece Suit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="variants">Select Variants</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select variants" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="s">Small</SelectItem>
                                    <SelectItem value="m">Medium</SelectItem>
                                    <SelectItem value="l">Large</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                     <div className="space-y-4">
                        <Label className="font-medium">Fabric Requirements</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="orna-qty" className="text-sm font-normal">Orna (Qty)</Label>
                                <Input id="orna-qty" placeholder="e.g., 100" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jama-qty" className="text-sm font-normal">Jama (Qty)</Label>
                                <Input id="jama-qty" placeholder="e.g., 100" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="selowar-qty" className="text-sm font-normal">Selowar (Qty)</Label>
                                <Input id="selowar-qty" placeholder="e.g., 100" type="number" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="orna-cost" className="text-sm font-normal">Orna (Cost)</Label>
                                <Input id="orna-cost" placeholder="e.g., 5000" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jama-cost" className="text-sm font-normal">Jama (Cost)</Label>
                                <Input id="jama-cost" placeholder="e.g., 8000" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="selowar-cost" className="text-sm font-normal">Selowar (Cost)</Label>
                                <Input id="selowar-cost" placeholder="e.g., 6000" type="number" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>Assign vendors for this production batch.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplier">Fabric Supplier</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sup1">Global Textiles Inc.</SelectItem>
                                <SelectItem value="sup2">Denim Dreams Co.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="printing-vendor">Printing Vendor</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a printing vendor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ven1">Precision Prints</SelectItem>
                                <SelectItem value="ven2">Ink & Thread</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Payment for Fabric</CardTitle>
                    <CardDescription>Record the payment for the fabric.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" placeholder="Total fabric cost" type="number" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="check-date">Check Passing Date</Label>
                        <Input id="check-date" type="date" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Create Purchase & Proceed</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
