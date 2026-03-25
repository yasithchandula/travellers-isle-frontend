"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  Folder,
  FolderOpen,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Search,
  Table2,
  TrendingUp,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  MapPinned,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

/* =========================================================
   DUMMY DATA
========================================================= */

const quotationTreeData = [
  {
    year: 2026,
    months: [
      {
        key: "2026-03",
        month: "March",
        monthNumber: 3,
        quotations: [
          {
            id: 1001,
            quote_no: "QT-2026-03001",
            customer_name: "John Fernando",
            company: "Azure Travels",
            status: "DRAFT",
            start_city: "Colombo",
            end_city: "Ella",
            nights: 5,
            pax: 2,
            value: 2450,
            currency: "USD",
            created_at: "2026-03-05",
            updated_at: "2026-03-06",
          },
          {
            id: 1002,
            quote_no: "QT-2026-03002",
            customer_name: "Mia Perera",
            company: "Direct Client",
            status: "CONFIRMED",
            start_city: "Negombo",
            end_city: "Kandy",
            nights: 3,
            pax: 4,
            value: 1780,
            currency: "USD",
            created_at: "2026-03-07",
            updated_at: "2026-03-09",
          },
          {
            id: 1003,
            quote_no: "QT-2026-03003",
            customer_name: "Daniel Silva",
            company: "Greenline Holidays",
            status: "PENDING",
            start_city: "Colombo",
            end_city: "Yala",
            nights: 6,
            pax: 2,
            value: 3120,
            currency: "USD",
            created_at: "2026-03-10",
            updated_at: "2026-03-11",
          },
          {
            id: 1004,
            quote_no: "QT-2026-03004",
            customer_name: "Sophie Mendes",
            company: "Blue Lanka",
            status: "CANCELLED",
            start_city: "Bentota",
            end_city: "Galle",
            nights: 2,
            pax: 2,
            value: 890,
            currency: "USD",
            created_at: "2026-03-12",
            updated_at: "2026-03-12",
          },
        ],
      },
      {
        key: "2026-02",
        month: "February",
        monthNumber: 2,
        quotations: [
          {
            id: 980,
            quote_no: "QT-2026-02014",
            customer_name: "Emma Robertson",
            company: "Sunrise Vacations",
            status: "CONFIRMED",
            start_city: "Colombo",
            end_city: "Nuwara Eliya",
            nights: 4,
            pax: 3,
            value: 2280,
            currency: "USD",
            created_at: "2026-02-14",
            updated_at: "2026-02-16",
          },
          {
            id: 981,
            quote_no: "QT-2026-02015",
            customer_name: "Ishara Jayasinghe",
            company: "Direct Client",
            status: "DRAFT",
            start_city: "Kandy",
            end_city: "Sigiriya",
            nights: 3,
            pax: 6,
            value: 1940,
            currency: "USD",
            created_at: "2026-02-18",
            updated_at: "2026-02-18",
          },
        ],
      },
      {
        key: "2026-01",
        month: "January",
        monthNumber: 1,
        quotations: [
          {
            id: 950,
            quote_no: "QT-2026-01006",
            customer_name: "Olivia Tan",
            company: "Voyager Hub",
            status: "PENDING",
            start_city: "Negombo",
            end_city: "Mirissa",
            nights: 5,
            pax: 2,
            value: 2010,
            currency: "USD",
            created_at: "2026-01-08",
            updated_at: "2026-01-10",
          },
        ],
      },
    ],
  },
  {
    year: 2025,
    months: [
      {
        key: "2025-12",
        month: "December",
        monthNumber: 12,
        quotations: [
          {
            id: 901,
            quote_no: "QT-2025-12021",
            customer_name: "Noah Ibrahim",
            company: "Skyline Tours",
            status: "CONFIRMED",
            start_city: "Colombo",
            end_city: "Trincomalee",
            nights: 7,
            pax: 5,
            value: 4270,
            currency: "USD",
            created_at: "2025-12-03",
            updated_at: "2025-12-05",
          },
          {
            id: 902,
            quote_no: "QT-2025-12022",
            customer_name: "Alicia Gomez",
            company: "Direct Client",
            status: "CANCELLED",
            start_city: "Galle",
            end_city: "Ella",
            nights: 4,
            pax: 2,
            value: 1540,
            currency: "USD",
            created_at: "2025-12-09",
            updated_at: "2025-12-10",
          },
        ],
      },
      {
        key: "2025-11",
        month: "November",
        monthNumber: 11,
        quotations: [
          {
            id: 870,
            quote_no: "QT-2025-11011",
            customer_name: "Kasun Wijeratne",
            company: "Pearl Escapes",
            status: "DRAFT",
            start_city: "Kandy",
            end_city: "Pasikuda",
            nights: 5,
            pax: 4,
            value: 2660,
            currency: "USD",
            created_at: "2025-11-15",
            updated_at: "2025-11-16",
          },
        ],
      },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function flattenTree(tree) {
  return tree.flatMap((yearNode) =>
    yearNode.months.flatMap((monthNode) =>
      monthNode.quotations.map((q) => ({
        ...q,
        year: yearNode.year,
        month: monthNode.month,
        monthKey: monthNode.key,
      }))
    )
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "DRAFT":
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getStats(items) {
  return {
    total: items.length,
    confirmed: items.filter((i) => i.status === "CONFIRMED").length,
    pending: items.filter((i) => i.status === "PENDING").length,
    cancelled: items.filter((i) => i.status === "CANCELLED").length,
  };
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function QuotationManagerPage() {
  const [view, setView] = useState("explorer"); // explorer | table | cards
  const [explorerInnerView, setExplorerInnerView] = useState("table"); // table | cards
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMonthKey, setSelectedMonthKey] = useState("2026-03");
  const [expandedYears, setExpandedYears] = useState(() => ({
    2026: true,
    2025: true,
  }));

  const allQuotations = useMemo(() => flattenTree(quotationTreeData), []);
  const stats = useMemo(() => getStats(allQuotations), [allQuotations]);

  const selectedMonthNode = useMemo(() => {
    for (const year of quotationTreeData) {
      for (const month of year.months) {
        if (month.key === selectedMonthKey) {
          return {
            ...month,
            year: year.year,
            quotations: month.quotations.map((q) => ({
              ...q,
              year: year.year,
              month: month.month,
              monthKey: month.key,
            })),
          };
        }
      }
    }
    return null;
  }, [selectedMonthKey]);

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
        (sum, monthNode) => sum + monthNode.quotations.length,
        0
      );
      return acc;
    }, {});
  }, []);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background via-background to-muted/40 shadow-sm">
        <div className="absolute inset-0" />
        <div className="relative flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <FileText className="h-3.5 w-3.5" />
              Quotation Workspace
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Quotation Manager
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
                Browse quotations by year and month in explorer mode, or switch to
                flat table and card views for faster scanning and management.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              New Quotation
            </Button>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Quotations"
          value={stats.total}
          icon={FileText}
          hint="Across all years and months"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle2}
          hint="Ready / approved quotations"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock3}
          hint="Waiting for customer action"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          hint="Closed without conversion"
        />
      </section>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <Card className="rounded-2xl border shadow-sm">
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
                active={view === "table"}
                onClick={() => setView("table")}
                icon={Table2}
                label="Table"
              />
              <ToolbarToggleButton
                active={view === "cards"}
                onClick={() => setView("cards")}
                icon={LayoutGrid}
                label="Cards"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      {view === "explorer" ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* LEFT TREE */}
          <Card className="h-fit rounded-2xl border shadow-sm xl:sticky xl:top-6">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderOpen className="h-4 w-4" />
                Timeline Explorer
              </CardTitle>
              <CardDescription>
                Browse quotations by year and month like a folder explorer.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-3">
              <div className="space-y-2">
                {quotationTreeData.map((yearNode) => {
                  const isExpanded = !!expandedYears[yearNode.year];

                  return (
                    <div
                      key={yearNode.year}
                      className="overflow-hidden rounded-xl border bg-background"
                    >
                      <button
                        type="button"
                        onClick={() => toggleYear(yearNode.year)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left transition hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Folder className="h-4 w-4 text-sky-600" />
                          <span className="font-medium">{yearNode.year}</span>
                        </div>

                        <Badge variant="secondary" className="rounded-md">
                          {totalsByYear[yearNode.year] || 0}
                        </Badge>
                      </button>

                      {isExpanded && (
                        <div className="space-y-1 border-t bg-muted/15 p-2">
                          {yearNode.months.map((monthNode) => {
                            const count = monthNode.quotations.length;
                            const isActive = selectedMonthKey === monthNode.key;

                            return (
                              <button
                                key={monthNode.key}
                                type="button"
                                onClick={() => setSelectedMonthKey(monthNode.key)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition",
                                  isActive
                                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                    : "hover:bg-background"
                                )}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <CalendarDays className="h-4 w-4 shrink-0" />
                                  <span className="truncate text-sm font-medium">
                                    {monthNode.month}
                                  </span>
                                </div>

                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "rounded-md",
                                    isActive && "border-primary/30 text-primary"
                                  )}
                                >
                                  {count}
                                </Badge>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT CONTENT */}
          <div className="space-y-4">
            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md border bg-muted/50 px-2 py-1">
                      {selectedMonthNode?.year || "-"}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="rounded-md border bg-muted/50 px-2 py-1">
                      {selectedMonthNode?.month || "No month selected"}
                    </span>
                  </div>

                  <h2 className="text-lg font-semibold tracking-tight">
                    {selectedMonthNode?.month} {selectedMonthNode?.year}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {filteredExplorerItems.length} quotation
                    {filteredExplorerItems.length === 1 ? "" : "s"} in this folder
                  </p>
                </div>

                <div className="inline-flex rounded-xl border bg-muted/30 p-1">
                  <ToolbarToggleButton
                    active={explorerInnerView === "table"}
                    onClick={() => setExplorerInnerView("table")}
                    icon={Table2}
                    label="Table"
                  />
                  <ToolbarToggleButton
                    active={explorerInnerView === "cards"}
                    onClick={() => setExplorerInnerView("cards")}
                    icon={LayoutGrid}
                    label="Cards"
                  />
                </div>
              </CardContent>
            </Card>

            {explorerInnerView === "table" ? (
              <QuotationTable items={filteredExplorerItems} showTimeline={false} />
            ) : (
              <QuotationCards items={filteredExplorerItems} showTimeline={false} />
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

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ToolbarToggleButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-background shadow-sm ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function QuotationTable({ items, showTimeline = true }) {
  if (!items.length) {
    return <EmptyState title="No quotations found" description="Try changing the search or status filter." />;
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">Quotation List</CardTitle>
        <CardDescription>
          Structured list view for quick scanning, actions, and status tracking.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[150px]">Quotation</TableHead>
                <TableHead className="min-w-[180px]">Customer</TableHead>
                <TableHead className="min-w-[180px]">Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead className="text-right">Value</TableHead>
                {showTimeline && <TableHead>Timeline</TableHead>}
                <TableHead>Updated</TableHead>
                <TableHead className="w-[70px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.quote_no}</div>
                      <div className="text-xs text-muted-foreground">ID #{item.id}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{item.company}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="inline-flex items-center gap-2 text-sm">
                      <MapPinned className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">
                        {item.start_city} → {item.end_city}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("rounded-md font-medium", getStatusBadgeClass(item.status))}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.pax}</TableCell>
                  <TableCell>{item.nights}</TableCell>

                  <TableCell className="text-right font-medium">
                    {formatMoney(item.value, item.currency)}
                  </TableCell>

                  {showTimeline && (
                    <TableCell>
                      <div className="text-sm">
                        {item.month} {item.year}
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <div className="text-sm text-muted-foreground">{item.updated_at}</div>
                  </TableCell>

                  <TableCell className="text-right">
                    <QuotationActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function QuotationCards({ items, showTimeline = true }) {
  if (!items.length) {
    return <EmptyState title="No quotations found" description="Try changing the search or status filter." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="group rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.quote_no}</div>
                <div className="mt-1 text-xs text-muted-foreground">ID #{item.id}</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("rounded-md font-medium", getStatusBadgeClass(item.status))}
                >
                  {item.status}
                </Badge>
                <QuotationActions />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-base font-semibold">{item.customer_name}</div>
                <div className="text-sm text-muted-foreground">{item.company}</div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <MapPinned className="h-3.5 w-3.5" />
                  Route
                </div>
                <div className="font-medium">
                  {item.start_city} → {item.end_city}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MiniInfo icon={Users} label="Pax" value={item.pax} />
                <MiniInfo icon={CalendarDays} label="Nights" value={item.nights} />
                <MiniInfo icon={TrendingUp} label="Value" value={formatMoney(item.value, item.currency)} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
                {showTimeline ? (
                  <div className="rounded-md border bg-background px-2 py-1">
                    {item.month} {item.year}
                  </div>
                ) : (
                  <div className="rounded-md border bg-background px-2 py-1">
                    {item.created_at}
                  </div>
                )}

                <div>Updated: {item.updated_at}</div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" className="rounded-lg">
                  Open
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg">
                  Duplicate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="truncate text-sm font-semibold">{value}</div>
    </div>
  );
}

function QuotationActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileText className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState({ title, description }) {
  return (
    <Card className="rounded-2xl border border-dashed shadow-sm">
      <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 rounded-2xl border bg-muted/40 p-4">
          <FolderOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   FILTERING
========================================================= */

function filterItems(items, search, statusFilter) {
  let result = [...items];

  if (statusFilter && statusFilter !== "ALL") {
    result = result.filter((item) => item.status === statusFilter);
  }

  const q = search.trim().toLowerCase();
  if (q) {
    result = result.filter((item) => {
      const haystack = [
        item.quote_no,
        item.customer_name,
        item.company,
        item.start_city,
        item.end_city,
        item.status,
        item.month,
        item.year,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  return result.sort((a, b) => {
    if (a.updated_at > b.updated_at) return -1;
    if (a.updated_at < b.updated_at) return 1;
    return b.id - a.id;
  });
}