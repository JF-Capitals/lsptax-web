"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Year = {
  value: string;
  label: string;
};

const years: Year[] = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return {
    value: year.toString(),
    label: year.toString(),
  };
});

export function YearSelector({
  onYearSelect,
}: {
  onYearSelect: (year: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<Year | null>(null);

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Year</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedYear ? <>{selectedYear.label}</> : <>Select year</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search year..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {years.map((year) => (
                  <CommandItem
                    key={year.value}
                    value={year.value}
                    onSelect={(value) => {
                      const selected =
                        years.find((y) => y.value === value) || null;
                      setSelectedYear(selected);
                      setOpen(false);
                      if (selected) onYearSelect(selected.value);
                    }}
                  >
                    {year.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
