
'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';

export function UnauthorizedAccessModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    router.replace('/dashboard');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          <AlertDialogTitle className="text-center">Access Denied</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is an error.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button onClick={handleClose} className="w-full">
          Go to Dashboard
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
