
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

  const handlePreset = (preset: 'today' | 'yesterday' | 'last7' | 'last30' | 'last365') => {
    const now = new Date();
    switch (preset) {
        case 'today':
            onDateChange({ from: startOfDay(now), to: endOfDay(now) });
            break;
        case 'yesterday':
            const yesterday = subDays(now, 1);
            onDateChange({ from: startOfDay(yesterday), to: endOfDay(yesterday) });
            break;
        case 'last7':
            onDateChange({ from: subDays(now, 6), to: now });
            break;
        case 'last30':
            onDateChange({ from: subDays(now, 29), to: now });
            break;
        case 'last365':
            onDateChange({ from: subDays(now, 364), to: now });
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
              "w-[300px] justify-start text-left font-normal",
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
        <PopoverContent className="flex w-auto flex-col space-y-2 p-2 sm:flex-row sm:space-x-2 sm:space-y-0" align="start">
            <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start" onClick={() => handlePreset('today')}>Today</Button>
                <Button variant="ghost" className="justify-start" onClick={() => handlePreset('yesterday')}>Yesterday</Button>
                <Button variant="ghost" className="justify-start" onClick={() => handlePreset('last7')}>Last 7 days</Button>
                <Button variant="ghost" className="justify-start" onClick={() => handlePreset('last30')}>Last 30 days</Button>
                <Button variant="ghost" className="justify-start" onClick={() => handlePreset('last365')}>Last 365 days</Button>
            </div>
            <div className="rounded-md border">
              <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={onDateChange}
                  numberOfMonths={2}
              />
            </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
