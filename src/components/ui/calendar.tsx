import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { DayPicker, useNavigation } from "react-day-picker";
import { cn } from "../../utils/utils";
import { buttonVariants } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { format } from "date-fns";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  maxDate,
  ...props
}: React.ComponentProps<typeof DayPicker | any>) {
  return (
    <DayPicker
      disabled={{ after: maxDate }}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4 w-full",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex-1",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md flex-1",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 w-full cursor-pointer"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}

export { Calendar };

function CustomCaption({ displayMonth }: { displayMonth: Date }) {
  const currentYear = new Date().getFullYear();
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  const handlePreviousYear = () => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(displayMonth.getFullYear() - 1);
    goToMonth(newDate);
  };

  const handleNextYear = () => {
    const newYear = displayMonth.getFullYear() + 1;
    if (newYear <= currentYear) {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(newYear);
      goToMonth(newDate);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <div className="flex">
        <button
          onClick={handlePreviousYear}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 mr-1",
            "hover:cursor-pointer"
          )}
        >
          <ChevronsLeft className="size-4" />
        </button>
        <button
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            "hover:cursor-pointer"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {format(displayMonth, "MMMM")}
        </span>
        <YearNavigation displayedYear={displayMonth.getFullYear()} currentMonth={displayMonth.getMonth()} />
      </div>

      <div className="flex">
        <button
          onClick={() => nextMonth && goToMonth(nextMonth)}
          disabled={!nextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            "hover:cursor-pointer"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={handleNextYear}
          disabled={displayMonth.getFullYear() === currentYear}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 ml-1",
            "hover:cursor-pointer"
          )}
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

function YearNavigation({
  displayedYear,
  currentMonth,
}: {
  displayedYear: number;
  currentMonth: number;
}) {
  const currentYear = new Date().getFullYear();
  const { goToMonth } = useNavigation();

  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => 1900 + i
  );

  const handleYearChange = (value: string) => {
    const newDate = new Date(parseInt(value), currentMonth);
    goToMonth(newDate);
  };

  return (
    <Select
      value={displayedYear.toString()}
      onValueChange={handleYearChange}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder={displayedYear.toString()} />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
