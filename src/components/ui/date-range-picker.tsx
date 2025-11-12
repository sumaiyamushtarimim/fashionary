
"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format, startOfMonth, startOfToday, subDays, startOfYear, endOfYear, subYears } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
    
  const handlePresetChange = (value: string) => {
    const now = new Date();
    switch (value) {
        case 'today':
            onDateChange({ from: startOfToday(), to: startOfToday() });
            break;
        case 'yesterday':
            const yesterday = subDays(now, 1);
            onDateChange({ from: yesterday, to: yesterday });
            break;
        case 'last7':
            onDateChange({ from: subDays(now, 6), to: now });
            break;
        case 'last30':
            onDateChange({ from: subDays(now, 29), to: now });
            break;
        case 'lastYear':
            const lastYear = subYears(now, 1);
            onDateChange({ from: startOfYear(lastYear), to: endOfYear(lastYear) });
            break;
        default:
            onDateChange(undefined);
            break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
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
        <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row" align="start">
          <div className="flex flex-col space-y-2 border-r border-border p-4">
              <Button variant="ghost" className="justify-start" onClick={() => handlePresetChange('today')}>Today</Button>
              <Button variant="ghost" className="justify-start" onClick={() => handlePresetChange('yesterday')}>Yesterday</Button>
              <Button variant="ghost" className="justify-start" onClick={() => handlePresetChange('last7')}>Last 7 days</Button>
              <Button variant="ghost" className="justify-start" onClick={() => handlePresetChange('last30')}>Last 30 days</Button>
              <Button variant="ghost" className="justify-start" onClick={() => handlePresetChange('lastYear')}>Last Year</Button>
          </div>
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
    </div>
  )
}
