import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTags } from "@/lib/use-tag";
import { jsonFetcherMaker } from "@/lib/utils";
import { RequiredAuthContext } from "@/context";

import type { Noop } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { forwardRef, useRef, useState, useContext } from "react";
import { CommandGroup } from "cmdk";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (...events: any[]) => void;
  onBlur: Noop;
  value: Array<string>;
  disabled?: boolean;
  name: string;
}

// @ts-expect-error TS6133
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagsInput = forwardRef(function TagsInput(props: Props, ref) {
  const inputRef = useRef(null);

  const { require } = useContext(RequiredAuthContext);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: paginatedTags, isLoading } = useTags(
    { q: inputValue },
    jsonFetcherMaker(require)
  );
  const isEmpty = paginatedTags?.[0]?.length === 0;
  const tags = paginatedTags?.flat().map((tag) => tag.name) || [];
  const fullMatch = !inputValue || tags.find((tag) => tag === inputValue);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        {props.value.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
            <X
              size={12}
              className="ml-1"
              onClick={() => {
                props.onChange(props.value.filter((t) => t !== tag));
              }}
            />
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                ref={inputRef}
                placeholder="Type to search..."
                value={inputValue}
                onValueChange={(value) => setInputValue(value)}
                disabled={props.disabled}
              />
              {isEmpty && <CommandEmpty> No results found </CommandEmpty>}
              {isLoading && <CommandEmpty> Fetching... </CommandEmpty>}
              <CommandList>
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem
                      key={`word-${tag}`}
                      onSelect={() => {
                        props.onChange([...props.value, tag]);
                        setInputValue("");
                      }}
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  {!fullMatch && (
                    <CommandItem
                      key="new"
                      onSelect={() => {
                        props.onChange([...props.value, inputValue]);
                        setInputValue("");
                      }}
                      className="plex gap-2"
                    >
                      <Plus size={12} />
                      {inputValue}
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
});

export { TagsInput };
