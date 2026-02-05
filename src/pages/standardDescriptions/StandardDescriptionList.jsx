import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Check, Trash2 } from "lucide-react";

import Button from "../../components/common/Button";
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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

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

import { toast } from "sonner";

export default function StandardDescriptionManager() {
  const dispatch = useDispatch();

  const {
    items = [],
    loading,
    search = "",
    page = 1,
    limit = 10,
  } = useSelector((s) => s.standardDescriptions || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [approveItem, setApproveItem] = useState(null);


  useEffect(() => {
    dispatch(fetchStandardDescriptions({ search, page: 1, limit }));
  }, [dispatch, search, limit]);


  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (d) =>
        d.start_city?.name?.toLowerCase().includes(q) ||
        d.end_city?.name?.toLowerCase().includes(q) ||
        d.title?.toLowerCase().includes(q)
    );
  }, [items, search]);


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
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <CardTitle className="text-2xl font-semibold">
              Standard Descriptions
            </CardTitle>
            <Button onClick={() => setModalOpen(true)}>
              + New Description
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* SEARCH */}
          <div className="flex gap-3 mb-5">
            <InputGroup>
              <InputGroupInput
                placeholder="Search by route or title..."
                value={search}
                onChange={(e) =>
                  dispatch(setStandardDescriptionSearch(e.target.value))
                }
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                {filtered.length} Results
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* TABLE */}
          <div className="overflow-auto rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 border-b">Route</th>
                  <th className="p-3 border-b">Stops</th>
                  <th className="p-3 border-b">Tags</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b w-40">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium">
                        {d.start_city?.name} → {d.end_city?.name}
                      </div>
                      {d.title && (
                        <div className="text-xs text-gray-500">
                          {d.title}
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {d.stops?.length
                        ? d.stops.map((s, i) => (
                          <span
                            key={i}
                            className="mr-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                          >
                            {s.name || s}
                          </span>
                        ))
                        : "-"}
                    </td>

                    <td className="p-3">
                      {d.tags?.length
                        ? d.tags.map((t, i) => (
                          <span
                            key={i}
                            className="mr-1 px-2 py-1 bg-gray-200 rounded text-xs"
                          >
                            {t}
                          </span>
                        ))
                        : "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${d.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {d.status}
                      </span>
                    </td>

                    <td className="p-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditItem(d);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      {d.status === "DRAFT" && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => setApproveItem(d)}
                        >
                          Approve
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteItem(d)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No standard descriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FORM MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editItem ? "Edit Standard Description" : "Create Standard Description"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <StandardDescriptionForm
              initial={editItem}
              onSubmit={handleSubmit}
              hideActions
            />
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="standard-description-form">
              {editItem ? "Save Changes" : "Add Description"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Description?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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

      {/* APPROVE MODAL */}
      <AlertDialog open={!!approveItem} onOpenChange={() => setApproveItem(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Description?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make the description available for use.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove}>
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
