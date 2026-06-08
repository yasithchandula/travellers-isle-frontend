import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EntityTable({ header, body }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          {header}
        </TableHeader>

        <TableBody>
          {body}
        </TableBody>
      </Table>
    </div>
  );
}
