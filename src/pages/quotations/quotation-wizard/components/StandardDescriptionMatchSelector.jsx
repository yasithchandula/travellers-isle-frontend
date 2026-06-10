import { useMemo, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  Eye,
  FileSearch,
  FileText,
  Loader2,
  Pencil,
  Route,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { buildImageUrl } from "@/utils/urls";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

export default function StandardDescriptionMatchSelector({
  selected = null,
  exactMatch = null,
  suggestions = [],
  allDescriptions = [],
  loading = false,
  error = null,
  onSelect,
  onSearchAll,
  onPreview,
  onEdit,
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("recommended");
  const exactMatchId = exactMatch ? String(exactMatch.id) : null;
  const uniqueSuggestions = useMemo(() => {
    const seen = new Set();

    return suggestions.filter((item) => {
      const id = String(item.id);
      if (id === exactMatchId || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [exactMatchId, suggestions]);

  function selectDescription(description) {
    onSelect(description);
    setOpen(false);
  }

  return (
    <div className="space-y-2">
      {loading ? (
        <MatchStatus
          icon={Loader2}
          iconClassName="animate-spin"
          title="Finding the best description"
          detail="Matching route and excursions..."
        />
      ) : exactMatch ? (
        <ExactMatchCard
          description={exactMatch}
          selected={String(selected?.id) === exactMatchId}
          onSelect={() => selectDescription(exactMatch)}
          onPreview={() => onPreview(exactMatch)}
          onEdit={() => onEdit(exactMatch)}
        />
      ) : error ? (
        <MatchStatus
          icon={FileText}
          title="Recommendations unavailable"
          detail={String(error)}
          tone="warning"
        />
      ) : (
        <MatchStatus
          icon={Sparkles}
          title="No exact match"
          detail={
            uniqueSuggestions.length
              ? `${uniqueSuggestions.length} suggested alternative${
                  uniqueSuggestions.length === 1 ? "" : "s"
                }`
              : "Search all descriptions to choose manually"
          }
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-between bg-background px-3 font-normal"
          >
            <span
              className={cn(
                "min-w-0 truncate",
                !selected && "text-muted-foreground"
              )}
            >
              {selected
                ? getDescriptionTitle(selected)
                : "Choose standard description"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[min(600px,calc(100vw-2rem))] overflow-hidden p-0"
        >
          <div className="border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <WandSparkles className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">
                Choose Standard Description
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the recommended match or search the full description library.
            </p>
          </div>

          <div className="grid grid-cols-2 border-b bg-background p-1.5">
            <ModeButton
              active={mode === "recommended"}
              icon={Sparkles}
              label="Recommended"
              onClick={() => setMode("recommended")}
            />
            <ModeButton
              active={mode === "all"}
              icon={FileSearch}
              label="Search All"
              onClick={() => setMode("all")}
            />
          </div>

          {mode === "recommended" ? (
            <div className="max-h-[460px] space-y-4 overflow-y-auto p-4">
              {exactMatch && (
                <section className="space-y-2">
                  <SectionTitle title="Exact match" count={1} />
                  <DescriptionOption
                    description={exactMatch}
                    selected={String(selected?.id) === exactMatchId}
                    exact
                    onSelect={() => selectDescription(exactMatch)}
                    onPreview={() => onPreview(exactMatch)}
                    onEdit={() => onEdit(exactMatch)}
                  />
                </section>
              )}

              <section className="space-y-2">
                <SectionTitle
                  title="Suggested alternatives"
                  count={uniqueSuggestions.length}
                />
                {uniqueSuggestions.length ? (
                  <div className="space-y-2">
                    {uniqueSuggestions.map((description) => (
                      <DescriptionOption
                        key={description.id}
                        description={description}
                        selected={
                          String(selected?.id) === String(description.id)
                        }
                        onSelect={() => selectDescription(description)}
                        onPreview={() => onPreview(description)}
                        onEdit={() => onEdit(description)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyLibrary
                    message="No suggested alternatives for this day."
                    action="Search the full library"
                    onAction={() => setMode("all")}
                  />
                )}
              </section>
            </div>
          ) : (
            <Command shouldFilter={false}>
              <div className="border-b p-2">
                <CommandInput
                  placeholder="Search all standard descriptions..."
                  onValueChange={onSearchAll}
                />
              </div>
              <CommandList className="max-h-[460px] p-2">
                <CommandEmpty>
                  <EmptyLibrary message="No descriptions found." />
                </CommandEmpty>
                <CommandGroup>
                  <div className="space-y-2">
                    {allDescriptions.map((description) => (
                      <CommandItem
                        key={description.id}
                        value={`${description.id} ${getDescriptionTitle(
                          description
                        )} ${getRouteLabel(description)}`}
                        onSelect={() => selectDescription(description)}
                        className="p-0 data-[selected=true]:bg-transparent"
                      >
                        <DescriptionOption
                          description={description}
                          selected={
                            String(selected?.id) === String(description.id)
                          }
                          onSelect={() => selectDescription(description)}
                          onPreview={() => onPreview(description)}
                          onEdit={() => onEdit(description)}
                        />
                      </CommandItem>
                    ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ExactMatchCard({
  description,
  selected,
  onSelect,
  onPreview,
  onEdit,
}) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
          <WandSparkles className="h-3.5 w-3.5" />
        </span>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={onSelect}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              {selected ? "Exact match auto-selected" : "Exact match available"}
            </span>
            {selected && <Check className="h-3.5 w-3.5 text-emerald-700" />}
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-emerald-950">
            {getDescriptionTitle(description)}
          </div>
          <div className="mt-0.5 truncate text-xs text-emerald-800">
            {getRouteLabel(description)}
          </div>
        </button>
        <DescriptionActions
          onPreview={onPreview}
          onEdit={onEdit}
          className="border-emerald-200 bg-white/70"
        />
      </div>
    </div>
  );
}

function MatchStatus({
  icon,
  iconClassName,
  title,
  detail,
  tone = "default",
}) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-2.5 py-2",
        tone === "warning"
          ? "border-amber-200 bg-amber-50/60"
          : "bg-muted/20"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground",
          tone === "warning" && "text-amber-700",
          iconClassName
        )}
      />
      <div className="min-w-0">
        <div className="truncate text-xs font-semibold">{title}</div>
        <div className="truncate text-[11px] text-muted-foreground">
          {detail}
        </div>
      </div>
    </div>
  );
}

function DescriptionOption({
  description,
  selected,
  exact = false,
  onSelect,
  onPreview,
  onEdit,
}) {
  const image = description.featured_image || description.gallery?.[0];

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border bg-background p-3 transition-colors",
        selected && "border-primary/30 bg-primary/5",
        exact && "border-emerald-200 bg-emerald-50/40"
      )}
    >
      {image ? (
        <img
          src={buildImageUrl(image)}
          alt=""
          className="h-12 w-12 shrink-0 rounded-md border object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border bg-muted/40">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={onSelect}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-semibold">
            {getDescriptionTitle(description)}
          </span>
          {selected && <Check className="h-3.5 w-3.5 text-primary" />}
          {exact && (
            <Badge className="bg-emerald-600 text-[10px] hover:bg-emerald-600">
              Exact
            </Badge>
          )}
          {description.status && (
            <Badge variant="outline" className="text-[10px]">
              {description.status}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Route className="h-3 w-3" />
          <span className="truncate">{getRouteLabel(description)}</span>
        </div>
      </button>

      <DescriptionActions onPreview={onPreview} onEdit={onEdit} />
    </div>
  );
}

function DescriptionActions({ onPreview, onEdit, className }) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={onPreview}
        title="Preview description"
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("h-8 w-8", className)}
        onClick={onEdit}
        title="Edit description"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function ModeButton({ active, icon, label, onClick }) {
  const Icon = icon;

  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function SectionTitle({ title, count }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <Badge variant="outline" className="text-[10px]">
        {count}
      </Badge>
    </div>
  );
}

function EmptyLibrary({ message, action, onAction }) {
  return (
    <div className="rounded-lg border border-dashed px-4 py-8 text-center">
      <Search className="mx-auto h-5 w-5 text-muted-foreground" />
      <div className="mt-2 text-xs text-muted-foreground">{message}</div>
      {action && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1 h-auto"
          onClick={onAction}
        >
          {action}
        </Button>
      )}
    </div>
  );
}

function getDescriptionTitle(description) {
  return description?.title || getRouteLabel(description);
}

function getRouteLabel(description) {
  return `${description?.start_city?.name || "Any start"} → ${
    description?.end_city?.name || "Any destination"
  }`;
}
