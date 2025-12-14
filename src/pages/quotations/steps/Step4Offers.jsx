import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import OffersPanel from "./sections/OffersPanel";

export default function Step4Offers({
  finalDoc,
  costing,
  onChange,
  back,
  next
}) {

  function update(value) {
    onChange({ ...finalDoc, offers: value });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <OffersPanel
          grandTotal={costing.grandTotal}
          offers={finalDoc.offers}
          onChange={update}
        />
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue to Final Preview →</Button>
      </div>
    </div>
  );
}
