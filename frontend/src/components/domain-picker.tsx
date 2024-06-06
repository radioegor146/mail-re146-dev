import React, {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronDown, ChevronUp} from "lucide-react";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";

export function DomainPicker({domain, onDomainChange, domains}: {
    domain: string,
    onDomainChange: (value: string) => void,
    domains?: string[]
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between rounded-l-none border-l-0"
                >
                    {domain && domains
                        ? domains.find((otherDomain) => otherDomain === domain)
                        : "Loading..."}
                    {open ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50"/> :
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {domains?.map((otherDomain) => (
                                <CommandItem
                                    key={otherDomain}
                                    value={otherDomain}
                                    onSelect={(currentValue) => {
                                        onDomainChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            otherDomain === domain ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {otherDomain}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}