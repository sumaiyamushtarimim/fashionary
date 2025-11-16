
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import { getProducts, getCategories } from '@/services/products';
import type { Product, Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/shop/products/${product.id}`} className="group">
            <Card className="overflow-hidden h-full">
                <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                        <Image
                            src={product.image.imageUrl}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={product.image.imageHint}
                        />
                    </div>
                    <div className="p-4 border-t">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{product.description.substring(0, 50)}...</p>
                        <p className="font-bold text-lg mt-2">৳{product.price.toFixed(2)}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function ShopPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const selectedCategoryId = searchParams.get('category');

    React.useEffect(() => {
        setIsLoading(true);
        Promise.all([getProducts(), getCategories()]).then(([productData, categoryData]) => {
            setProducts(productData);
            setCategories(categoryData);
            setIsLoading(false);
        });
    }, []);

    const filteredProducts = React.useMemo(() => {
        if (!selectedCategoryId) {
            return products;
        }
        let currentCategory = categories.find(c => c.id === selectedCategoryId);
        if (currentCategory && !currentCategory.parentId) {
             const childCategoryIds = categories.filter(c => c.parentId === selectedCategoryId).map(c => c.id);
             const allIds = [selectedCategoryId, ...childCategoryIds];
             return products.filter(p => p.categoryId && allIds.includes(p.categoryId));
        }
        return products.filter(p => p.categoryId === selectedCategoryId);
    }, [products, categories, selectedCategoryId]);

    return (
        <div className="container py-8">
            <main>
                <h1 className="text-3xl font-bold mb-6">Our Products</h1>
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="aspect-square w-full" />
                                <CardContent className="p-4 space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-6 w-1/3 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
