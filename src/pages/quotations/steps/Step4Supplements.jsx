import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import OptionalSupplements from "./sections/OptionalSupplements";

export default function Step4Supplements({ finalDoc, onChange, back, next }) {

  function update(value) {
    onChange({ ...finalDoc, supplements: value });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <OptionalSupplements
          supplements={finalDoc.supplements || []}
          onChange={update}
        />
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back}>← Back</Button>
        <Button onClick={next}>Continue to Offers/Preview →</Button>
      </div>
    </div>
  );
}
