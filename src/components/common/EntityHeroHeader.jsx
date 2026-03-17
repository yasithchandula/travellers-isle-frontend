import { Button } from "@/components/ui/button";
import { Sparkles, Plus } from "lucide-react";

export default function EntityHeroHeader({
  title,
  description,
  buttonText,
  onCreate
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Catalog
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button className="h-11 rounded-xl px-5" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>

    </div>
  );
}