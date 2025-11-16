
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ScanLine,
  X,
  Undo2,
  Redo2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronsRight,
  MoreVertical,
  Printer,
  Download,
  Truck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { validateScannedOrder, getStatuses } from '@/services/orders';
import type { OrderStatus, ScannedItem } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

type ScanResult = 'success' | 'duplicate' | 'error' | 'idle';

type ScanState = {
  history: ScannedItem[][];
  currentIndex: number;
};

type ScanAction =
  | { type: 'ADD_ITEM'; item: ScannedItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const scanReducer = (state: ScanState, action: ScanAction): ScanState => {
  const currentItems = state.history[state.currentIndex];

  switch (action.type) {
    case 'ADD_ITEM': {
      if (currentItems.some((i) => i.id === action.item.id)) {
        return state; // Do not add duplicates
      }
      const newItems = [action.item, ...currentItems];
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        newItems,
      ];
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = currentItems.filter((i) => i.id !== action.id);
       const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        newItems,
      ];
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    }
    case 'CLEAR_ALL': {
        const newHistory = [
            ...state.history.slice(0, state.currentIndex + 1),
            [],
        ];
        return {
            history: newHistory,
            currentIndex: newHistory.length - 1,
        }
    }
    case 'UNDO': {
        if (state.currentIndex > 0) {
            return { ...state, currentIndex: state.currentIndex - 1 };
        }
        return state;
    }
    case 'REDO': {
        if (state.currentIndex < state.history.length - 1) {
            return { ...state, currentIndex: state.currentIndex + 1 };
        }
        return state;
    }
    default:
      return state;
  }
};

const getStatusColor = (status: ScanResult) => {
  switch (status) {
    case 'success':
      return 'border-green-500 focus:ring-green-500';
    case 'duplicate':
      return 'border-yellow-500 focus:ring-yellow-500';
    case 'error':
      return 'border-red-500 focus:ring-red-500 animate-shake';
    default:
      return 'border-input';
  }
};


export default function ScanOrdersPage() {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [allStatuses, setAllStatuses] = React.useState<OrderStatus[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const [scanStatus, setScanStatus] = React.useState<ScanResult>('idle');
  const [selectedAction, setSelectedAction] = React.useState<string | undefined>();

  const [state, dispatch] = React.useReducer(scanReducer, {
    history: [[]],
    currentIndex: 0,
  });

  const items = state.history[state.currentIndex];
  
  const undo = React.useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = React.useCallback(() => dispatch({ type: 'REDO' }), []);

    React.useEffect(() => {
        getStatuses().then(setAllStatuses);
    }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z')) ) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);


  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (code: string) => {
    if (!code) return;

    if (items.some((item) => item.id === code)) {
      setScanStatus('duplicate');
      toast({ title: 'Already Scanned', description: `Order ${code} is already in the list.` });
      setTimeout(() => setScanStatus('idle'), 500);
      return;
    }

    const result = await validateScannedOrder(code);

    if (result.status === 'ok' && result.order) {
      setScanStatus('success');
      dispatch({
        type: 'ADD_ITEM',
        item: { ...result.order, scannedAt: new Date() },
      });
    } else {
      setScanStatus('error');
      toast({
        variant: 'destructive',
        title: 'Scan Error',
        description: result.reason || 'Invalid order code.',
      });
    }

    setTimeout(() => setScanStatus('idle'), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleScan(inputValue);
      setInputValue('');
    }
  };
  
  const handleRemoveItem = (id: string) => {
      dispatch({ type: 'REMOVE_ITEM', id });
  }
  
  const handleApplyAction = () => {
    if (!selectedAction || items.length === 0) return;
    console.log(`Applying action "${selectedAction}" to ${items.length} orders.`);
    toast({
        title: `Action Applied: ${selectedAction}`,
        description: `Successfully applied action to ${items.length} orders.`,
    });
    dispatch({ type: 'CLEAR_ALL' });
    setSelectedAction(undefined);
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                  <Link href="/dashboard/orders">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Orders</span>
                  </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl">
                    All-in-One Scan Mode
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={undo} disabled={state.currentIndex === 0}>
                    <Undo2 className="mr-2 h-4 w-4"/> Undo
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} disabled={state.currentIndex >= state.history.length - 1}>
                    <Redo2 className="mr-2 h-4 w-4"/> Redo
                </Button>
            </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex justify-center">
            <div className="w-full max-w-lg space-y-4">
                <div className="relative">
                    <ScanLine className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Scan barcode or enter Order ID..."
                        className={cn(
                            'h-12 text-lg pl-10 pr-4 w-full transition-all duration-300',
                            getStatusColor(scanStatus)
                        )}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => inputRef.current?.focus()}
                    />
                </div>
            </div>
        </div>

        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 overflow-y-auto">
            {items.length > 0 ? (
              <ul className="divide-y">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3 gap-4"
                  >
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-muted-foreground w-6 text-center">{items.length - index}</span>
                        <div className="h-4 w-px bg-border" />
                        <div>
                            <Link href={`/dashboard/orders/${item.id}`} target="_blank" className="font-semibold hover:underline">
                                {item.id}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                                Status: {item.currentStatus} • Scanned {formatDistanceToNow(item.scannedAt, { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveItem(item.id)}>
                        <X className="h-4 w-4 text-muted-foreground"/>
                     </Button>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <ChevronsRight className="w-16 h-16 mb-4" />
                    <h3 className="text-lg font-semibold">Start Scanning</h3>
                    <p className="text-sm">Scanned orders will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </main>

        <footer className="sticky bottom-0 z-10 border-t bg-background p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
                 <div className="text-sm font-medium">
                    <span className="text-muted-foreground">Scanned Items:</span>
                    <span className="ml-2 font-bold text-lg">{items.length}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex-1 sm:flex-initial">
                                {selectedAction ? `Action: ${selectedAction}` : 'Select Bulk Action'}
                                <MoreVertical className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                             <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        {allStatuses.map(status => (
                                            <DropdownMenuItem key={status} onSelect={() => setSelectedAction(`Mark as ${status}`)}>
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem onSelect={() => setSelectedAction('Print Invoices')}>
                                <Printer className="mr-2 h-4 w-4"/>
                                Print Invoices
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => setSelectedAction('Print Stickers')}>
                                <Printer className="mr-2 h-4 w-4"/>
                                Print Stickers
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => setSelectedAction('Export CSV')}>
                                <Download className="mr-2 h-4 w-4"/>
                                Export CSV
                            </DropdownMenuItem>
                             <DropdownMenuItem onSelect={() => setSelectedAction('Send to Courier')}>
                                <Truck className="mr-2 h-4 w-4"/>
                                Send to Courier
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                        onClick={handleApplyAction}
                        disabled={!selectedAction || items.length === 0}
                        className="flex-1 sm:flex-initial"
                    >
                        Apply Action
                    </Button>
                </div>
            </div>
        </footer>
        <style jsx global>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }
        `}</style>
    </div>
  );
}
