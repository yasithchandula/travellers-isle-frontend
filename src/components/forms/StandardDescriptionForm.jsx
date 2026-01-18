import { useEffect, useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import RichTextEditor from "../common/RichTextEditor";
import Card from "../common/Card";

import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "@/app/slices/uploadSlice";
import { fetchCities } from "@/app/slices/citySlice";

export default function StandardDescriptionForm({ initial, onSave }) {
  const dispatch = useDispatch();

  const cities = useSelector((s) => s.cities.items || []);

  /* =====================
        LOAD CITIES
     ===================== */
  useEffect(() => {
    dispatch(fetchCities(""));
  }, [dispatch]);

  /* =====================
        FORM STATE
     ===================== */
  const [form, setForm] = useState(
    initial || {
      title: "",
      gallery: [], // [{ file, preview, url }]
      featuredPreview: null,
      startCity: "",
      endCity: "",
      stops: [], // city IDs
      startingParagraph: "",
      description: "",
      tags: [],
    }
  );

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  /* =====================
        CITY FILTERS
     ===================== */
  const destinationCities = cities.filter((c) => c.is_destination);
  const stopCities = cities.filter((c) => c.is_stop);

  /* =====================
        IMAGE UPLOAD
     ===================== */
  function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const preview = URL.createObjectURL(file);

      // Add preview immediately
      setForm((prev) => {
        const newGallery = [
          ...prev.gallery,
          { file, preview, url: null },
        ];

        return {
          ...prev,
          gallery: newGallery,
          featuredPreview: prev.featuredPreview || preview,
        };
      });

      // Upload
      dispatch(uploadFile({ file, type: "standard-description" }))
        .unwrap()
        .then((res) => {
          setForm((prev) => ({
            ...prev,
            gallery: prev.gallery.map((g) =>
              g.preview === preview ? { ...g, url: res.url } : g
            ),
          }));
        });
    });
  }

  function removeGalleryItem(index) {
    setForm((prev) => {
      const removed = prev.gallery[index];
      URL.revokeObjectURL(removed.preview);

      const newGallery = prev.gallery.filter((_, i) => i !== index);

      return {
        ...prev,
        gallery: newGallery,
        featuredPreview:
          prev.featuredPreview === removed.preview
            ? newGallery[0]?.preview || null
            : prev.featuredPreview,
      };
    });
  }

  function setAsFeatured(index) {
    updateField("featuredPreview", form.gallery[index].preview);
  }

  /* =====================
            STOPS
     ===================== */
  function addStop(cityId) {
    if (!cityId || form.stops.includes(cityId)) return;
    updateField("stops", [...form.stops, cityId]);
  }

  function removeStop(cityId) {
    updateField("stops", form.stops.filter((id) => id !== cityId));
  }

  /* =====================
            TAGS
     ===================== */
  const tagOptions = ["family", "honeymoon", "beach", "culture", "wildlife"];

  function toggleTag(tag) {
    updateField(
      "tags",
      form.tags.includes(tag)
        ? form.tags.filter((t) => t !== tag)
        : [...form.tags, tag]
    );
  }

  /* =====================
           SUBMIT
     ===================== */
  function handleSubmit() {
    const payload = {
      ...form,
      gallery: form.gallery.map((g) => g.url).filter(Boolean),
      featuredImage:
        form.gallery.find((g) => g.preview === form.featuredPreview)?.url ||
        null,
    };

    delete payload.featuredPreview;

    onSave(payload);
  }

  return (
    <Card>
      {/* TITLE */}
      <Input
        label="Name / Title"
        value={form.title}
        onChange={(v) => updateField("title", v)}
      />

      {/* IMAGE UPLOAD */}
      <div className="mt-6">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGallerySelect}
          className="border p-2 rounded w-full"
        />

        <div className="grid grid-cols-4 gap-3 mt-4">
          {form.gallery.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.preview}
                className={`h-24 w-full object-cover rounded border ${
                  form.featuredPreview === img.preview
                    ? "border-ti-teal border-4"
                    : ""
                }`}
              />

              <button
                type="button"
                onClick={() => removeGalleryItem(i)}
                className="absolute top-1 right-1 bg-black/60 text-white px-2 rounded text-xs"
              >
                ✕
              </button>

              {form.featuredPreview !== img.preview && (
                <button
                  type="button"
                  onClick={() => setAsFeatured(i)}
                  className="absolute bottom-1 left-1 bg-ti-teal text-white text-xs px-2 rounded"
                >
                  Set Featured
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CITIES */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Select
          label="Starting City"
          value={form.startCity}
          onChange={(v) => updateField("startCity", v)}
          options={[
            { value: "", label: "Select city" },
            ...destinationCities.map((c) => ({
              value: String(c.id),
              label: c.city,
            })),
          ]}
        />

        <Select
          label="Destination City"
          value={form.endCity}
          onChange={(v) => updateField("endCity", v)}
          options={[
            { value: "", label: "Select city" },
            ...destinationCities.map((c) => ({
              value: String(c.id),
              label: c.city,
            })),
          ]}
        />
      </div>

      {/* STOPS */}
      <div className="mt-6">
        <Select
          label="Add Intermediate Stop"
          value=""
          onChange={(v) => addStop(v)}
          options={[
            { value: "", label: "Select stop" },
            ...stopCities.map((c) => ({
              value: String(c.id),
              label: c.city,
            })),
          ]}
        />

        <div className="mt-3 space-y-2">
          {form.stops.map((id) => {
            const city = cities.find((c) => String(c.id) === String(id));
            return (
              <div key={id} className="flex justify-between bg-ti-sky/60 p-2 rounded">
                <span>{city?.city}</span>
                <button
                  type="button"
                  onClick={() => removeStop(id)}
                  className="text-ti-red"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* TEXT */}
      <RichTextEditor
        value={form.startingParagraph}
        onChange={(v) => updateField("startingParagraph", v)}
      />

      <RichTextEditor
        value={form.description}
        onChange={(v) => updateField("description", v)}
      />

      {/* TAGS */}
      <div className="flex gap-2 flex-wrap mt-4">
        {tagOptions.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full border ${
              form.tags.includes(tag)
                ? "bg-ti-teal text-white"
                : "border-ti-mint"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* SAVE */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleSubmit}>
          Save Standard Description
        </Button>
      </div>
    </Card>
  );
}
