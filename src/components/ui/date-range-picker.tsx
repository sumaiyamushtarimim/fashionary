
"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format, subDays } from "date-fns"
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

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  
  const [selectedPreset, setSelectedPreset] = React.useState<string>(date ? "custom" : "");
    
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const now = new Date();
    if (value === "last365") {
        onDateChange({ from: subDays(now, 364), to: now });
    } else if (value === "custom") {
        // We let the calendar handle this, but you might want to default to something
        if (!date) { // If no date is set, maybe default to last 30 days
             onDateChange({ from: subDays(now, 29), to: now });
        }
    } else {
        onDateChange(undefined);
    }
  };

  React.useEffect(() => {
    // If an external change clears the date, reset the preset selector
    if (!date) {
        setSelectedPreset("");
    }
  }, [date]);

  return (
    <div className={cn("grid gap-2 sm:flex sm:items-center", className)}>
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="last365">Last 365 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
        </Select>
      
      {selectedPreset === 'custom' && (
        <Popover>
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-full sm:w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                date.to ? (
                    <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                    </>
                ) : (
                    format(date.from, "LLL dd, y")
                )
                ) : (
                <span>Pick a date</span>
                )}
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={2}
            />
            </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
