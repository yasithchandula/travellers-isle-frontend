import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapPinned, CheckCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import Modal from "../../components/common/Modal";
import CityForm from "../../components/forms/CityForm";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../../components/ui/card";

import {
  fetchCities,
  setCitySearch,
  addCity,
  editCity,
  deactivate,
  setCityPage,
} from "../../app/slices/citySlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

/* reusable */
import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import StatCard from "@/components/common/StatCard";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import CardGrid from "@/components/common/CardGrid";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";

export default function DestinationManager() {
  const dispatch = useDispatch();

  // const { items = [], loading, search = "" } = useSelector(
  //   (s) => s.cities || {}
  // );

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [view, setView] = useState("table");
  const [limit, setLimit] = useState(10);
  //const [page, setPage] = useState(1);

  const {
    items,
    loading,
    page,
    total_pages,
    total,
    search
  } = useSelector((s) => s.cities);


  /* ================= LOAD ================= */

  useEffect(() => {
    dispatch(fetchCities({ search, page, limit }));
  }, [dispatch, search, page, limit]);


  /* ================= ACTIONS ================= */

  function openCreate() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(city) {
    setEditItem(city);
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    const toastId = "city-save";

    try {
      toast.loading(
        editItem ? "Updating city..." : "Adding city...",
        { id: toastId }
      );

      if (editItem) {
        await dispatch(
          editCity({ id: editItem.id, payload: form })
        ).unwrap();
      } else {
        await dispatch(addCity(form)).unwrap();
      }

      dispatch(fetchCities({ search, page: 1, limit }));

      toast.success(
        editItem ? "City updated" : "City added",
        { id: toastId }
      );

      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to save city", { id: toastId });
    }
  }

  async function handleDeactivate(id) {
    const toastId = "city-disable";

    try {
      toast.loading("Disabling city...", { id: toastId });

      await dispatch(deactivate(id)).unwrap();

      toast.success("City disabled", { id: toastId });

      setConfirmId(null);
    } catch {
      toast.error("Failed to disable city", { id: toastId });
    }
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      {/* HERO */}
      <EntityHeroHeader
        title="Destinations & Stops"
        description="Manage cities, destinations and stops."
        buttonText="Add City"
        onCreate={openCreate}
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Cities"
          value={total}
          icon={MapPinned}
        />

        <StatCard
          title="Active"
          value={items.filter((c) => c.status).length}
          icon={CheckCircle}
        />

        <StatCard
          title="Destinations"
          value={items.filter((c) => c.isDestination).length}
          icon={MapPinned}
        />

      </div>

      {/* TOOLBAR */}
      <ManagerToolbar
        title="Browse Cities"
        description="Search and manage cities."

        search={search}
        onSearchChange={(v) => dispatch(setCitySearch(v))}

        limit={limit}
        onLimitChange={setLimit}

        view={view}
        setView={setView}

        loading={loading}
        resultCount={total}
      />

      {/* VIEW SWITCH */}

      {view === "card" ? (
        <CardGrid>
          {items.map((c, index) => (
            <div
              key={c.id}
              className={cn(
                "group rounded-lg border bg-card p-5 shadow-sm transition-colors duration-200",
                "hover:bg-muted/20",
                "animate-in fade-in-0 slide-in-from-bottom-2"
              )}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {c.city}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {c.country}
                  </p>
                </div>

                {/* Status */}
                  <Badge
                    className={cn(
                      "rounded-full",
                      c.status
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                  {c.status ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {c.isDestination === 1 && (
                  <Badge className="rounded-full bg-accent text-accent-foreground">
                    Destination
                  </Badge>
                )}

                {c.isStop === 1 && (
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    Stop
                  </Badge>
                )}

                {c.isDestination !== 1 && c.isStop !== 1 && (
                  <span className="text-xs text-muted-foreground">
                    No roles assigned
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  ID: {c.id}
                </span>

                <Button
                  size="sm"
                  onClick={() => openEdit(c)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardGrid>

      ) : (

        <EntityTable

          header={
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          }

          body={

            loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.map((c) => (

              <TableRow key={c.id}>

                <TableCell className="font-medium">
                  {c.city}
                </TableCell>

                <TableCell>{c.code}</TableCell>

                <TableCell>{c.country}</TableCell>

                <TableCell>
                  {c.isDestination === 1 && <Badge>Destination</Badge>}
                  {c.isStop === 1 && <Badge variant="secondary">Stop</Badge>}
                </TableCell>

                <TableCell>
                  <Badge variant={c.status ? "default" : "outline"}>
                    {c.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem
                        onClick={() => openEdit(c)}
                      >
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setConfirmId(c.id)}
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
        totalPages={total_pages}
        loading={loading}
        onPageChange={(p) => dispatch(setCityPage(p))}
      />

      {/* MODAL */}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>
              {editItem ? "Edit City" : "Add City"}
            </DialogTitle>
          </DialogHeader>

          <CityForm
            initial={editItem}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* CONFIRM */}

      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="Disable City"
      >
        <p className="mb-4">
          Are you sure you want to disable this city?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmId(null)}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => handleDeactivate(confirmId)}
          >
            Disable
          </Button>
        </div>
      </Modal>

    </div>
  );
}
