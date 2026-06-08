import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EntityHeroHeader({
  title,
  description,
  buttonText,
  onCreate
}) {
  return (
    <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <Button className="h-10 px-4" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}
