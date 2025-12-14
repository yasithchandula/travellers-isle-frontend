import Button from "../../../components/common/Button";

export default function QuotationRowActions({
  openQuotation,
  duplicateQuotation,
}) {
  return (
    <div className="flex gap-2 justify-end">

      <Button
        size="sm"
        variant="outline"
        onClick={openQuotation}
      >
        View / Edit
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={duplicateQuotation}
      >
        Duplicate
      </Button>

    </div>
  );
}
