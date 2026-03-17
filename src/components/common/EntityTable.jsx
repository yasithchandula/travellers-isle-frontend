import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function EntityTable({ header, body }) {
  return (
    <div className="rounded-3xl border shadow-sm">
    <Table>
      <TableHeader>
        {header}
      </TableHeader>

      <TableBody>
        {body}
      </TableBody>
    </Table>
    </div>
  );
}