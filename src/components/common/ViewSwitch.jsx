import { Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewSwitch({ view, onChange }) {
    return (
        <div className="inline-flex rounded-2xl border bg-muted/40 p-1">

            <Button
                variant={view === "card" ? "default" : "ghost"}
                size="sm"
                className="rounded-xl"
                onClick={() => onChange("card")}
            >
                <Grid3X3 className="mr-2 h-4 w-4" />
                Cards
            </Button>

            <Button
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className="rounded-xl"
                onClick={() => onChange("table")}
            >
                <List className="mr-2 h-4 w-4" />
                Table
            </Button>

        </div>
    );
}