import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PaginationBar({
  page,
  totalPages,
  loading,
  onPageChange
}) {
  return (
      <Card className="rounded-3xl border shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <ChevronLeft className="mr-2 h-4 w-4" />
              )}
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              {loading ? (
                <Loader2 className="animate-spin ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>

          </div>
      </CardContent>
    </Card >
  );
}