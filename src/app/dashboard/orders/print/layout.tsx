
'use client';

// This is a special layout for printing purposes to provide a clean, headerless canvas.

export default function PrintLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This component is nested within the root layout, so we must not render another <html> or <body> tag.
    // We just return the children, and any specific print styles can be handled in the pages themselves or globally.
    return (
        <div className="print-layout">
             <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: auto;
                        margin: 0mm;
                    }
                }
            `}</style>
            {children}
        </div>
    );
}
