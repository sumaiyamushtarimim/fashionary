
"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
    className?: string;
}

type Preset = "today" | "yesterday" | "last7" | "last30" | "last365" | "custom";

const presetDisplay: Record<Preset, string> = {
    today: "Today",
    yesterday: "Yesterday",
    last7: "Last 7 days",
    last30: "Last 30 days",
    last365: "Last 365 days",
    custom: "Custom Range",
};


export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {

  const [preset, setPreset] = React.useState<Preset>("custom");
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const handlePresetChange = (selectedPreset: Preset) => {
    setPreset(selectedPreset);
    if (selectedPreset === 'custom') {
        setIsPopoverOpen(true);
        return;
    }

    const now = new Date();
    let newRange: DateRange | undefined;

    switch (selectedPreset) {
        case 'today':
            newRange = { from: startOfDay(now), to: endOfDay(now) };
            break;
        case 'yesterday':
            const yesterday = subDays(now, 1);
            newRange = { from: startOfDay(yesterday), to: endOfDay(yesterday) };
            break;
        case 'last7':
            newRange = { from: subDays(now, 6), to: now };
            break;
        case 'last30':
            newRange = { from: subDays(now, 29), to: now };
            break;
        case 'last365':
            newRange = { from: subDays(now, 364), to: now };
            break;
    }
    onDateChange(newRange);
  };
  
  React.useEffect(() => {
    // If a date range is programmatically set that doesn't match a preset,
    // default to showing "Custom Range".
    // This handles the initial state. A more complex logic might be needed
    // to match incoming date ranges to presets.
    if (date) {
        setPreset("custom");
    }
  }, [date]);


  const displayValue = () => {
    if (preset !== 'custom' && preset) {
        return presetDisplay[preset];
    }
    if (date?.from) {
      if (date.to) {
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
      }
      return format(date.from, "LLL dd, y");
    }
    return "Select a date range";
  };
  

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
        <Select value={preset} onValueChange={(value: Preset) => handlePresetChange(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last365">Last 365 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
        </Select>
      <Popover open={isPopoverOpen && preset === 'custom'} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
               preset !== 'custom' && "hidden"
            )}
            onClick={() => setIsPopoverOpen(true)}
            disabled={preset !== 'custom'}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue()}
          </Button>
        </PopoverTrigger>
         <div className={cn("pl-1 text-sm font-medium text-muted-foreground self-center", preset === 'custom' && "hidden")}>
           {displayValue()}
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => {
                onDateChange(range);
                if (range?.from && range.to) {
                    setIsPopoverOpen(false);
                }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
