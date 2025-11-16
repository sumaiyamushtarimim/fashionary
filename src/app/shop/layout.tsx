import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
                <div className="container flex h-16 items-center justify-center sm:justify-start">
                    <div className="flex gap-6 md:gap-10">
                        <Link href="/shop" className="flex items-center space-x-2">
                            <Logo />
                            <span className="inline-block font-bold font-headline text-xl">Fashionary</span>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
             <footer className="py-6 md:px-8 md:py-0 border-t">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by Fashionary. The source code is available on GitHub.
                    </p>
                </div>
            </footer>
        </div>
    );
}
