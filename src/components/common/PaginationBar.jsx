import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InlineLoading } from "@/components/common/LoadingStates";

export default function PaginationBar({
  page,
  totalPages,
  loading,
  onPageChange
}) {
  return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <InlineLoading label="Updating page" />
            ) : (
              <>
                Showing Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>

          </div>
      </CardContent>
    </Card >
  );
}
