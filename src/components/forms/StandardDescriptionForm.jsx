import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import RichTextEditor from "../common/RichTextEditor";
import Card from "../common/Card";

export default function StandardDescriptionForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      title: "",                    // <-- NEW FIELD
      featuredImage: null,
      gallery: [],                  // <-- NEW MULTI-PHOTO ARRAY
      startCity: "",
      endCity: "",
      stops: [],
      stopInput: "",
      startingParagraph: "",
      description: "",
      tags: [],
    }
  );

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  /* -------------------------
        MULTI PHOTO HANDLERS
     ------------------------- */

  function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Append selected images
    const newGallery = [...form.gallery, ...files];

    updateField("gallery", newGallery);

    // Auto-set featured image if none selected
    if (!form.featuredImage && newGallery.length > 0) {
      updateField("featuredImage", newGallery[0]);
    }
  }

  function removeGalleryItem(i) {
    const newGallery = form.gallery.filter((_, idx) => idx !== i);

    updateField("gallery", newGallery);

    // Reset featured image if it was deleted
    if (form.featuredImage && i === 0) {
      updateField("featuredImage", newGallery[0] || null);
    }
  }

  function setAsFeatured(i) {
    updateField("featuredImage", form.gallery[i]);
  }

  /* -------------------------
            STOPS
     ------------------------- */
  function addStop() {
    if (!form.stopInput.trim()) return;
    updateField("stops", [...form.stops, form.stopInput.trim()]);
    updateField("stopInput", "");
  }

  function removeStop(i) {
    updateField("stops", form.stops.filter((_, idx) => idx !== i));
  }

  /* -------------------------
            TAGS
     ------------------------- */
  const tagOptions = ["family", "honeymoon", "beach", "culture", "wildlife"];

  function toggleTag(tag) {
    if (form.tags.includes(tag)) {
      updateField("tags", form.tags.filter((t) => t !== tag));
    } else {
      updateField("tags", [...form.tags, tag]);
    }
  }

  /* -------------------------
            SUBMIT
     ------------------------- */
  function handleSubmit() {
    onSave(form);
  }

  return (
    <Card>

      {/* TITLE / NAME */}
      <div className="mb-6">
        <Input
          label="Name / Title"
          value={form.title}
          onChange={(v) => updateField("title", v)}
          placeholder="Ex: Sigiriya to Kandy – 2 Days"
        />
      </div>

      {/* FEATURED + GALLERY UPLOAD */}
      <div className="mb-6">
        <label className="block text-sm text-ti-forest mb-2">
          Tour Images (First image = Featured)
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGallerySelect}
          className="border border-ti-mint p-2 rounded-lg w-full"
        />

        {/* GALLERY PREVIEW */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {form.gallery.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(img)}
                className={`h-24 w-full object-cover rounded-lg border ${
                  form.featuredImage === img ? "border-ti-teal border-4" : ""
                }`}
              />

              {/* REMOVE BUTTON */}
              <button
                onClick={() => removeGalleryItem(i)}
                className="absolute top-1 right-1 px-2 py-1 bg-black/60 text-white rounded-full text-xs opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>

              {/* SET FEATURED BUTTON */}
              {form.featuredImage !== img && (
                <button
                  onClick={() => setAsFeatured(i)}
                  className="absolute bottom-1 left-1 px-2 py-0.5 bg-ti-teal text-white text-xs rounded opacity-0 group-hover:opacity-100"
                >
                  Set Featured
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FEATURED IMAGE (LARGE PREVIEW) */}
        {form.featuredImage && (
          <div className="mt-4">
            <label className="text-sm text-ti-forest mb-1 block">
              Featured Image Preview
            </label>
            <img
              src={URL.createObjectURL(form.featuredImage)}
              className="h-40 object-cover rounded-lg border w-full"
            />
          </div>
        )}
      </div>

      {/* CITIES */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Select
          label="Starting City"
          value={form.startCity}
          onChange={(v) => updateField("startCity", v)}
          options={[
            { value: "", label: "Select city" },
            { value: "Colombo", label: "Colombo" },
            { value: "Kandy", label: "Kandy" },
            { value: "Sigiriya", label: "Sigiriya" },
          ]}
        />

        <Select
          label="Destination City"
          value={form.endCity}
          onChange={(v) => updateField("endCity", v)}
          options={[
            { value: "", label: "Select city" },
            { value: "Kandy", label: "Kandy" },
            { value: "Ella", label: "Ella" },
            { value: "Nuwara Eliya", label: "Nuwara Eliya" },
          ]}
        />
      </div>

      {/* INTERMEDIATE STOPS */}
      <div className="mb-6">
        <label className="text-sm text-ti-forest mb-1">Intermediate Stops</label>

        <div className="flex gap-2 mb-3">
          <Input
            value={form.stopInput}
            onChange={(v) => updateField("stopInput", v)}
            placeholder="Add stop (ex: Pinnawala)"
          />
          <Button variant="secondary" onClick={addStop}>
            Add
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {form.stops.map((stop, i) => (
            <div
              key={i}
              className="flex justify-between p-2 bg-ti-sky/60 rounded-lg"
            >
              <span>{stop}</span>
              <button className="text-ti-red" onClick={() => removeStop(i)}>
                ✕
              </button>
            </div>
          ))}

          {form.stops.length === 0 && (
            <p className="text-sm text-ti-forest/60">No stops added</p>
          )}
        </div>
      </div>

      {/* STARTING PARAGRAPH */}
      <div className="mb-6">
        <label className="text-sm text-ti-forest mb-1">Starting Paragraph</label>
        <RichTextEditor
          value={form.startingParagraph}
          onChange={(v) => updateField("startingParagraph", v)}
          placeholder="Write a beautiful starting narrative..."
        />
      </div>

      {/* FULL DESCRIPTION */}
      <div className="mb-6">
        <label className="text-sm text-ti-forest mb-1">Full Description</label>
        <RichTextEditor
          value={form.description}
          onChange={(v) => updateField("description", v)}
          placeholder="Explain the full tour day including activities, highlights, timing..."
        />
      </div>

      {/* TAGS */}
      <div className="mb-6">
        <label className="text-sm text-ti-forest mb-2 block">Tags</label>

        <div className="flex gap-2 flex-wrap">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border ${
                form.tags.includes(tag)
                  ? "bg-ti-teal text-white border-ti-teal"
                  : "border-ti-mint text-ti-forest hover:bg-ti-mint/30"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleSubmit}>
          Save Standard Description
        </Button>
      </div>

    </Card>
  );
}
