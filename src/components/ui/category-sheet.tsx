
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getCategories } from '@/services/products';
import type { Category } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


function CategoryNav({ categories, selectedCategory, onSelectCategory }: { categories: Category[], selectedCategory: string | null, onSelectCategory: (id: string | null) => void }) {
    const mainCategories = categories.filter(c => !c.parentId);
    const subCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

    const getParentId = (childId: string | null): string | null => {
        if (!childId) return null;
        const category = categories.find(c => c.id === childId);
        return category?.parentId || null;
    };
    
    const parentOfSelected = getParentId(selectedCategory);

    return (
        <nav className="flex flex-col gap-2 p-4">
            <Button
                variant={!selectedCategory ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => onSelectCategory(null)}
            >
                All Products
            </Button>
            <Accordion type="single" collapsible defaultValue={parentOfSelected || undefined}>
                {mainCategories.map(cat => {
                    const children = subCategories(cat.id);
                    const isParentSelected = selectedCategory === cat.id;
                    const isChildSelected = children.some(child => child.id === selectedCategory);

                    if (children.length === 0) {
                        return (
                             <Button
                                key={cat.id}
                                variant={isParentSelected ? 'secondary' : 'ghost'}
                                className="justify-start w-full"
                                onClick={() => onSelectCategory(cat.id)}
                            >
                                {cat.name}
                            </Button>
                        )
                    }
                    return (
                        <AccordionItem value={cat.id} key={cat.id} className="border-b-0">
                            <div className={cn(
                                "flex items-center justify-between rounded-md hover:bg-muted",
                                (isParentSelected || isChildSelected) && 'bg-secondary'
                            )}>
                                <AccordionTrigger 
                                    className="py-2 px-3 text-sm font-medium hover:no-underline flex-1"
                                >
                                    <span onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectCategory(cat.id);
                                    }} className="hover:underline">
                                        {cat.name}
                                    </span>
                                </AccordionTrigger>
                            </div>
                            <AccordionContent className="pt-2 pl-4">
                                <div className="flex flex-col gap-1">
                                {children.map(subCat => (
                                    <Button
                                        key={subCat.id}
                                        variant={selectedCategory === subCat.id ? 'secondary' : 'ghost'}
                                        className="justify-start w-full text-muted-foreground hover:text-foreground h-9"
                                        onClick={() => onSelectCategory(subCat.id)}
                                    >
                                        {subCat.name}
                                    </Button>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </nav>
    );
}

export function CategorySheet() {
    const [open, setOpen] = React.useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const selectedCategoryId = searchParams.get('category');

     React.useEffect(() => {
        setIsLoading(true);
        getCategories().then(categoryData => {
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
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 sm:mr-4">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-xl">Categories</SheetTitle>
                </SheetHeader>
                 {isLoading ? (
                    <div className="space-y-2 p-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                    </div>
                ) : (
                    <CategoryNav categories={categories} selectedCategory={selectedCategoryId} onSelectCategory={handleSelectCategory} />
                )}
            </SheetContent>
        </Sheet>
    );
}
