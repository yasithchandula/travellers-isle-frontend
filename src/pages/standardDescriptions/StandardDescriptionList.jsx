import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapPinned,
  CheckCircle,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StandardDescriptionForm from "@/components/forms/StandardDescriptionForm";

import {
  fetchStandardDescriptions,
  addStandardDescription,
  editStandardDescription,
  removeStandardDescription,
  approveStandardDescriptionById,
  setStandardDescriptionSearch,
} from "../../app/slices/standardDescriptionSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

/* reusable */

import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import StatCard from "@/components/common/StatCard";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import CardGrid from "@/components/common/CardGrid";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";
import { buildImageUrl } from "../../utils/urls";
import { useRef } from "react";

import StandardDescriptionHeader from "./StandardDescriptionHeader";



export default function StandardDescriptionManager() {

  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [approveItem, setApproveItem] = useState(null);

  const [view, setView] = useState("table");
  const [limit, setLimit] = useState(10);


  const {
    items = [],
    loading,
    search = "",
    page,
    totalPages,
    total,
  } = useSelector((s) => s.standardDescriptions || {});


  useEffect(() => {
    dispatch(fetchStandardDescriptions({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  useEffect(() => {
    if (!modalOpen) return;

    let frame;
    let count = 0;

    const run = () => {
      scrollRef.current?.scrollTo({ top: 0 });

      count++;
      if (count < 15) {
        frame = requestAnimationFrame(run);
      }
    };

    run();

    return () => cancelAnimationFrame(frame);
  }, [modalOpen]);

  /* submit */

  async function handleSubmit(payload) {

    const action = editItem
      ? editStandardDescription({ id: editItem.id, payload })
      : addStandardDescription(payload);

    const toastId = toast.loading(
      editItem ? "Saving changes..." : "Creating standard description..."
    );

    const res = await dispatch(action);

    if (res.meta.requestStatus === "fulfilled") {

      toast.success(
        editItem
          ? "Standard description updated"
          : "Standard description created",
        { id: toastId }
      );

      setModalOpen(false);
      setEditItem(null);

      dispatch(fetchStandardDescriptions({ search, page: 1, limit }));

    } else {
      toast.error(res.payload || "Something went wrong", { id: toastId });
    }
  }

  async function confirmDelete() {

    const toastId = toast.loading("Deleting standard description...");

    const res = await dispatch(removeStandardDescription(deleteItem.id));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Standard description deleted", { id: toastId });
    } else {
      toast.error(res.payload || "Delete failed", { id: toastId });
    }

    setDeleteItem(null);
  }

  async function confirmApprove() {

    const toastId = toast.loading("Approving standard description...");

    const res = await dispatch(
      approveStandardDescriptionById(approveItem.id)
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Standard description approved", { id: toastId });
    } else {
      toast.error(res.payload || "Approve failed", { id: toastId });
    }

    setApproveItem(null);
  }

  return (
    <div className="space-y-6">

      {/* HERO */}

      <EntityHeroHeader
        title="Standard Descriptions"
        description="Manage itinerary route descriptions."
        buttonText="New Description"
        onCreate={() => {
          setEditItem(null);
          setModalOpen(true);
        }}
      />

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total"
          value={total}
          icon={FileText}
          loading={loading}
        />

        <StatCard
          title="Approved"
          value={items.filter((i) => i.status === "APPROVED").length}
          icon={CheckCircle}
          loading={loading}
        />

        <StatCard
          title="Routes"
          value={items.length}
          icon={MapPinned}
          loading={loading}
        />

      </div>

      {/* TOOLBAR */}

      <ManagerToolbar
        title="Browse descriptions"
        description="Search and manage route descriptions."

        search={search}
        onSearchChange={(v) =>
          dispatch(setStandardDescriptionSearch(v))
        }

        limit={limit}
        onLimitChange={setLimit}

        view={view}
        setView={setView}

        loading={loading}
        resultCount={total}
      />

      {/* VIEW */}

      {view === "card" ? (
        <CardGrid loading={loading} skeletonVariant="media">
          {items.map((d, index) => {
            const image =
              d.featured_image || d.gallery?.[0] || "/placeholder.jpg";

            return (
              <Card
                key={d.id}
                className={cn(
                  "group overflow-hidden bg-card transition-colors duration-200",
                  "hover:bg-muted/20",
                  "animate-in fade-in-0 slide-in-from-bottom-2"
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={buildImageUrl(image)}
                    alt={d.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Route on image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-sm font-semibold">
                      {d.start_city?.name || "Start"} →{" "}
                      {d.end_city?.name || "End"}
                    </h3>

                    {d.title && (
                      <p className="text-xs opacity-80 line-clamp-1">
                        {d.title}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={cn(
                        "rounded-full px-2 py-1 text-xs",
                        d.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      )}
                    >
                      {d.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="space-y-4 p-5">
                  {/* Distance + Time */}
                  {(d.mileage || d.travel_time_minutes) && (
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {d.mileage ? <span>{d.mileage} km</span> : null}
                      {d.travel_time_minutes ? (
                        <span>{d.travel_time_minutes} mins</span>
                      ) : null}
                    </div>
                  )}

                  {/* Stops */}
                  {d.stops?.length > 0 && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      Stops:{" "}
                      {d.stops.map((s) => s.name).join(" • ")}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {d.tags?.length ? (
                      d.tags.slice(0, 3).map((t, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-full text-xs"
                        >
                          #{t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No tags
                      </span>
                    )}
                  </div>

                  {/* Excursions */}
                  {d.excursions?.length > 0 && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {d.excursions[0].name}
                      {d.excursions.length > 1 &&
                        ` +${d.excursions.length - 1} more`}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setEditItem(d);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setViewItem(d); // not implemnted yet - ******
                      }}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardGrid>

      ) : (

        <EntityTable
          loading={loading}
          columns={5}

          header={
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          }

          body={

            items.map((d) => (

              <TableRow key={d.id}>

                <TableCell>

                  <div className="font-medium">
                    {d.start_city?.name} → {d.end_city?.name}
                  </div>

                  {d.title && (
                    <div className="text-xs text-muted-foreground">
                      {d.title}
                    </div>
                  )}

                </TableCell>

                <TableCell>

                  {d.stops?.length
                    ? d.stops.map((s, i) => (
                      <Badge key={i} variant="secondary">
                        {s.name || s}
                      </Badge>
                    ))
                    : "-"}

                </TableCell>

                <TableCell>

                  {d.tags?.length
                    ? d.tags.map((t, i) => (
                      <Badge key={i} variant="outline">
                        {t}
                      </Badge>
                    ))
                    : "-"}

                </TableCell>

                <TableCell>

                  <Badge
                    variant={
                      d.status === "DRAFT"
                        ? "outline"
                        : "default"
                    }
                  >
                    {d.status}
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
                        onClick={() => {
                          setEditItem(d);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>

                      {d.status === "DRAFT" && (
                        <DropdownMenuItem
                          onClick={() => setApproveItem(d)}
                        >
                          Approve
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteItem(d)}
                      >
                        Delete
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
        onPageChange={(p) =>
          dispatch(fetchStandardDescriptions({ search, page: p, limit }))
        }
      />

      {/* FORM MODAL */}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>

        <DialogContent
          className="flex h-[90vh] max-w-6xl flex-col overflow-hidden rounded-lg border bg-card p-0 shadow-xl"
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >

          <DialogHeader className="border-b px-5 py-3">
            <DialogTitle>
              <div className="px-1">

                <StandardDescriptionHeader
                  initial={editItem}
                  uploadedImages={0} // optional: wire later
                  totalImages={0}
                  excursionCount={0}
                />
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4" ref={scrollRef}>

            <StandardDescriptionForm
              key={editItem?.id || "new"}
              initial={editItem}
              onSubmit={handleSubmit}
              hideActions
            />

          </div>

          <div className="flex justify-end gap-2 border-t bg-card px-5 py-3">

            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="standard-description-form"
              className="min-w-[160px]"
            >
              {editItem ? "Save Changes" : "Add Description"}
            </Button>

          </div>

        </DialogContent>

      </Dialog>

      {/* DELETE */}

      <AlertDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Description?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

      {/* APPROVE */}

      <AlertDialog
        open={!!approveItem}
        onOpenChange={() => setApproveItem(null)}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Approve Description?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will make it available for use.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={confirmApprove}>
              Approve
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}
