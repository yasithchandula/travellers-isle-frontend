import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPinned,
  Sparkles,
  Eye,
  MoreHorizontal,
  Plus,
  Clock3,
  Sailboat,
  CarFront,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import ExcursionForm from "@/components/forms/ExcursionForm";

import {
  fetchExcursions,
  addExcursion,
  editExcursion,
  setExcursionSearch,
} from "@/app/slices/excursionSlice";

import { fetchCities } from "../../app/slices/citySlice";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import StatCard from "@/components/common/StatCard";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import CardGrid from "@/components/common/CardGrid";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";

const formatCurrency = (value, currency = "USD") => {
  const numericValue = Number(value || 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numericValue);
  } catch {
    return `${currency} ${numericValue}`;
  }
};

const getPricingLabel = (type) => {
  switch (type) {
    case "PER_PERSON":
      return "Per Person";
    case "BOAT":
      return "Boat Experience";
    case "SAFARI":
      return "Safari";
    case "CUSTOM":
      return "Custom";
    case "FREE":
      return "Free";
    default:
      return type || "Standard";
  }
};

const getPricingIcon = (type) => {
  switch (type) {
    case "BOAT":
      return Sailboat;
    case "SAFARI":
      return CarFront;
    case "PER_PERSON":
      return Users;
    default:
      return Clock3;
  }
};

const getPrimaryPrice = (item) => {
  switch (item.pricing_type) {
    case "PER_PERSON":
      return item.adult_price || 0;
    case "BOAT":
      return item.boat_price || 0;
    case "SAFARI":
      return item.jeep_rent_price || 0;
    case "CUSTOM":
      return item.optional_supplement_price || 0;
    case "FREE":
      return 0;
    default:
      return item.adult_price || 0;
  }
};

export default function ExcursionManager() {
  const dispatch = useDispatch();

  const {
    items = [],
    loading = false,
    search = "",
    total = 0,
    totalPages = 1,
  } = useSelector((s) => s.excursions || {});

  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);

  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const { items: cities = [] } = useSelector((s) => s.cities || {});

  useEffect(() => {
    dispatch(fetchCities({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExcursions({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  const normalizedItems = useMemo(() => {
    return items.map((item) => {
      const derivedTags = [
        getPricingLabel(item.pricing_type),
        item.is_full_day ? "Full Day" : "Half Day",
        item.enable_reminder ? "Reminder" : null,
        item.allow_zero_at_quotation ? "Zero Allowed" : null,
      ].filter(Boolean);

      return {
        id: item.id,
        title: item.name || "Untitled",
        description: item.description || "",
        status: item.is_active ? "PUBLISHED" : "DRAFT",
        tags: derivedTags,
        pricingType: item.pricing_type,
        price: getPrimaryPrice(item),
        currency: item.currency || "USD",
        featuredImage: null,
        isFeatured: false,
        enableReminder: !!item.enable_reminder,
        isFullDay: !!item.is_full_day,
        adultPrice: item.adult_price || 0,
        childPrice: item.child_price || 0,
        infantPrice: item.infant_price || 0,
        boatCapacity: item.boat_capacity || 0,
        jeepCapacity: item.jeep_capacity || 0,
        raw: item,
      };
    });
  }, [items]);

  const allTags = useMemo(() => {
    const set = new Set();
    normalizedItems.forEach((item) => {
      (item.tags || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [normalizedItems]);

  const filtered = useMemo(() => {
    return normalizedItems.filter((item) => {
      const matchStatus =
        statusFilter === "all"
          ? true
          : item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchTag =
        tagFilter === "all"
          ? true
          : (item.tags || []).some((t) => t === tagFilter);

      return matchStatus && matchTag;
    });
  }, [normalizedItems, statusFilter, tagFilter]);

  const publishedCount = normalizedItems.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const featuredCount = normalizedItems.filter(
    (item) => item.isFeatured
  ).length;

  const boatCount = normalizedItems.filter(
    (item) => item.pricingType === "BOAT"
  ).length;

  async function handleSubmit(payload) {
    const action = editItem
      ? editExcursion({ id: editItem.id, payload })
      : addExcursion(payload);

    const toastId = toast.loading(
      editItem ? "Updating excursion..." : "Saving excursion..."
    );

    const res = await dispatch(action);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(
        editItem ? "Excursion updated successfully" : "Excursion created successfully",
        { id: toastId }
      );
      setModalOpen(false);
      setEditItem(null);
      setPage(1);
      dispatch(fetchExcursions({ search, page: 1, limit }));
    } else {
      toast.error(res.payload || "Failed to save excursion", { id: toastId });
    }
  }

  const handleDuplicate = async (item) => {
    const payload = {
      ...item,
      name: `${item.name} (Copy)`,
    };

    delete payload.id;

    const toastId = toast.loading("Duplicating excursion...");

    const res = await dispatch(addExcursion(payload));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Excursion duplicated successfully", { id: toastId });
      setPage(1);
      dispatch(fetchExcursions({ search, page: 1, limit }));
    } else {
      toast.error("Failed to duplicate excursion", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <EntityHeroHeader
        title="Excursion Manager"
        description="Manage experiences, pricing models, and bookable travel activities from one place."
        buttonText="New Excursion"
        onCreate={() => {
          setEditItem(null);
          setModalOpen(true);
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Excursions" value={total || normalizedItems.length} icon={MapPinned} loading={loading} />
        <StatCard title="Published" value={publishedCount} icon={Eye} loading={loading} />
        <StatCard title="Featured" value={featuredCount} icon={Sparkles} loading={loading} />
        <StatCard title="Boat Tours" value={boatCount} icon={Sailboat} loading={loading} />
      </div>

      <ManagerToolbar
        title="Browse excursions"
        description="Search, filter, and switch between a premium card layout and a clean table view."
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          dispatch(setExcursionSearch(value));
        }}
        tagFilter={tagFilter}
        onTagChange={setTagFilter}
        tags={allTags}
        extraFilters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: ["all", "draft", "published"],
          },
        ]}
        limit={limit}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        view={view}
        setView={setView}
        loading={loading}
        resultCount={total || filtered.length}
      />

      {view === "card" ? (
        !loading && filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-card py-20">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-md bg-muted p-4">
                <MapPinned className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No excursions found</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try changing your search term or filters, or create a new excursion to get started.
              </p>
              <Button
                className="mt-5"
                onClick={() => {
                  setEditItem(null);
                  setModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Excursion
              </Button>
            </div>
          </div>
        ) : (
          <CardGrid loading={loading} skeletonVariant="media">
            {filtered.map((item) => {
              const PricingIcon = getPricingIcon(item.pricingType);

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-colors duration-200 hover:bg-muted/20"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="rounded-md bg-background/70 p-4 backdrop-blur">
                            <PricingIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            {getPricingLabel(item.pricingType)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                    <div className="absolute left-3 top-3">
                      <div className="rounded-md bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
                        {formatCurrency(item.price, item.currency)}
                      </div>
                    </div>

                    <div className="absolute right-3 top-3 flex items-center gap-2">
                      <Badge
                        variant={item.status === "PUBLISHED" ? "default" : "outline"}
                        className="backdrop-blur"
                      >
                        {item.status}
                      </Badge>

                      {item.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="shadow-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditItem(item.raw);
                              setModalOpen(true);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleDuplicate(item.raw)}>
                            Duplicate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                      <div className="rounded-xl bg-black/25 p-2 backdrop-blur">
                        <PricingIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase text-white/75">
                          Pricing Model
                        </p>
                        <p className="text-sm font-semibold">
                          {getPricingLabel(item.pricingType)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="line-clamp-1 text-lg font-semibold">
                        {item.title}
                      </h3>

                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {item.description || "No description available for this excursion yet."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(item.tags || []).map((tag) => (
                        <Badge
                          key={`${item.id}-${tag}`}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
                      <div className="rounded-md bg-background p-3 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Base Price
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatCurrency(item.price, item.currency)}
                        </p>
                      </div>

                      <div className="rounded-md bg-background p-3 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Child Price
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          {formatCurrency(item.childPrice, item.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>{item.isFullDay ? "Full Day" : "Half Day"}</span>
                      </div>

                      <div className="font-medium text-foreground">
                        {item.currency} • {item.pricingType}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardGrid>
        )
      ) : (
        <EntityTable
          loading={loading}
          columns={6}
          header={
            <TableRow>
              <TableHead>Excursion</TableHead>
              <TableHead>Pricing Type</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          }
          body={filtered.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="line-clamp-1 text-sm text-muted-foreground">
                    {item.description || "No description"}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{getPricingLabel(item.pricingType)}</Badge>
              </TableCell>

              <TableCell>{formatCurrency(item.price, item.currency)}</TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {(item.tags || []).slice(0, 3).map((tag) => (
                    <Badge key={`${item.id}-${tag}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant={item.status === "PUBLISHED" ? "default" : "outline"}>
                  {item.status}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditItem(item.raw);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleDuplicate(item.raw)}>
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        />
      )}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setPage}
      />

      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditItem(null);
        }}
      >
        <DialogContent className="flex h-[90vh] max-w-6xl flex-col overflow-hidden rounded-lg border bg-card p-0 shadow-xl">

          {/* HEADER */}
          <div className="shrink-0 border-b bg-card px-5 py-3">
            <DialogTitle className="text-lg font-semibold">
              {editItem ? "Edit Excursion" : "Create Excursion"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Configure excursion details, pricing, and settings
            </p>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto relative">
            <div className="px-5 py-4">
              <ExcursionForm
                key={editItem?.id || "new"}
                initial={editItem}
                cities={cities}
                onSubmit={handleSubmit}
                hideActions
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-2 border-t bg-card px-5 py-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="excursion-form" className="min-w-[150px]">
              {editItem ? "Save Changes" : "Create Excursion"}
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
