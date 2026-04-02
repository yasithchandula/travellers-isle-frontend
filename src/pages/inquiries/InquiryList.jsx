import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal, Users, CheckCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
} from "../../app/slices/inquirySlice";

import { createQuotationFromInquiry } from "../../app/slices/quotationSlice";

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
} from "@/components/ui/dropdown-menu";

/* reusable */
import EntityHeroHeader from "@/components/common/EntityHeroHeader";
import StatCard from "@/components/common/StatCard";
import ManagerToolbar from "@/components/common/ManagerToolbar";
import CardGrid from "@/components/common/CardGrid";
import EntityTable from "@/components/common/EntityTable";
import PaginationBar from "@/components/common/PaginationBar";

export default function InquiryList() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((s) => s.users?.items || []);

  const [modalOpen, setModalOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [convertModal, setConvertModal] = useState(null);

  const [view, setView] = useState("table");
  const [limit, setLimit] = useState(10);

  const {
    items = [],
    loading,
    query,
    labelFilter,
    page,
    totalPages,
    total
  } = useSelector((s) => s.inquiries);

  /* LOAD */

  useEffect(() => {
    dispatch(fetchInquiries({
      q: query,
      label: labelFilter,
      page,
      limit
    }));
  }, [dispatch, query, labelFilter, page, limit]);


  /* FILTER */

  const filtered = useMemo(() => items, [items]);


  /* CREATE */

  function handleCreate(form) {

    const toastId = "create-inquiry";

    toast.loading("Creating inquiry...", { id: toastId });

    dispatch(addInquiry(form))
      .unwrap()
      .then(() => {

        toast.success("Inquiry created", { id: toastId });

        setModalOpen(false);

        dispatch(fetchInquiries({
          q: query,
          label: labelFilter
        }));

      })
      .catch((err) => {
        toast.error(err?.message || "Create failed", { id: toastId });
      });
  }

  function getAssignedName(id) {
    return users.find((u) => u.id === id)?.name || "-";
  }

  return (
    <div className="space-y-6">

      {/* HERO */}
      <EntityHeroHeader
        title="Inquiry Management"
        description="Manage customer inquiries and conversions."
        buttonText="New Inquiry"
        onCreate={() => setModalOpen(true)}
      />

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total"
          value={total}
          icon={FileText}
        />

        <StatCard
          title="Assigned"
          value={items.filter(i => i.status === "ASSIGNED").length}
          icon={Users}
        />

        <StatCard
          title="Converted"
          value={items.filter(i => i.status === "CONVERTED").length}
          icon={CheckCircle}
        />

      </div>

      {/* TOOLBAR */}
      <ManagerToolbar
        title="Browse inquiries"
        description="Search and filter inquiries."

        search={query}
        onSearchChange={(v) => dispatch(setInquiryQuery(v))}

        tagFilter={labelFilter || "all"}
        onTagChange={(v) => dispatch(setInquiryLabel(v === "all" ? "" : v))}
        tags={["NEW", "ASSIGNED", "CONVERTED", "SPAM"]}

        limit={limit}
        onLimitChange={setLimit}

        view={view}
        setView={setView}

        loading={loading}
        resultCount={total}
      />

      {/* VIEW */}

      {view === "card" ? (

        <CardGrid>

          {items.map((i) => (

            <div key={i.id} className="border rounded-xl p-4 shadow-sm">

              <div className="font-medium">
                {i.first_name} {i.last_name}
              </div>

              <div className="text-sm text-muted-foreground">
                {i.email}
              </div>

              <div className="mt-2 flex gap-2">

                <Badge>{i.source}</Badge>

                <Badge variant="outline">
                  {i.status}
                </Badge>

              </div>

              <div className="mt-3 text-sm">
                Assigned: {getAssignedName(i.assigned_to)}
              </div>

            </div>

          ))}

        </CardGrid>

      ) : (

        <EntityTable

          header={
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Arrival Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          }

          body={

            items.map((i) => (

              <TableRow key={i.id}>

                <TableCell className="font-medium">
                  {i.first_name} {i.last_name}
                </TableCell>

                <TableCell>{i.email || "-"}</TableCell>

                <TableCell>{i.phone || "-"}</TableCell>

                <TableCell>
                  {i.arrival_date ? new Date(i.arrival_date).toLocaleDateString() : "-"}
                </TableCell>

                <TableCell>
                  <Badge>{i.source}</Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">{i.status}</Badge>
                </TableCell>

                <TableCell>
                  {getAssignedName(i.assigned_to)}
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
                        onClick={() => setAssignModal(i.id)}
                      >
                        Assign
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          if (i.quotation_id && i.quotation_id > 0) {
                            navigate(`/quotations/${i.quotation_id}`);
                          } else {
                            setConvertModal(i); // open modal
                          }
                        }}
                      >
                        Convert
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
          dispatch(fetchInquiries({
            q: query,
            label: labelFilter,
            page: p,
            limit
          }))
        }
      />

      {/* CREATE */}
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

      {/* ASSIGN */}
      <Dialog open={!!assignModal} onOpenChange={() => setAssignModal(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Assign Executive</DialogTitle>
          </DialogHeader>

          <AssignInquiryForm
            inquiryId={assignModal}
            onSubmit={({ inquiry_id, user_id }) => {

              dispatch(assignToExecutive({
                id: inquiry_id,
                userId: user_id,
              }));

              setAssignModal(null);
            }}
            onCancel={() => setAssignModal(null)}
          />
        </DialogContent>
      </Dialog>

      {/* CONVERT */}
      <Dialog open={!!convertModal} onOpenChange={() => setConvertModal(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Create Quotation</DialogTitle>
          </DialogHeader>

          {convertModal && (
            <ConvertInquiryForm
              inquiry={convertModal}
              onSubmit={(payload) => {

                dispatch(createQuotationFromInquiry(payload))
                  .unwrap()
                  .then((res) => {

                    const id = res?.data?.quotation_id;

                    if (!id) {
                      toast.error("Invalid quotation response");
                      return;
                    }

                    setConvertModal(null);

                    navigate(`/quotations/${id}`);
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