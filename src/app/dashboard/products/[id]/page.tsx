'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Edit,
  Star,
  CheckCircle,
  XCircle,
  Tag,
  Warehouse,
  Package,
} from 'lucide-react';

import {
  products as allProducts,
  categories as allCategories,
  Product,
} from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const product: Product | undefined = React.useMemo(
    () => allProducts.find((p) => p.id === productId),
    [productId]
  );

  const category = React.useMemo(() => {
    if (!product?.categoryId) return null;
    return allCategories.find((c) => c.id === product.categoryId);
  }, [product]);

  const stockStatus = (quantity: number) => {
    if (quantity > 10) return { text: 'In Stock', icon: CheckCircle, color: 'text-green-600' };
    if (quantity > 0) return { text: 'Low Stock', icon: XCircle, color: 'text-yellow-600' };
    return { text: 'Out of Stock', icon: XCircle, color: 'text-red-600' };
  };

  const mainImage = product?.image || PlaceHolderImages[0];
  // Using other placeholder images as gallery images for demo purposes
  const galleryImages = [
      PlaceHolderImages[1],
      PlaceHolderImages[2],
      PlaceHolderImages[3],
      PlaceHolderImages[4],
  ];

  const [activeImage, setActiveImage] = React.useState(mainImage);
  
  React.useEffect(() => {
    if (product) {
        setActiveImage(product.image);
    }
  }, [product]);


  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
        <p>Product not found.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const currentStockStatus = stockStatus(product.inventory);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-xl font-semibold sm:text-2xl">
            {product.name}
          </h1>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/dashboard/products/${productId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </Button>
      </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl mx-auto">
            <div className="grid gap-4 md:gap-8">
                <div className="grid gap-4">
                    <Image
                    src={activeImage.imageUrl}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
                    />
                    <div className="grid grid-cols-5 gap-4">
                        {[mainImage, ...galleryImages.slice(0, 4)].map((image, index) => (
                            <button
                            key={image.id + '-' + index}
                            className={cn(
                                "border rounded-lg overflow-hidden aspect-square",
                                activeImage.id === image.id ? "ring-2 ring-primary" : ""
                            )}
                            onClick={() => setActiveImage(image)}
                            >
                            <Image
                                src={image.imageUrl}
                                alt={`Thumbnail ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{product.name}</CardTitle>
                        <CardDescription>
                             <div className="flex items-center gap-2 mt-2">
                                <currentStockStatus.icon className={cn("h-4 w-4", currentStockStatus.color)} />
                                <span className={cn("font-medium", currentStockStatus.color)}>{currentStockStatus.text}</span>
                                <span className="text-muted-foreground">({product.inventory} units available)</span>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">৳{product.price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">৳{(product.price * 1.2).toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                        {category && (
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-muted-foreground">Category:</span>
                                <Badge variant="outline">{category.name}</Badge>
                            </div>
                        )}
                         <div className="flex items-center gap-2">
                            <span className="font-semibold text-muted-foreground">Tags:</span>
                            <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary">Cotton</Badge>
                                <Badge variant="secondary">Eco-Friendly</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>

        {product.variants && product.variants.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5"/> Variants & Inventory</CardTitle>
                    <CardDescription>
                        Stock levels for each product variant.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {product.variants.map((variant) => {
                            const variantStock = Math.floor(Math.random() * 50);
                            const variantStockStatus = stockStatus(variantStock);
                           return (
                             <TableRow key={variant.id}>
                                <TableCell className="font-medium">{variant.name}</TableCell>
                                <TableCell>{variant.sku}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                         <span className={variantStockStatus.color}>{variantStock}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">৳{product.price.toFixed(2)}</TableCell>
                            </TableRow>
                           )
                        })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
