import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import RichTextEditor from "../common/RichTextEditor";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import ExcursionSelector from "@/components/ui/excursion-selector";


import { fetchExcursions } from "@/app/slices/excursionSlice";

import { uploadFile } from "@/app/slices/uploadSlice";
import { fetchCities } from "@/app/slices/citySlice";
import { buildImageUrl } from "../../utils/urls";

import { toast } from "sonner";
import { MapPin, Trash2, X } from "lucide-react";

export default function StandardDescriptionForm({
  initial,
  onSubmit,
  hideActions = false,
}) {
  const dispatch = useDispatch();
  const cities = useSelector((s) => s.cities.items || []);
  const [stopSelect, setStopSelect] = useState("");
  const [tagSelect, setTagSelect] = useState("");
  const tagOptions = [
    "family",
    "honeymoon",
    "beach",
    "culture",
    "wildlife",
  ];

  const excursions = useSelector((s) => s.excursions.items || []);
  const [excursionSearch, setExcursionSearch] = useState("");
  const [selectedExcursions, setSelectedExcursions] = useState([]);


  /* =====================
     LOAD CITIES
  ===================== */
  useEffect(() => {
    dispatch(fetchCities(""));
  }, [dispatch]);

  useEffect(() => {
    if (excursionSearch.length < 2) return;
    dispatch(fetchExcursions({ search: excursionSearch }));
  }, [excursionSearch]);


  /* =====================
     FORM STATE
  ===================== */
  const emptyForm = {
    title: "",
    start_city_id: "",
    end_city_id: "",
    stops: [],
    starting_paragraph: "[]",
    description: "",
    tags: [],
    gallery: [],
    featuredPreview: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  /* =====================
     EDIT MODE HYDRATION
  ===================== */
  /* =====================
     EDIT MODE HYDRATION
  ===================== */
  useEffect(() => {
    if (!initial) {
      setForm(emptyForm);
      setSelectedExcursions([]);
      setErrors({});
      return;
    }

    setForm({
      title: initial.title || "",

      start_city_id: String(initial.start_city_id || ""),
      end_city_id: String(initial.end_city_id || ""),

      /* FIX: stops may come as objects or ids */
      stops: Array.isArray(initial.stops)
        ? initial.stops.map((s) => String(s?.id ?? s))
        : [],

      starting_paragraph: initial.starting_paragraph || "[]",
      description: initial.description || "",

      tags: Array.isArray(initial.tags) ? initial.tags : [],

      gallery: Array.isArray(initial.gallery)
        ? initial.gallery.map((img) => ({
          url: img,
          preview: buildImageUrl(img),
          file: null,
          status: "done",
        }))
        : [],

      featuredPreview: initial.featured_image
        ? buildImageUrl(initial.featured_image)
        : initial.gallery?.[0]
          ? buildImageUrl(initial.gallery[0])
          : null,
    });

    /* FIX: hydrate excursions for edit mode */
    if (Array.isArray(initial.excursions)) {
      setSelectedExcursions(
        initial.excursions.map((e) => e.excursion || e)
      );
    } else {
      setSelectedExcursions([]);
    }

    setErrors({});
  }, [initial]);



  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  }

  /* =====================
     VALIDATION
  ===================== */
  function validate() {
    const e = {};

    if (!form.title.trim()) {
      e.title = "Title is required";
    }

    if (!form.start_city_id) {
      e.start_city_id = "Starting city is required";
    }

    if (!form.end_city_id) {
      e.end_city_id = "Destination city is required";
    }

    if (
      form.start_city_id &&
      form.end_city_id &&
      form.start_city_id === form.end_city_id
    ) {
      e.end_city_id =
        "Starting city and destination city cannot be the same";
    }

    // if (!form.starting_paragraph.trim()) {
    //   e.starting_paragraph = "Starting paragraph is required";
    // }

    if (!form.description.trim()) {
      e.description = "Description is required";
    }

    if (!form.gallery.length) {
      e.gallery = "At least one image is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* =====================
     IMAGE UPLOAD
  ===================== */

  function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const preview = URL.createObjectURL(file);

      // optimistic add
      setForm((prev) => ({
        ...prev,
        gallery: [
          ...prev.gallery,
          {
            file,
            preview,
            url: null,
            status: "uploading",
          },
        ],
        featuredPreview: prev.featuredPreview || preview,
      }));

      dispatch(uploadFile({ file, type: "standard-description" }))
        .unwrap()
        .then((res) => {
          if (!res?.link) {
            throw new Error("Invalid upload response");
          }

          setForm((prev) => ({
            ...prev,
            gallery: prev.gallery.map((g) =>
              g.preview === preview
                ? {
                  ...g,
                  url: res.link,
                  status: "done",
                }
                : g
            ),
          }));
        })
        .catch((err) => {
          toast.error(
            typeof err === "string"
              ? err
              : `Failed to upload ${file.name}`
          );

          setForm((prev) => {
            const gallery = prev.gallery.filter(
              (g) => g.preview !== preview
            );

            URL.revokeObjectURL(preview);

            return {
              ...prev,
              gallery,
              featuredPreview:
                prev.featuredPreview === preview
                  ? gallery[0]?.preview || null
                  : prev.featuredPreview,
            };
          });
        });
    });
  }



  function removeGalleryItem(index) {
    setForm((prev) => {
      const removed = prev.gallery[index];
      if (removed?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(removed.preview);
      }

      const gallery = prev.gallery.filter((_, i) => i !== index);

      return {
        ...prev,
        gallery,
        featuredPreview:
          prev.featuredPreview === removed.preview
            ? gallery[0]?.preview || null
            : prev.featuredPreview,
      };
    });
  }

  function setAsFeatured(index) {
    updateField("featuredPreview", form.gallery[index].preview);
  }

  /* =====================
     SUBMIT
  ===================== */
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const galleryUrls = form.gallery
      .map((g) => g.url)
      .filter(Boolean);

    const featuredImage =
      form.gallery.find(
        (g) => g.preview === form.featuredPreview
      )?.url || galleryUrls[0] || null;

    const payload = {
      title: form.title,
      start_city_id: Number(form.start_city_id),
      end_city_id: Number(form.end_city_id),
      stops: form.stops.map(Number),
      starting_paragraph: form.starting_paragraph,
      description: form.description,
      tags: form.tags,
      gallery: galleryUrls,
      featuredImage,
      excursions: selectedExcursions.map((e) => ({
        excursion_id: e.id,
        is_optional: e.is_optional,
      })),
      mileage: 0,
      travel_time_minutes: 0

    };

    onSubmit(payload);
  }

  // function addStop() {
  //   if (!stopSelect) return;

  //   if (form.stops.includes(stopSelect)) {
  //     return; // prevent duplicates
  //   }

  //   updateField("stops", [...form.stops, stopSelect]);
  //   setStopSelect("");
  // }

  function removeStop(id) {
    updateField(
      "stops",
      form.stops.filter((s) => String(s) !== String(id))
    );
  }

  function addTag() {
    if (!tagSelect) return;

    if (form.tags.includes(tagSelect)) {
      return; // prevent duplicates
    }

    updateField("tags", [...form.tags, tagSelect]);
    setTagSelect("");
  }

  function removeTag(tag) {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  }

  // function addExcursion(e) {
  //   if (selectedExcursions.find((x) => x.id === e.id)) return;
  //   setSelectedExcursions((p) => [...p, e]);
  // }

  // function removeExcursion(id) {
  //   setSelectedExcursions((p) => p.filter((x) => x.id !== id));
  // }




  const destinationCities = cities.filter((c) => c.is_destination);

  return (
    <form
      id="standard-description-form"
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ================= TITLE ================= */}
      <Input
        label="Title / Name"
        value={form.title}
        error={errors.title}
        onChange={(v) => updateField("title", v)}
      />

      {/* ================= GALLERY ================= */}
      <div className="border rounded-md p-3 space-y-2">
        <h3 className="text-sm font-semibold">Gallery</h3>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleGallerySelect}
          className="text-sm"
        />

        {errors.gallery && (
          <p className="text-xs text-ti-red">{errors.gallery}</p>
        )}

        <div className="grid grid-cols-4 gap-3">
          {form.gallery.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.preview}
                className={`h-24 w-full object-cover rounded border ${form.featuredPreview === img.preview
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

      {/* ================= ROUTE ================= */}
      <div className="border rounded-xl p-4 space-y-4 bg-white shadow-sm">
        <h3 className="text-sm font-semibold text-ti-forest">
          Route
        </h3>

        {/* START + DESTINATION */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Starting City"
            value={form.start_city_id}
            error={errors.start_city_id}
            onChange={(v) => updateField("start_city_id", v)}
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
            value={form.end_city_id}
            error={errors.end_city_id}
            onChange={(v) => updateField("end_city_id", v)}
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
        <div className="space-y-2">
          <label className="text-xs font-medium">Intermediate Stops</label>

          {/* SELECTOR (auto add on select) */}
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={stopSelect}
            onChange={(e) => {
              const val = e.target.value;
              setStopSelect("");

              if (!val) return;

              if (!form.stops.includes(val)) {
                updateField("stops", [...form.stops, val]);
              }
            }}
          >
            <option value="">Select city to add</option>
            {(cities || [])
              .filter((c) => c.is_stop)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city}
                </option>
              ))}
          </select>

          {/* CHIPS */}
          <div className="flex flex-wrap gap-3 items-center">
            {form.stops.length ? (
              form.stops.map((id, index) => {
                const city = cities.find((c) => String(c.id) === String(id));

                return (
                  <div key={id} className="flex items-center gap-2 group">
                    {/* Optional: Add a connector arrow between stops, except for the first one */}
                    {index > 0 && (
                      <span className="text-ti-sky/40 font-bold text-xs">→</span>
                    )}

                    <div
                      className=" flex items-center pl-2 pr-1 py-1.5 rounded-xl text-xs gap-3 border transition-all duration-200 shadow-sm bg-ti-mint/5 border-ti-mint/20 hover:border-ti-mint/40"
                    >
                      {/* The Icon */}
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-ti-sky/10">
                        <MapPin size={14} strokeWidth={1} />
                      </div>

                      {/* City Label */}
                      <span className="font-semibold tracking-tight">
                        {city?.city || id}
                      </span>

                      {/* Improved Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeStop(id)}
                        className="ml-1 p-1 rounded-full text-slate-300 hover:text-white hover:bg-ti-red transition-all border-l pl-2 ml-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-100 rounded-xl w-full">
                <span className="text-xs text-slate-400 italic">
                  No intermediate stops added yet
                </span>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* ================= EXCURSIONS ================= */}
      <div className="border rounded-md p-3 space-y-3">
        <h3 className="text-sm font-semibold">Link Excursions</h3>
        <ExcursionSelector
          items={excursions}
          selected={selectedExcursions}
          setSelected={setSelectedExcursions}
          onSearch={(val) => setExcursionSearch(val)}
        />

      </div>



      {/* ================= CONTENT ================= */}
      <div className="border rounded-md p-3 space-y-2">
        {/* <h3 className="text-sm font-semibold">Content</h3>
        <label className="block text-xs font-medium">
          Starting Paragraph
        </label>

        <RichTextEditor
          value={form.starting_paragraph}
          onChange={(v) =>
            updateField("starting_paragraph", v)
          }
        />
        {errors.starting_paragraph && (
          <p className="text-xs text-ti-red">
            {errors.starting_paragraph}
          </p>
        )} */}


        <label className="block text-xs font-medium pt-2">
          Description
        </label>

        <RichTextEditor
          value={form.description}
          onChange={(v) => updateField("description", v)}
        />
        {errors.description && (
          <p className="text-xs text-ti-red">
            {errors.description}
          </p>
        )}
      </div>

      {/* ================= TAGS ================= */}
      <div className="p-2 border rounded space-y-2">
        <h3 className="text-sm font-semibold">Tags</h3>

        <div className="flex gap-2">
          <select
            className="flex-1 border rounded px-2 py-1.5 text-sm"
            value={tagSelect}
            onChange={(e) => setTagSelect(e.target.value)}
          >
            <option value="">Select tag</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={addTag}
          >
            Add
          </Button>
        </div>

        {/* SELECTED TAGS */}
        <div className="flex flex-wrap gap-2">
          {form.tags.length ? (
            form.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 border rounded text-xs flex items-center gap-1 bg-ti-mint/60"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-ti-red"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">
              No tags added
            </span>
          )}
        </div>
      </div>


      {!hideActions && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit">
            {initial ? "Save Changes" : "Add Description"}
          </Button>
        </div>
      )}
    </form>
  );
}
