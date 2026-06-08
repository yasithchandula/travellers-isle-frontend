"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  PanelLeft,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchQuotationSummaryTree,
  fetchMonthlyQuotationDetails,
} from "@/app/slices/quotationSlice";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  flattenTree,
  filterItems,
  getMonthNodeByKey,
  getSummaryStats,
  getYearNode,
} from "./utils/quotationManager.helpers";

import StatCard from "./components/StatCard";
import ToolbarToggleButton from "./components/ToolbarToggleButton";
import QuotationTable from "./components/QuotationTable";
import QuotationCards from "./components/QuotationCards";
import ExplorerSidebar from "./components/ExplorerSidebar";
import ExplorerHeader from "./components/ExplorerHeader";
import DriveSidebar from "./components/DriveSidebar";
import DriveHeader from "./components/DriveHeader";
import DriveYearGrid from "./components/drive/DriveYearGrid";
import DriveYearList from "./components/drive/DriveYearList";
import DriveMonthGrid from "./components/drive/DriveMonthGrid";
import DriveMonthList from "./components/drive/DriveMonthList";
import DriveQuotationGrid from "./components/drive/DriveQuotationGrid";
import DriveQuotationList from "./components/drive/DriveQuotationList";
import DriveInquiryGrid from "./components/drive/DriveInquiryGrid";
import DriveInquiryList from "./components/drive/DriveInquiryList";

/* ===============================
   TRANSFORMERS
================================ */

function buildInitialTree(summaryPayload) {
  const years = summaryPayload?.data?.years || [];

  return years.map((y) => ({
    year: y.year,
    total: y.total_count || 0,
    months: (y.months || []).map((m) => ({
      key: `${y.year}-${String(m.month).padStart(2, "0")}`,
      month: m.month_name,
      monthNumber: m.month,
      quotations: [],
      quotation_count: m.quotation_count || 0,
    })),
  }));
}

function fillMonthData(tree, year, month, inquiries) {
  return tree.map((y) => {
    if (y.year !== year) return y;

    return {
      ...y,
      months: y.months.map((m) => {
        if (m.monthNumber !== month) return m;

        const inquiryFolders = (inquiries || []).map((inq) => ({
          inquiry_id: inq.inquiry_id,
          inquiry_number: inq.inquiry_number,
          guest_name: inq.guest_name,
          arrival_date: inq.arrival_date,

          quotations: (inq.quotations || []).map((q) => ({
            id: q.id,
            quote_no: q.quotation_number,
            status: q.status,
            pax: q.pax_adults,
            created_at: inq.arrival_date,
          })),
        }));

        return {
          ...m,
          inquiries: inquiryFolders,
          quotations: inquiryFolders.flatMap((i) => i.quotations), // keep for flat views
          quotation_count:
            inquiryFolders.reduce((sum, i) => sum + i.quotations.length, 0) ||
            m.quotation_count ||
            0,
        };
      }),
    };
  });
}

/* ===============================
   SKELETONS
================================ */

function ExplorerSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl border bg-muted/40 animate-pulse"
        />
      ))}
    </div>
  );
}

function DriveMonthSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl border bg-muted/40 animate-pulse"
        />
      ))}
    </div>
  );
}

function DriveRootSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-2xl border bg-muted/40 animate-pulse"
        />
      ))}
    </div>
  );
}

/* ===============================
   COMPONENT
================================ */

export default function QuotationManagerPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quotationTreeData, setQuotationTreeData] = useState([]);

  const [view, setView] = useState("explorer"); // explorer | drive | table | cards
  const [explorerInnerView, setExplorerInnerView] = useState("table"); // table | cards
  const [driveInnerView, setDriveInnerView] = useState("grid"); // grid | list
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMonthKey, setSelectedMonthKey] = useState(null);
  const [expandedYears, setExpandedYears] = useState({});
  const [drivePath, setDrivePath] = useState({
    year: null,
    monthKey: null,
    inquiry: null,
  });

  const [loadedMonths, setLoadedMonths] = useState(() => new Set());
  const [loadingMonths, setLoadingMonths] = useState(() => new Set());
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);

  const isMonthLoading = (key) => Boolean(key) && loadingMonths.has(key);

  const fetchMonthIfNeeded = async (year, monthKey) => {
    const [, m] = monthKey.split("-");

    if (loadedMonths.has(monthKey)) return;
    if (loadingMonths.has(monthKey)) return;

    setLoadingMonths((prev) => {
      const next = new Set(prev);
      next.add(monthKey);
      return next;
    });

    try {
      const res = await dispatch(
        fetchMonthlyQuotationDetails({ year: Number(year), month: Number(m) })
      );

      const inquiries = res?.payload?.data?.inquiries || [];

      setQuotationTreeData((prev) =>
        fillMonthData(prev, Number(year), Number(m), inquiries)
      );

      setLoadedMonths((prev) => {
        const next = new Set(prev);
        next.add(monthKey);
        return next;
      });
    } finally {
      setLoadingMonths((prev) => {
        const next = new Set(prev);
        next.delete(monthKey);
        return next;
      });
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setSummaryLoading(true);

      try {
        const res = await dispatch(fetchQuotationSummaryTree());
        const tree = buildInitialTree(res?.payload);

        setSummaryData(res?.payload);

        if (!active) return;

        setQuotationTreeData(tree);

        const initialExpanded = tree.reduce((acc, yearNode) => {
          acc[yearNode.year] = true;
          return acc;
        }, {});
        setExpandedYears(initialExpanded);

        if (tree.length && tree[0].months.length) {
          const firstYear = tree[0].year;
          const firstMonth = tree[0].months[0];

          setSelectedMonthKey(firstMonth.key);

          fetchMonthIfNeeded(firstYear, firstMonth.key);

          setTimeout(() => {
            tree[0].months.slice(1, 3).forEach((monthNode) => {
              fetchMonthIfNeeded(firstYear, monthNode.key);
            });
          }, 300);
        }
      } finally {
        if (active) setSummaryLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const allQuotations = useMemo(
    () => flattenTree(quotationTreeData),
    [quotationTreeData]
  );

  const stats = useMemo(() => getSummaryStats(summaryData), [summaryData]);


  const selectedMonthNode = useMemo(() => {
    return getMonthNodeByKey(quotationTreeData, selectedMonthKey);
  }, [quotationTreeData, selectedMonthKey]);

  const filteredExplorerItems = useMemo(() => {
    const items = selectedMonthNode?.quotations || [];
    return filterItems(items, search, statusFilter);
  }, [selectedMonthNode, search, statusFilter]);

  const filteredFlatItems = useMemo(() => {
    return filterItems(allQuotations, search, statusFilter);
  }, [allQuotations, search, statusFilter]);

  const totalsByYear = useMemo(() => {
    return quotationTreeData.reduce((acc, yearNode) => {
      acc[yearNode.year] = yearNode.months.reduce(
        (sum, monthNode) =>
          sum +
          (typeof monthNode.quotation_count === "number"
            ? monthNode.quotation_count
            : (monthNode.quotations || []).length),
        0
      );
      return acc;
    }, {});
  }, [quotationTreeData]);

  const driveYearNode = useMemo(() => {
    if (!drivePath.year) return null;
    return getYearNode(quotationTreeData, drivePath.year);
  }, [quotationTreeData, drivePath.year]);

  const driveMonthNode = useMemo(() => {
    if (!drivePath.monthKey) return null;
    return getMonthNodeByKey(quotationTreeData, drivePath.monthKey);
  }, [quotationTreeData, drivePath.monthKey]);

  const filteredDriveMonthItems = useMemo(() => {
    if (!driveMonthNode) return [];
    return filterItems(driveMonthNode.quotations || [], search, statusFilter);
  }, [driveMonthNode, search, statusFilter]);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const openMonth = (monthKey) => {
    setSelectedMonthKey(monthKey);
    const [y] = monthKey.split("-");
    fetchMonthIfNeeded(Number(y), monthKey);
  };

  const openDriveRoot = () => {
    setDrivePath({ year: null, monthKey: null });
  };

  const openDriveYear = (year) => {
    setDrivePath({ year, monthKey: null });
  };

  const openDriveMonth = (year, monthKey) => {
    setDrivePath({ year, monthKey });
    fetchMonthIfNeeded(year, monthKey);
  };

  // const goDriveBack = () => {
  //   if (drivePath.monthKey) {
  //     setDrivePath((prev) => ({ ...prev, monthKey: null }));
  //     return;
  //   }
  //   if (drivePath.year) {
  //     setDrivePath({ year: null, monthKey: null });
  //   }
  // };

  const openDriveInquiry = (inq) => {
    setDrivePath((prev) => ({
      ...prev,
      inquiry: inq,
    }));
  };

  const goDriveBack = () => {
    if (drivePath.inquiry) {
      setDrivePath((prev) => ({ ...prev, inquiry: null }));
      return;
    }
    if (drivePath.monthKey) {
      setDrivePath((prev) => ({ ...prev, monthKey: null }));
      return;
    }
    if (drivePath.year) {
      setDrivePath({ year: null, monthKey: null, inquiry: null });
    }
  };

  const explorerLoading =
    summaryLoading || (selectedMonthKey && isMonthLoading(selectedMonthKey));

  const driveMonthLoading =
    drivePath.monthKey && isMonthLoading(drivePath.monthKey);

  return (
    <div className="space-y-6">
      <section className="border-b pb-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Quotation Manager
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Browse quotations by year and month in explorer mode, switch to a
                Drive-style folder experience, or use flat table and card views.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="gap-2" onClick={() => navigate(`/inquiries/`)}>
              <Plus className="h-4 w-4" />
              New Quotation
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total"
          value={stats.total}
          icon={FileText}
          hint="Across all years and months"
        />

        <StatCard
          title="Draft"
          value={stats.draft}
          icon={FileText}
          hint="Not finalized yet"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock3}
          hint="Waiting for approval"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          hint="Successfully converted"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          hint="Closed without conversion"
        />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by quotation no, customer, route, company..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border bg-muted/30 p-1">
              <ToolbarToggleButton
                active={view === "explorer"}
                onClick={() => setView("explorer")}
                icon={FolderOpen}
                label="Explorer"
              />
              <ToolbarToggleButton
                active={view === "drive"}
                onClick={() => setView("drive")}
                icon={PanelLeft}
                label="Drive"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "explorer" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <ExplorerSidebar
            tree={quotationTreeData}
            expandedYears={expandedYears}
            toggleYear={toggleYear}
            totalsByYear={totalsByYear}
            selectedMonthKey={selectedMonthKey}
            setSelectedMonthKey={openMonth}
          />

          <div className="space-y-4">
            <ExplorerHeader
              selectedMonthNode={selectedMonthNode}
              filteredExplorerItems={filteredExplorerItems}
              explorerInnerView={explorerInnerView}
              setExplorerInnerView={setExplorerInnerView}
            />

            {explorerLoading ? (
              <ExplorerSkeleton />
            ) : explorerInnerView === "table" ? (
              <QuotationTable items={filteredExplorerItems} showTimeline={false} />
            ) : (
              <QuotationCards items={filteredExplorerItems} showTimeline={false} />
            )}
          </div>
        </div>
      ) : view === "drive" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <DriveSidebar
            tree={quotationTreeData}
            drivePath={drivePath}
            openDriveRoot={openDriveRoot}
            openDriveYear={openDriveYear}
            openDriveMonth={openDriveMonth}
          />

          <div className="space-y-4">
            <DriveHeader
              drivePath={drivePath}
              driveMonthNode={driveMonthNode}
              driveYearNode={driveYearNode}
              filteredDriveMonthItems={filteredDriveMonthItems}
              openDriveRoot={openDriveRoot}
              openDriveYear={openDriveYear}
              goDriveBack={goDriveBack}
              driveInnerView={driveInnerView}
              setDriveInnerView={setDriveInnerView}
            />

            {!drivePath.year ? (
              summaryLoading ? (
                <DriveRootSkeleton />
              ) : driveInnerView === "grid" ? (
                <DriveYearGrid items={quotationTreeData} onOpenYear={openDriveYear} />
              ) : (
                <DriveYearList items={quotationTreeData} onOpenYear={openDriveYear} />
              )
            ) : !driveMonthNode ? (
              driveInnerView === "grid" ? (
                <DriveMonthGrid
                  yearNode={driveYearNode}
                  onOpenMonth={(monthKey) => openDriveMonth(drivePath.year, monthKey)}
                />
              ) : (
                <DriveMonthList
                  yearNode={driveYearNode}
                  onOpenMonth={(monthKey) => openDriveMonth(drivePath.year, monthKey)}
                />
              )
            ) : !drivePath.inquiry ? (
              driveInnerView === "grid" ? (
                <DriveInquiryGrid
                  inquiries={driveMonthNode.inquiries || []}
                  onOpenInquiry={openDriveInquiry}
                />
              ) : (
                <DriveInquiryList
                  inquiries={driveMonthNode.inquiries || []}
                  onOpenInquiry={openDriveInquiry}
                />
              )

            ) : driveInnerView === "grid" ? (
              <DriveQuotationGrid items={drivePath.inquiry.quotations} />
            ) : (
              <DriveQuotationList items={drivePath.inquiry.quotations} />
            )}
          </div>
        </div>
      ) : view === "table" ? (
        <QuotationTable items={filteredFlatItems} showTimeline />
      ) : (
        <QuotationCards items={filteredFlatItems} showTimeline />
      )}
    </div>
  );
}
