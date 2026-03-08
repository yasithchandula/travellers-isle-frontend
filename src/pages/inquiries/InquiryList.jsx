import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Button from "../../components/common/Button";
import InquiryForm from "../../components/forms/InquiryForm";
import AssignInquiryForm from "../../components/forms/AssignInquiryForm";
import ConvertInquiryForm from "../../components/forms/ConvertInquiryForm";

import {
  fetchInquiries,
  setInquiryQuery,
  setInquiryLabel,
  addInquiry,
  assignToExecutive,
  convertToTour
} from "../../app/slices/inquirySlice";

import { toast } from "sonner";

export default function InquiryList() {

  const dispatch = useDispatch();

  const {
    items = [],
    loading,
    query,
    labelFilter
  } = useSelector((s) => s.inquiries);

  const users = useSelector((s) => s.users?.items || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [convertModal, setConvertModal] = useState(null);


  /* ================= LOAD ================= */

  useEffect(() => {
    dispatch(fetchInquiries({
      q: query,
      label: labelFilter
    }));
  }, [dispatch, query, labelFilter]);


  /* ================= CREATE ================= */

  function handleCreate(form) {

    const toastId = "create-inquiry";

    toast.loading("Creating inquiry...", { id: toastId });

    dispatch(addInquiry(form))
      .unwrap()
      .then(() => {

        toast.success("Inquiry created successfully", { id: toastId });

        setModalOpen(false);

        dispatch(fetchInquiries({
          q: query,
          label: labelFilter
        }));

      })
      .catch((err) => {

        toast.error(
          err?.message || "Failed to create inquiry",
          { id: toastId }
        );

      });
  }


  /* ================= FILTER ================= */

  function applyLabelFilter(label) {
    dispatch(setInquiryLabel(label));
  }


  /* ================= ASSIGN ================= */

  function startAssign(id) {
    setAssignModal(id);
  }


  /* ================= UI ================= */

  return (
    <div className="space-y-4">

      <Card>

        <CardHeader>
          <div className="flex items-center justify-between">

            <CardTitle className="text-2xl font-semibold">
              Inquiry Management
            </CardTitle>

            <Button onClick={() => setModalOpen(true)}>
              + New Inquiry
            </Button>

          </div>
        </CardHeader>


        <CardContent className="space-y-4">

          {/* SEARCH + FILTER */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">

            <div className="relative flex-1">

              <InputGroup>

                <InputGroupInput
                  placeholder="Search name, email or phone..."
                  value={query}
                  onChange={(e) =>
                    dispatch(setInquiryQuery(e.target.value))
                  }
                />

                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>

                <InputGroupAddon align="inline-end">
                  {items.length} results
                </InputGroupAddon>

              </InputGroup>

            </div>


            <Select
              value={labelFilter || "ALL"}
              onValueChange={(v) =>
                applyLabelFilter(v === "ALL" ? "" : v)
              }
            >

              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>

              <SelectContent className="bg-white">

                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="SPAM">Spam</SelectItem>

              </SelectContent>

            </Select>

          </div>


          {loading && (
            <div className="text-sm text-gray-600">
              Loading inquiries...
            </div>
          )}


          {/* TABLE */}
          <div className="overflow-auto border rounded-md">

            <table className="w-full border-collapse text-sm">

              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr className="text-left">

                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Phone</th>
                  <th className="p-3 border-b">Source</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Assigned</th>
                  <th className="p-3 border-b w-64">Actions</th>

                </tr>
              </thead>

              <tbody>

                {items.map((i) => {

                  const assignedUser =
                    users.find((u) => u.id === i.assigned_to);

                  return (

                    <tr
                      key={i.id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="p-3 font-medium">
                        {i.first_name} {i.last_name}
                      </td>

                      <td className="p-3">
                        {i.email || "-"}
                      </td>

                      <td className="p-3">
                        {i.phone || "-"}
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">
                          {i.source}
                        </span>
                      </td>


                      <td className="p-3">

                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            i.status === "NEW"
                              ? "bg-blue-100 text-blue-700"
                              : i.status === "ASSIGNED"
                              ? "bg-purple-100 text-purple-700"
                              : i.status === "CONVERTED"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {i.status}
                        </span>

                      </td>


                      <td className="p-3">
                        {assignedUser
                          ? assignedUser.name
                          : "-"}
                      </td>


                      <td className="p-3 flex gap-2">

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => startAssign(i.id)}
                        >
                          Assign
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setConvertModal(i)}
                        >
                          Convert
                        </Button>

                      </td>

                    </tr>

                  );
                })}


                {items.length === 0 && !loading && (

                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 p-6"
                    >
                      No inquiries found
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>


      {/* CREATE INQUIRY */}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>

        <DialogContent className="max-w-xl bg-white">

          <DialogHeader>
            <DialogTitle>Create Inquiry</DialogTitle>
          </DialogHeader>

          <InquiryForm
            onSubmit={handleCreate}
            onCancel={() => setModalOpen(false)}
          />

        </DialogContent>

      </Dialog>


      {/* ASSIGN EXECUTIVE */}

      <Dialog open={!!assignModal} onOpenChange={() => setAssignModal(null)}>

        <DialogContent className="max-w-md bg-white">

          <DialogHeader>
            <DialogTitle>Assign Executive</DialogTitle>
          </DialogHeader>

          <AssignInquiryForm
            inquiryId={assignModal}
            onSubmit={({ inquiry_id, user_id }) => {

              const toastId = "assign-inquiry";

              toast.loading("Assigning executive...", { id: toastId });

              dispatch(
                assignToExecutive({
                  id: inquiry_id,
                  userId: user_id,
                })
              )
                .unwrap()
                .then(() => {

                  toast.success("Executive assigned", {
                    id: toastId
                  });

                  dispatch(fetchInquiries({
                    q: query,
                    label: labelFilter
                  }));

                })
                .catch((err) => {

                  toast.error(
                    err?.message || "Assign failed",
                    { id: toastId }
                  );

                });

              setAssignModal(null);

            }}

            onCancel={() => setAssignModal(null)}
          />

        </DialogContent>

      </Dialog>


      {/* CONVERT INQUIRY */}

      <Dialog open={!!convertModal} onOpenChange={() => setConvertModal(null)}>

        <DialogContent className="max-w-lg bg-white">

          <DialogHeader>
            <DialogTitle>Create Quotation</DialogTitle>
          </DialogHeader>

          {convertModal && (

            <ConvertInquiryForm
              inquiry={convertModal}

              onSubmit={(payload) => {

                const toastId = "convert-inquiry";

                toast.loading("Creating quotation...", { id: toastId });

                dispatch(convertToTour(payload))
                  .unwrap()
                  .then(() => {

                    toast.success(
                      "Quotation created successfully",
                      { id: toastId }
                    );

                    setConvertModal(null);

                    dispatch(fetchInquiries({
                      q: query,
                      label: labelFilter
                    }));

                  })
                  .catch((err) => {

                    toast.error(
                      err?.message || "Failed to create quotation",
                      { id: toastId }
                    );

                  });

              }}

              onCancel={() => setConvertModal(null)}
            />

          )}

        </DialogContent>

      </Dialog>

    </div>
  );
}