
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

function CategoryNav({ categories, selectedCategory, onSelectCategory }: { categories: Category[], selectedCategory: string | null, onSelectCategory: (id: string | null) => void }) {
    const mainCategories = categories.filter(c => !c.parentId);
    const subCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

    return (
        <nav className="flex flex-col gap-1">
            <Button
                variant={!selectedCategory ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => onSelectCategory(null)}
            >
                All Products
            </Button>
            {mainCategories.map(cat => (
                <div key={cat.id}>
                    <Button
                        variant={selectedCategory === cat.id ? 'secondary' : 'ghost'}
                        className="justify-start w-full"
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        {cat.name}
                    </Button>
                    {subCategories(cat.id).length > 0 && (
                        <div className="pl-4 mt-1 space-y-1">
                            {subCategories(cat.id).map(subCat => (
                                <Button
                                    key={subCat.id}
                                    variant={selectedCategory === subCat.id ? 'secondary' : 'ghost'}
                                    className="justify-start w-full text-muted-foreground hover:text-foreground"
                                    onClick={() => onSelectCategory(subCat.id)}
                                >
                                    {subCat.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}

export default function ShopPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
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

    const handleSelectCategory = (categoryId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        router.push(`/shop?${params.toString()}`);
    };

    const filteredProducts = React.useMemo(() => {
        if (!selectedCategoryId) {
            return products;
        }
        return products.filter(p => p.categoryId === selectedCategoryId);
    }, [products, selectedCategoryId]);

    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <div className="sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Categories</h2>
                        {isLoading ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                            </div>
                        ) : (
                            <CategoryNav categories={categories} selectedCategory={selectedCategoryId} onSelectCategory={handleSelectCategory} />
                        )}
                    </div>
                </aside>
                <main className="md:col-span-3">
                    <h1 className="text-3xl font-bold mb-6">Our Products</h1>
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
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
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
    );
}