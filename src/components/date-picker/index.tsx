"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATEFORMAT_YYYYMMDD_KOR } from "@/utils/const";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { useEffect } from "react";
const DatePicker = <T extends FieldValues>({
  className,
  field,
}: React.HTMLAttributes<HTMLDivElement> & {
  field?: ControllerRenderProps<T>;
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>();
  useEffect(() => {
    if (!date) return;
    field?.onChange(date);
  }, [date]);

  return (
    <div className={cn("grid gap-2", className ?? "")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, DATEFORMAT_YYYYMMDD_KOR)} -{" "}
                  {format(date.to, DATEFORMAT_YYYYMMDD_KOR)}
                </>
              ) : (
                format(date.from, DATEFORMAT_YYYYMMDD_KOR)
              )
            ) : (
              <span>날짜를 선택해주세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const DatePickerWithHookForm = ({ registerName }: { registerName: string }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={registerName}
      render={({ field }) => <DatePicker field={field} />}
    />
  );
};

export { DatePicker, DatePickerWithHookForm };
