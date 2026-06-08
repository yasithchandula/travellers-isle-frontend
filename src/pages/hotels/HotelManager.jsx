import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, MapPinned, CheckCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Modal from "../../components/common/Modal";
import HotelForm from "../../components/forms/HotelForm";

import {
  fetchHotels,
  addHotel,
  editHotel,
  disableHotel,
} from "../../app/slices/hotelSlice";

import { fetchCities } from "../../app/slices/citySlice";
import { cn } from "@/lib/utils";

import {
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

/* Reusable UI */

import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";
import CardGrid from "@/components/common/CardGrid";
import StatCard from "@/components/common/StatCard";
import EntityDialog from "@/components/common/EntityDialog";

export default function HotelManager() {

  const dispatch = useDispatch();

  const { items = [], loading } = useSelector((s) => s.hotels);
  const cities = useSelector((s) => s.cities.items || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");

  const [view, setView] = useState("table");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  /* Load Data */

  useEffect(() => {
    dispatch(fetchHotels({ page: 1, limit }));
    dispatch(fetchCities(""));
  }, [dispatch]);

  /* Reset page when filters change */

  useEffect(() => {
    setPage(1);
  }, [search, cityFilter, limit]);

  /* Filter */

  const filteredItems = useMemo(() => {
    let list = items;

    if (search) {
      list = list.filter((h) =>
        h.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cityFilter !== "all") {
      list = list.filter(
        (h) => Number(h.city_id) === Number(cityFilter)
      );
    }

    return list;
  }, [items, search, cityFilter]);

  /* Pagination */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / limit)
  );

  const paginatedHotels = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredItems.slice(start, start + limit);
  }, [filteredItems, page, limit]);

  /* Modal */

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(hotel) {
    setEditItem(hotel);
    setModalOpen(true);
  }

  /* Submit */

  async function handleSubmit(form) {

    const toastId = "hotel-save";

    try {

      toast.loading(
        editItem ? "Updating hotel..." : "Adding hotel...",
        { id: toastId }
      );

      if (editItem) {
        await dispatch(
          editHotel({ id: editItem.id, payload: form })
        ).unwrap();
      } else {
        await dispatch(addHotel(form)).unwrap();
      }

      toast.success(
        editItem
          ? "Hotel updated successfully"
          : "Hotel added successfully",
        { id: toastId }
      );

      dispatch(fetchHotels({ page: 1, limit }));

      setModalOpen(false);
      setEditItem(null);

    } catch (err) {
      toast.error("Failed to save hotel", { id: toastId });
    }
  }

  function handleDisable(id) {
    dispatch(disableHotel(id));
    setConfirmId(null);
  }

  function getCityName(cityId) {
    return cities.find((c) => c.id === Number(cityId))?.city || "-";
  }

  const cityTags = cities
    .filter((c) => c.isDestination)
    .map((c) => ({
      label: c.city,
      value: String(c.id),
    }));

  return (
    <div className="space-y-6">

      {/* HERO HEADER */}

      <EntityHeroHeader
        title="Hotel Management"
        description="Manage hotels, contacts and driver accommodation."
        buttonText="Add Hotel"
        onCreate={openCreate}
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Hotels"
          value={items.length}
          icon={Building2}
        />

        <StatCard
          title="Active Hotels"
          value={items.filter((h) => h.is_active).length}
          icon={CheckCircle}
        />

        <StatCard
          title="Cities"
          value={cities.length}
          icon={MapPinned}
        />

      </div>

      {/* TOOLBAR */}

      <ManagerToolbar
        title="Browse Hotels"
        description="Search and filter hotels."

        search={search}
        onSearchChange={setSearch}

        tagFilter={cityFilter}
        onTagChange={setCityFilter}
        tags={cityTags.map((c) => c.value)}

        limit={limit}
        onLimitChange={setLimit}

        view={view}
        setView={setView}

        loading={loading}
        resultCount={filteredItems.length}
      />

      {/* VIEW SWITCH */}

      {view === "card" ? (

        <CardGrid>
          {paginatedHotels.map((h, index) => (
            <Card
              key={h.id}
              className={cn(
                "group overflow-hidden bg-card transition-colors duration-200",
                "hover:bg-muted/20",
                "animate-in fade-in-0 slide-in-from-bottom-2"
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Image / Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {h.image ? (
                  <img
                    src={h.image}
                    alt={h.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <MapPinned className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute left-4 top-4">
                  <Badge
                    className={cn(
                      "rounded-full border",
                      h.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {h.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="space-y-4 p-5">
                {/* Title + City */}
                <div className="space-y-1">
                  <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
                    {h.name || "Unnamed Hotel"}
                  </h3>

                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinned className="h-4 w-4" />
                    {getCityName(h.city_id) || "City not set"}
                  </p>
                </div>

                {/* Address */}
                {h.address && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {h.address}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    className="flex-1"
                    onClick={() => openEdit(h)}
                  >
                    Edit
                  </Button>

                  {/* Optional future actions */}
                  {/* 
          <Button variant="outline" className="rounded-xl">
            View
          </Button>
          */}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardGrid>

      ) : (

        <EntityTable

          header={
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Driver Stay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          }

          body={

            paginatedHotels.map((h) => (

              <TableRow key={h.id}>

                <TableCell>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {h.address}
                  </div>
                </TableCell>

                <TableCell>
                  {getCityName(h.city_id)}
                </TableCell>

                <TableCell>
                  <div>{h.contact_name || "-"}</div>
                  <div className="text-xs text-muted-foreground">
                    {h.contact_phone || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  {h.driver_accommodation ? "Yes" : "No"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={h.is_active ? "default" : "outline"}
                  >
                    {h.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem
                        onClick={() => openEdit(h)}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setConfirmId(h.id)}
                      >
                        Disable
                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </TableCell>

              </TableRow>

            ))

          }

        />

      )}

      {/* PAGINATION */}

      <PaginationBar
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setPage}
      />

      {/* CREATE / EDIT */}

      <EntityDialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editItem ? "Edit Hotel" : "Add Hotel"}
        description="Manage hotel profile, destination, contact details, and room categories."
        className="sm:max-w-3xl"
        preventOutsideClose
      >
        <HotelForm
          initial={editItem}
          cities={cities}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </EntityDialog>

      {/* DISABLE CONFIRM */}

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Disable Hotel"
      >

        <p className="mb-4 text-sm">
          Are you sure you want to disable this hotel?
        </p>

        <div className="flex justify-end gap-2">

          <Button
            variant="outline"
            onClick={() => setConfirmId(null)}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => handleDisable(confirmId)}
          >
            Disable
          </Button>

        </div>

      </Modal>

    </div>
  );
}
