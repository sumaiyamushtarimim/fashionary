import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CategorySheet } from "@/components/ui/category-sheet";
import { CopyLinkButton } from "@/components/ui/copy-link-button";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-2">
                        <CategorySheet />
                    </div>
                    
                    <div className="flex flex-1 items-center justify-center">
                        <Link href="/shop" className="flex items-center gap-2">
                            <Logo />
                            <span className="hidden sm:inline-block font-bold font-headline text-xl">Fashionary</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <CopyLinkButton />
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
             <footer className="py-6 md:px-8 md:py-0 border-t">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 sm:px-8">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by Fashionary. The source code is available on GitHub.
                    </p>
                </div>
            </footer>
        </div>
    );
}
