import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowsSkeleton } from "@/components/common/LoadingStates";

export default function EntityTable({
  header,
  body,
  loading = false,
  columns = 5,
  skeletonRows = 6,
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border bg-card shadow-sm"
      aria-busy={loading}
    >
      <Table>
        <TableHeader className="bg-muted/50">
          {header}
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRowsSkeleton columns={columns} rows={skeletonRows} />
          ) : (
            body
          )}
        </TableBody>
      </Table>
    </div>
  );
}
