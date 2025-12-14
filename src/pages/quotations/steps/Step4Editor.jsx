import { useState } from "react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

import TipTapEditor from "../../../components/common/RichTextEditor";
import ImageUploader from "../../../components/common/ImageUploader";

export default function Step4Editor({
  itinerary,
  tourEntry,
  costing,
  finalDoc,
  onChange,
  next,
  back,
}) {
  const [local, setLocal] = useState(finalDoc || {
    title: "Your Sri Lanka Holiday",
    subtitle: "Crafted by Travellers Isle",
    coverImage: "",
    gallery: [],
    highlightText: "",
    dayDescriptions: itinerary.days.map((d, i) => ({
      dayIndex: i,
      customTitle: `Day ${i+1} — ${d.destinationName}`,
      customDescription: "",
    })),
  });

  function update(patch) {
    const merged = { ...local, ...patch };
    setLocal(merged);
    onChange(merged);
  }

  function updateDay(i, patch) {
    const newDays = [...local.dayDescriptions];
    newDays[i] = { ...newDays[i], ...patch };
    update({ dayDescriptions: newDays });
  }

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER SECTION */}
      <Card>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Quotation Header</h2>

          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Main Heading"
            value={local.title}
            onChange={(e) => update({ title: e.target.value })}
          />

          <input
            className="border rounded px-3 py-2 w-full"
            placeholder="Subtitle"
            value={local.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
          />

          {/* COVER IMAGE */}
          <div>
            <div className="font-medium mb-1">Cover Image</div>
            <ImageUploader
              value={local.coverImage}
              onChange={(img) => update({ coverImage: img })}
            />
          </div>
        </div>
      </Card>

      {/* GALLERY IMAGES */}
      <Card>
        <h2 className="text-xl font-semibold mb-3">Gallery Images</h2>
        <ImageUploader
          multiple
          value={local.gallery}
          onChange={(imgs) => update({ gallery: imgs })}
        />
      </Card>

      {/* HIGHLIGHT TEXT */}
      <Card>
        <h2 className="text-xl font-semibold mb-3">Highlight Text</h2>
        <TipTapEditor
          content={local.highlightText}
          onChange={(v) => update({ highlightText: v })}
          height={150}
        />
      </Card>

      {/* DAY-BY-DAY CUSTOM DESCRIPTION */}
      {local.dayDescriptions.map((d, i) => (
        <Card key={i}>
          <h3 className="font-semibold mb-3">{`Day ${i + 1} — Custom Text`}</h3>

          <input
            className="border rounded px-3 py-2 w-full mb-3"
            placeholder="Day Title"
            value={d.customTitle}
            onChange={(e) => updateDay(i, { customTitle: e.target.value })}
          />

          <TipTapEditor
            content={d.customDescription}
            onChange={(v) => updateDay(i, { customDescription: v })}
            height={200}
          />
        </Card>
      ))}

      {/* NAVIGATION */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={back}>← Back</Button>
        <Button onClick={next}>Proceed to Optional Supplements →</Button>
      </div>
    </div>
  );
}
