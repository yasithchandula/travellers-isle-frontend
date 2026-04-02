"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  ImagePlus,
  MapPin,
  Route,
  Clock3,
  Trash2,
  Star,
  UploadCloud,
  Sparkles,
  Tag,
  FileText,
  Mountain,
  CheckCircle2,
  Loader2,
  GalleryHorizontal,
  Car,
} from "lucide-react";

import RichTextEditor from "../common/RichTextEditor";
import ExcursionSelector from "@/components/ui/excursion-selector";

import { fetchExcursions } from "@/app/slices/excursionSlice";
import { fetchDistance } from "@/app/slices/standardDescriptionSlice";
import { uploadFile } from "@/app/slices/uploadSlice";
import { fetchCities } from "@/app/slices/citySlice";
import { buildImageUrl } from "../../utils/urls";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StandardDescriptionForm({
  initial,
  onSubmit,
  hideActions = false,
}) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const titleRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [stopSelect, setStopSelect] = useState("");
  const [tagSelect, setTagSelect] = useState("");

  const tagOptions = ["family", "honeymoon", "beach", "culture", "wildlife"];

  const excursions = useSelector((s) => s.excursions.items || []);
  const [excursionSearch, setExcursionSearch] = useState("");
  const [selectedExcursions, setSelectedExcursions] = useState([]);

  const { distanceLoading } = useSelector((s) => s.standardDescriptions);

  /* =====================
     LOAD CITIES
  ===================== */
  useEffect(() => {
    const loadAllCities = async () => {
      try {
        setIsLoadingCities(true);

        let page = 1;
        const limit = 50;
        let allCities = [];
        let totalPages = 1;

        do {
          const res = await dispatch(fetchCities({ search: "", page, limit })).unwrap();
          const data = res?.data || res;

          if (!data?.items) {
            throw new Error("Invalid city response");
          }

          allCities = [...allCities, ...data.items];
          totalPages = data.total_pages || 1;
          page++;
        } while (page <= totalPages);

        const formatted = allCities.map((c) => ({
          id: String(c.id),
          city: c.city,
          is_stop: c.is_stop,
          is_destination: c.is_destination,
        }));

        setCities(formatted);
      } catch (err) {
        console.error("Failed to load cities:", err);
        toast.error("Failed to load cities");
      } finally {
        setIsLoadingCities(false);
      }
    };

    loadAllCities();
  }, [dispatch]);

  useEffect(() => {
    if (excursionSearch.length < 2) return;
    dispatch(fetchExcursions({ search: excursionSearch }));
  }, [excursionSearch, dispatch]);

  useEffect(() => {
    const el = titleRef.current;

    if (el) {
      requestAnimationFrame(() => {
        el.focus({ preventScroll: true }); // ✅ KEY FIX
      });
    }
  }, [initial]);

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
    mileage: "",
    travel_time_minutes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

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
      start_city_id: initial.start_city?.id
        ? String(initial.start_city.id)
        : "",

      end_city_id: initial.end_city?.id
        ? String(initial.end_city.id)
        : "",

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

      mileage: Number(initial.mileage) || "",
      travel_time_minutes: Number(initial.travel_time_minutes) || "",
      excursions: initial.excursions || [],
    });

    if (Array.isArray(initial.excursions)) {
      setSelectedExcursions(
        (initial.excursions || [])
          .map((entry) => {
            const excursion = entry.excursion || entry;

            return {
              ...excursion,
              id: excursion?.id ?? entry?.excursion_id ?? entry?.id ?? null,
              is_optional: entry?.is_optional ?? false,
            };
          })
          .filter((e) => e.id !== null)
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
      e.end_city_id = "Starting city and destination city cannot be the same";
    }

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
          toast.error(typeof err === "string" ? err : `Failed to upload ${file.name}`);

          setForm((prev) => {
            const gallery = prev.gallery.filter((g) => g.preview !== preview);

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

    e.target.value = "";
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

    const galleryUrls = form.gallery.map((g) => g.url).filter(Boolean);

    const featuredImage =
      form.gallery.find((g) => g.preview === form.featuredPreview)?.url ||
      galleryUrls[0] ||
      null;

    const payload = {
      ...(initial?.id && { id: initial.id }),
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
      travel_time_minutes: 0,
    };

    onSubmit(payload);
  }

  function removeStop(id) {
    updateField(
      "stops",
      form.stops.filter((s) => String(s) !== String(id))
    );
  }

  function addTag() {
    if (!tagSelect) return;
    if (form.tags.includes(tagSelect)) return;

    updateField("tags", [...form.tags, tagSelect]);
    setTagSelect("");
  }

  function removeTag(tag) {
    updateField(
      "tags",
      form.tags.filter((t) => t !== tag)
    );
  }

  function getCityName(id) {
    const city = cities.find((c) => String(c.id) === String(id));
    return city?.city || "";
  }

  async function handleFetchDistance() {
    try {
      if (!form.start_city_id || !form.end_city_id) {
        toast.error("Select start and destination cities first");
        return;
      }

      const origin = `${getCityName(form.start_city_id)}, Sri Lanka`;
      const destination = `${getCityName(form.end_city_id)}, Sri Lanka`;
      const stops = form.stops.map((id) => `${getCityName(id)}, Sri Lanka`);

      const payload = {
        origin,
        destination,
        stops,
        travel_mode: "driving",
      };

      const res = await dispatch(fetchDistance(payload)).unwrap();

      const distanceMeters = res.Distance;
      const durationNano = res.Duration;

      const km = Math.round(distanceMeters / 1000);
      const minutes = Math.round(durationNano / 1e9 / 60);

      updateField("mileage", km);
      updateField("travel_time_minutes", minutes);

      toast.success("Distance calculated 🚗");
    } catch (err) {
      console.error(err);
      toast.error(err || "Failed to fetch distance");
    }
  }

  const stopCities = (cities || []).filter((c) => c.is_stop);
  const totalImages = form.gallery.length;
  const uploadedImages = form.gallery.filter((g) => g.status === "done").length;

  return (
    <form
      id="standard-description-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Basic Info */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Define the title and core identity of this standard description.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title / Name</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Scenic South Coast Journey"
              className="h-11"
              ref={titleRef}
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive">{errors.title}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImagePlus className="h-4 w-4" />
            Gallery Management
          </CardTitle>
          <CardDescription>
            Upload destination imagery, curate gallery items, and choose the featured image.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div
            className="rounded-2xl border border-dashed bg-muted/30 p-6 transition hover:bg-muted/40"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleGallerySelect}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-background shadow-sm">
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Click to upload gallery images
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports multiple image uploads. First image becomes featured until changed.
                </p>
              </div>

              <Button type="button" variant="secondary" className="rounded-xl">
                Choose Images
              </Button>
            </div>
          </div>

          {errors.gallery && (
            <p className="text-xs font-medium text-destructive">{errors.gallery}</p>
          )}

          {!!form.gallery.length && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {form.gallery.map((img, i) => {
                const isFeatured = form.featuredPreview === img.preview;
                const isUploading = img.status === "uploading";

                return (
                  <div
                    key={i}
                    className={`group overflow-hidden rounded-2xl border bg-background shadow-sm transition ${isFeatured ? "ring-2 ring-primary/30" : "hover:shadow-md"
                      }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={img.preview}
                        alt={`Gallery ${i + 1}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2">
                        <Badge
                          variant={isFeatured ? "default" : "secondary"}
                          className="rounded-lg"
                        >
                          {isFeatured ? (
                            <>
                              <Star className="mr-1 h-3 w-3" />
                              Featured
                            </>
                          ) : (
                            "Gallery"
                          )}
                        </Badge>

                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 rounded-full shadow-sm"
                          onClick={() => removeGalleryItem(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-2">
                        <div className="rounded-xl bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                          {isUploading ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Ready
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-3">
                      <div className="text-xs text-muted-foreground">
                        Image #{i + 1}
                      </div>

                      {!isFeatured && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="rounded-xl"
                          onClick={() => setAsFeatured(i)}
                        >
                          <Star className="mr-1 h-3.5 w-3.5" />
                          Set Featured
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="h-4 w-4" />
            Route Configuration
          </CardTitle>
          <CardDescription>
            Select the origin, destination, and intermediate stops for this itinerary path.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Starting City</Label>
              <Select
                key={`start-${form.start_city_id}-${cities.length}`}
                value={form.start_city_id || undefined}
                onValueChange={(v) => updateField("start_city_id", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue
                    placeholder={isLoadingCities ? "Loading cities..." : "Select starting city"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.start_city_id && (
                <p className="text-xs font-medium text-destructive">
                  {errors.start_city_id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Destination City</Label>
              <Select
                key={`end-${form.end_city_id}-${cities.length}`}
                value={form.end_city_id || undefined}
                onValueChange={(v) => updateField("end_city_id", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue
                    placeholder={isLoadingCities ? "Loading cities..." : "Select destination city"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.end_city_id && (
                <p className="text-xs font-medium text-destructive">
                  {errors.end_city_id}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div>
              <Label>Intermediate Stops</Label>
              <p className="mt-1 text-xs text-muted-foreground">
                Add optional stop points between the start and destination cities.
              </p>
            </div>

            <Select
              value={stopSelect || undefined}
              onValueChange={(val) => {
                setStopSelect("");
                if (!val) return;
                if (!form.stops.includes(val)) {
                  updateField("stops", [...form.stops, val]);
                }
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select city to add as a stop" />
              </SelectTrigger>
              <SelectContent>
                {stopCities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap items-center gap-2">
              {form.stops.length ? (
                form.stops.map((id, index) => {
                  const city = cities.find((c) => String(c.id) === String(id));

                  return (
                    <div key={id} className="flex items-center gap-2">
                      {index > 0 && (
                        <div className="rounded-full border bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                          → Route
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 shadow-sm">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <MapPin className="h-3.5 w-3.5" />
                        </div>

                        <span className="text-sm font-medium">
                          {city?.city || id}
                        </span>

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                          onClick={() => removeStop(id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full rounded-2xl border border-dashed bg-muted/20 px-4 py-5 text-center text-sm text-muted-foreground">
                  No intermediate stops added yet
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distance */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Car className="h-4 w-4" />
            Distance & Travel Details
          </CardTitle>
          <CardDescription>
            Fetch automated mileage and travel duration based on the selected route.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label>Mileage (KM)</Label>
              <Input
                value={form.mileage}
                onChange={(e) => updateField("mileage", e.target.value)}
                placeholder="Auto or manual"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Travel Time (Minutes)</Label>
              <Input
                value={form.travel_time_minutes}
                onChange={(e) => updateField("travel_time_minutes", e.target.value)}
                placeholder="Auto calculated"
                className="h-11"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleFetchDistance}
                disabled={distanceLoading}
                className="h-11 w-full rounded-xl lg:w-auto"
              >
                {distanceLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Route className="mr-2 h-4 w-4" />
                    Fetch Distance
                  </>
                )}
              </Button>
            </div>
          </div>

          {form.travel_time_minutes ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="text-xs text-muted-foreground">Mileage</div>
                <div className="mt-1 text-lg font-semibold">
                  {form.mileage || 0} km
                </div>
              </div>

              <div className="rounded-2xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  Travel Time
                </div>
                <div className="mt-1 text-lg font-semibold">
                  {form.travel_time_minutes} minutes
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Excursions */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mountain className="h-4 w-4" />
            Linked Excursions
          </CardTitle>
          <CardDescription>
            Search and attach relevant excursions to enrich this standard description.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ExcursionSelector
            items={excursions}
            selected={selectedExcursions}
            setSelected={setSelectedExcursions}
            onSearch={(val) => setExcursionSearch(val)}
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Content Editor
          </CardTitle>
          <CardDescription>
            Write the rich itinerary description content shown to users and quotations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="rounded-2xl border bg-background p-2 shadow-sm">
              <RichTextEditor
                value={form.description}
                onChange={(v) => updateField("description", v)}
              />
            </div>
            {errors.description && (
              <p className="text-xs font-medium text-destructive">
                {errors.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4" />
            Audience Tags
          </CardTitle>
          <CardDescription>
            Organize this description with reusable travel audience and theme tags.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label>Select Tag</Label>
              <Select
                value={tagSelect || undefined}
                onValueChange={(value) => setTagSelect(value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose a tag" />
                </SelectTrigger>
                <SelectContent>
                  {tagOptions.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                className="h-11 rounded-xl"
                onClick={addTag}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.tags.length ? (
              form.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-xl px-3 py-1.5 text-sm capitalize"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-muted-foreground transition hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))
            ) : (
              <div className="w-full rounded-2xl border border-dashed bg-muted/20 px-4 py-5 text-center text-sm text-muted-foreground">
                No tags added
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!hideActions && (
        <div className="sticky bottom-0 z-10 border-t bg-background/95 px-1 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Review the gallery, route, excursions, and content before saving.
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" className="min-w-[180px] rounded-xl">
                <Sparkles className="mr-2 h-4 w-4" />
                {initial ? "Save Changes" : "Add Description"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}