
'use client';

// This is a special layout for printing purposes to provide a clean, headerless canvas.

export default function PrintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <style>{`
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}</style>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
