import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Plus,
  Grid3X3,
  List,
  MapPinned,
  Tag,
  Sparkles,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import ExcursionForm from "@/components/forms/ExcursionForm";

import {
  fetchExcursions,
  addExcursion,
  editExcursion,
  setExcursionSearch,
} from "@/app/slices/excursionSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const LIMIT_OPTIONS = [6, 9, 12, 18];

function ExcursionCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border bg-background/60 backdrop-blur">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <CardContent className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, icon: Icon, subtle }) {
  return (
    <Card className="rounded-2xl border bg-background/80 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {subtle ? (
            <p className="mt-1 text-xs text-muted-foreground">{subtle}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border bg-muted/60 p-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExcursionManager() {
  const dispatch = useDispatch();

  const {
    items = [],
    loading = false,
    search = "",
    page = 1,
    limit = 9,
    total = 0,
    totalPages: storeTotalPages,
  } = useSelector((s) => s.excursions || {});

  const [view, setView] = useState("card");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    dispatch(fetchExcursions({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    items.forEach((item) => {
      (item.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : (item.status || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesTag =
        tagFilter === "all" ? true : (item.tags || []).includes(tagFilter);

      return matchesStatus && matchesTag;
    });
  }, [items, statusFilter, tagFilter]);

  const totalPages =
    storeTotalPages ||
    Math.max(1, Math.ceil((total || filtered.length || 1) / limit));

  const publishedCount = useMemo(
    () =>
      items.filter(
        (item) => (item.status || "").toUpperCase() === "PUBLISHED"
      ).length,
    [items]
  );

  const featuredCount = useMemo(
    () => items.filter((item) => item.is_featured_on_home).length,
    [items]
  );

  async function handleSubmit(payload) {
    const action = editItem
      ? editExcursion({ id: editItem.id, payload })
      : addExcursion(payload);

    const toastId = toast.loading(
      editItem ? "Saving excursion..." : "Creating excursion..."
    );

    const res = await dispatch(action);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(
        editItem ? "Excursion updated successfully" : "Excursion created",
        { id: toastId }
      );
      setModalOpen(false);
      setEditItem(null);
      dispatch(fetchExcursions({ search, page: 1, limit }));
    } else {
      toast.error(res.payload || "Something went wrong", { id: toastId });
    }
  }

  async function confirmDelete() {
    if (!deleteItem) return;

    const toastId = toast.loading("Deleting excursion...");

    // const res = await dispatch(removeExcursion(deleteItem.id));

    // if (res.meta.requestStatus === "fulfilled") {
    //   toast.success("Excursion deleted", { id: toastId });
    //   dispatch(fetchExcursions({ search, page, limit }));
    // } else {
    //   toast.error(res.payload || "Delete failed", { id: toastId });
    // }

    // setDeleteItem(null);
  }

  const handleDuplicate = async (item) => {
    const payload = {
      ...item,
      title: `${item.title || "Untitled"} (Copy)`,
    };

    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.approved_by;

    const toastId = toast.loading("Duplicating excursion...");

    const res = await dispatch(addExcursion(payload));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Excursion duplicated", { id: toastId });
      dispatch(fetchExcursions({ search, page: 1, limit }));
    } else {
      toast.error(res.payload || "Duplicate failed", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero */}
      <div className="flex flex-col gap-4 rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Excursion catalog
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Excursion Manager
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage experiences, highlights, tags, and destination content in a
              polished dashboard.
            </p>
          </div>
        </div>

        <Button
          className="h-11 rounded-xl px-5"
          onClick={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Excursion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total excursions"
          value={total || items.length}
          icon={MapPinned}
          subtle="Across all destinations"
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={Eye}
          subtle="Visible in live catalog"
        />
        <StatCard
          title="Featured"
          value={featuredCount}
          icon={Sparkles}
          subtle="Highlighted on home"
        />
      </div>

      {/* Toolbar */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Browse excursions</CardTitle>
          <CardDescription>
            Search, filter, and switch between a card view and a clean table
            layout.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) =>
                    dispatch(setExcursionSearch(e.target.value))
                  }
                  placeholder="Search by title, destination, route or keyword..."
                  className="h-11 rounded-xl pl-9"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="all">All tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <select
                value={limit}
                onChange={(e) =>
                  dispatch(fetchExcursions({ search, page: 1, limit: Number(e.target.value) }))
                }
                className="h-11 rounded-xl border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                {LIMIT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} / page
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex rounded-2xl border bg-muted/40 p-1">
              <Button
                variant={view === "card" ? "default" : "ghost"}
                size="sm"
                className="rounded-xl"
                onClick={() => setView("card")}
              >
                <Grid3X3 className="mr-2 h-4 w-4" />
                Cards
              </Button>
              <Button
                variant={view === "table" ? "default" : "ghost"}
                size="sm"
                className="rounded-xl"
                onClick={() => setView("table")}
              >
                <List className="mr-2 h-4 w-4" />
                Table
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {loading ? "Loading..." : `${filtered.length} results`}
            </span>
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="rounded-full">
                Status: {statusFilter}
              </Badge>
            )}
            {tagFilter !== "all" && (
              <Badge variant="secondary" className="rounded-full">
                <Tag className="mr-1 h-3 w-3" />
                {tagFilter}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {view === "card" ? (
        <>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: limit }).map((_, i) => (
                <ExcursionCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="rounded-3xl border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-2xl border bg-muted/50 p-4">
                  <MapPinned className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  No excursions found
                </h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Try adjusting your search or filters, or create a new
                  excursion to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item, index) => {
                const image =
                  item.featured_image ||
                  item.image ||
                  item.thumbnail ||
                  null;

                return (
                  <Card
                    key={item.id}
                    className={cn(
                      "group overflow-hidden rounded-3xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                      "animate-in fade-in-0 slide-in-from-bottom-2"
                    )}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {image ? (
                        <img
                          src={image}
                          alt={item.title || "Excursion"}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <MapPinned className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex gap-2">
                        <Badge
                          className={cn(
                            "rounded-full border",
                            (item.status || "").toUpperCase() === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          )}
                        >
                          {item.status || "UNKNOWN"}
                        </Badge>

                        {item.is_featured_on_home && (
                          <Badge className="rounded-full bg-background/90 text-foreground">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <div className="absolute right-4 top-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="size-9 rounded-full bg-background/90 shadow-sm backdrop-blur"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditItem(item);
                                setModalOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDuplicate(item)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteItem(item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <CardContent className="space-y-4 p-5">
                      <div className="space-y-1">
                        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
                          {item.title || "Untitled Excursion"}
                        </h3>

                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPinned className="h-4 w-4" />
                          {item.city?.name ||
                            item.destination?.name ||
                            item.start_city?.name ||
                            "Destination not set"}
                        </p>
                      </div>

                      {(item.description || item.short_description) && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {String(item.short_description || item.description)
                            .replace(/<[^>]*>/g, "")
                            .trim()}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {(item.tags || []).length ? (
                          item.tags.slice(0, 4).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-full"
                            >
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No tags added
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          className="flex-1 rounded-xl"
                          onClick={() => {
                            setEditItem(item);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => handleDuplicate(item)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5"
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Card className="overflow-hidden rounded-3xl border shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[320px]">Excursion</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="ml-auto h-8 w-8 animate-pulse rounded bg-muted" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No excursions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.title || "Untitled Excursion"}</span>
                          <span className="text-xs text-muted-foreground">
                            ID #{item.id}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {item.city?.name ||
                          item.destination?.name ||
                          item.start_city?.name ||
                          "-"}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.tags || []).length ? (
                            item.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="rounded-full"
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={cn(
                            "rounded-full",
                            (item.status || "").toUpperCase() === "DRAFT"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          )}
                        >
                          {item.status || "UNKNOWN"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {item.is_featured_on_home ? (
                          <Badge className="rounded-full">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontal />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditItem(item);
                                setModalOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDuplicate(item)}
                            >
                              Duplicate
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteItem(item)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      <Card className="rounded-3xl border shadow-sm">
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page <span className="font-medium text-foreground">{page}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page <= 1 || loading}
              onClick={() =>
                dispatch(fetchExcursions({ search, page: page - 1, limit }))
              }
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ChevronLeft className="mr-2 h-4 w-4" />
              )}
              Previous
            </Button>

            <div className="hidden items-center gap-2 md:flex">
              {Array.from({ length: totalPages })
                .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                .map((_, idx) => {
                  const pageNumber = Math.max(1, page - 2) + idx;

                  if (pageNumber > totalPages) return null;

                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "default" : "outline"}
                      className="h-10 min-w-10 rounded-xl px-0"
                      disabled={loading}
                      onClick={() =>
                        dispatch(
                          fetchExcursions({
                            search,
                            page: pageNumber,
                            limit,
                          })
                        )
                      }
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
            </div>

            <Button
              variant="outline"
              className="rounded-xl"
              disabled={page >= totalPages || loading}
              onClick={() =>
                dispatch(fetchExcursions({ search, page: page + 1, limit }))
              }
            >
              Next
              {loading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-w-6xl bg-background p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>
              {editItem ? "Edit Excursion" : "Create Excursion"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[82vh] overflow-y-auto px-6 py-5">
            <ExcursionForm
              key={editItem?.id || "new"}
              initial={editItem}
              onSubmit={handleSubmit}
              hideActions
            />
          </div>

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="excursion-form">
              {editItem ? "Save Changes" : "Create Excursion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete modal */}
      <AlertDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete excursion?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              excursion from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

