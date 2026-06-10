import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Users,
  MapPinned,
  Building2,
  Compass,
  TrendingUp,
  Clock3,
  ArrowRight,
  ShieldCheck,
  Activity,
  BadgeCheck,
  TriangleAlert,
  FolderKanban,
  Route,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/common/LoadingStates";

import { fetchUsers } from "@/app/slices/userSlice";
import { fetchCities } from "@/app/slices/citySlice";
import { fetchHotels } from "@/app/slices/hotelSlice";
import { fetchExcursions } from "@/app/slices/excursionSlice";
import { fetchInquiries } from "@/app/slices/inquirySlice";
import { fetchStandardDescriptions } from "@/app/slices/standardDescriptionSlice";

/* =========================
   SMALL UI HELPERS
========================= */

function EnterpriseStatCard({
  title,
  value,
  icon: Icon,
  subtle,
  breakdown = [],
  tone = "default",
}) {
  return (
    <Card className="transition hover:bg-muted/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            {subtle ? (
              <p className="text-xs text-muted-foreground">{subtle}</p>
            ) : null}
          </div>

          <div
            className={cn(
              "rounded-md border p-3",
              tone === "success" && "bg-emerald-500/10 text-emerald-700",
              tone === "warning" && "bg-amber-500/10 text-amber-700",
              tone === "info" && "bg-sky-500/10 text-sky-700",
              tone === "default" && "bg-accent text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {breakdown.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {breakdown.map((item) => (
              <Badge
                key={item.label}
                variant="secondary"
                className="rounded-full"
              >
                {item.label}: {item.value}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, description, action, children, className }) {
  return (
    <Card className={className}>
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {action ? action : null}
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">{children}</CardContent>
    </Card>
  );
}

function EmptyState({ title, description, icon: Icon = FolderKanban }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
      <div className="rounded-md border bg-muted/50 p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

/* =========================
   DASHBOARD BLOCKS
========================= */

function InquiryFunnelCard({ stats }) {
  const base = Math.max(stats.total || 0, 1);

  const rows = [
    {
      label: "New",
      value: stats.new,
      percent: Math.round((stats.new / base) * 100),
    },
    {
      label: "Assigned",
      value: stats.assigned,
      percent: Math.round((stats.assigned / base) * 100),
    },
    {
      label: "Converted",
      value: stats.converted,
      percent: Math.round((stats.converted / base) * 100),
    },
    {
      label: "Spam",
      value: stats.spam,
      percent: Math.round((stats.spam / base) * 100),
    },
  ];

  return (
    <SectionCard
      title="Inquiry Funnel"
      description="Lead flow across the inquiry pipeline"
      action={
        <Badge variant="secondary" className="rounded-full">
          Total: {stats.total}
        </Badge>
      }
    >
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="text-muted-foreground">
                {row.value} · {row.percent}%
              </span>
            </div>
            <Progress value={row.percent} className="h-2.5 rounded-full" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function LatestInquiriesCard({ inquiries }) {
  const getStatusTone = (status) => {
    const s = (status || "new").toLowerCase();
    if (s === "converted") return "bg-emerald-100 text-emerald-800";
    if (s === "assigned") return "bg-sky-100 text-sky-800";
    if (s === "spam") return "bg-rose-100 text-rose-800";
    return "bg-muted text-foreground";
  };

  return (
    <SectionCard
      title="Latest Inquiries"
      description="Most recent customer leads and travel requests"
      action={
        <Button variant="outline" className="rounded-xl">
          View all
        </Button>
      }
      className="lg:col-span-2"
    >
      {inquiries.length === 0 ? (
        <EmptyState
          title="No inquiries available"
          description="Latest inquiries will appear here once new leads arrive."
          icon={Mail}
        />
      ) : (
        <div className="space-y-3">
          {inquiries.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/40"
            >
              <div className="min-w-0 space-y-1">
                <div className="truncate font-medium">
                  {item.name || "Unnamed Inquiry"}
                </div>

                <div className="truncate text-sm text-muted-foreground">
                  {item.email || "No email"}
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {item.destination ? (
                    <Badge variant="secondary" className="rounded-full">
                      {item.destination}
                    </Badge>
                  ) : null}

                  {item.travel_date ? (
                    <Badge variant="outline" className="rounded-full">
                      {item.travel_date}
                    </Badge>
                  ) : null}

                  {item.phone ? (
                    <Badge variant="outline" className="rounded-full">
                      {item.phone}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end gap-2">
                <Badge className={cn("rounded-full border", getStatusTone(item.status))}>
                  {item.status || "new"}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl opacity-70 transition group-hover:opacity-100"
                >
                  Open
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function TopDestinationsCard({ inquiries }) {
  const destinations = useMemo(() => {
    const map = new Map();

    inquiries.forEach((item) => {
      const key = item.destination?.trim();
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [inquiries]);

  return (
    <SectionCard
      title="Top Destinations"
      description="Most requested destinations from inquiries"
      className="h-full"
    >
      {destinations.length === 0 ? (
        <EmptyState
          title="No destination trends yet"
          description="Destination demand will show here after inquiries include locations."
          icon={Route}
        />
      ) : (
        <div className="space-y-3">
          {destinations.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-muted/50 text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    High intent destination
                  </div>
                </div>
              </div>

              <Badge className="rounded-full">{item.count}</Badge>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function RecentActivityCard({ inquiries, excursions, hotels, cities }) {
  const activities = [
    ...inquiries.slice(0, 3).map((item) => ({
      id: `inq-${item.id}`,
      label: `${item.name || "A lead"} submitted an inquiry`,
      sub: item.destination || item.email || "Inquiry activity",
      icon: Mail,
    })),
    ...excursions.slice(0, 1).map((item) => ({
      id: `exc-${item.id}`,
      label: `${item.title || "An excursion"} is in catalog`,
      sub: item.status || "Excursion status updated",
      icon: Compass,
    })),
    ...hotels.slice(0, 1).map((item) => ({
      id: `hotel-${item.id}`,
      label: `${item.name || "A hotel"} is available`,
      sub: item.status || "Hotel inventory status",
      icon: Building2,
    })),
    ...cities.slice(0, 1).map((item) => ({
      id: `city-${item.id}`,
      label: `${item.name || "A city"} is configured`,
      sub: item.country || item.status || "Destination coverage",
      icon: MapPinned,
    })),
  ].slice(0, 6);

  return (
    <SectionCard
      title="Recent Activity"
      description="A live operational pulse across modules"
    >
      {activities.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Once your modules receive data, activity will appear here."
          icon={Activity}
        />
      ) : (
        <div className="space-y-4">
          {activities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-3">
                <div className="mt-0.5 rounded-md border bg-muted/50 p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}

function ModuleHealthCard({
  cityStats,
  hotelStats,
  excursionStats,
  inquiryStats,
  standardDescriptionStats,
}) {
  const rows = [
    {
      label: "Cities coverage",
      value: cityStats.total,
      healthy: cityStats.active,
      note: `${cityStats.active} active / ${cityStats.inactive} inactive`,
    },
    {
      label: "Hotel inventory",
      value: hotelStats.total,
      healthy: hotelStats.active,
      note: `${hotelStats.active} active / ${hotelStats.inactive} inactive`,
    },
    {
      label: "Excursion content",
      value: excursionStats.total,
      healthy: excursionStats.published,
      note: `${excursionStats.published} published / ${excursionStats.draft} draft`,
    },
    {
      label: "Lead pipeline",
      value: inquiryStats.total,
      healthy: inquiryStats.assigned + inquiryStats.converted,
      note: `${inquiryStats.assigned} assigned / ${inquiryStats.converted} converted`,
    },
    {
      label: "Standard descriptions",
      value: standardDescriptionStats.total,
      healthy: standardDescriptionStats.approved,
      note: `${standardDescriptionStats.approved} approved / ${standardDescriptionStats.draft} draft`,
    },
  ];

  return (
    <SectionCard
      title="Module Health"
      description="Readiness and quality snapshot across manager modules"
    >
      <div className="space-y-4">
        {rows.map((row) => {
          const percent = row.value
            ? Math.round((row.healthy / row.value) * 100)
            : 0;

          return (
            <div key={row.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{row.label}</span>
                <span className="text-muted-foreground">{percent}% healthy</span>
              </div>
              <Progress value={percent} className="h-2.5 rounded-full" />
              <div className="text-xs text-muted-foreground">{row.note}</div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function EnterpriseInsightsCard({
  inquiryStats,
  excursionStats,
  hotelStats,
  cityStats,
  standardDescriptionStats,
}) {
  const conversionRate = Math.round(
    ((inquiryStats.converted || 0) / Math.max(inquiryStats.total || 1, 1)) * 100
  );

  const assignmentRate = Math.round(
    (((inquiryStats.assigned || 0) + (inquiryStats.converted || 0)) /
      Math.max(inquiryStats.total || 1, 1)) *
      100
  );

  const contentReadiness = Math.round(
    (((excursionStats.published || 0) + (standardDescriptionStats.approved || 0)) /
      Math.max(
        (excursionStats.total || 0) + (standardDescriptionStats.total || 0),
        1
      )) *
      100
  );

  return (
    <SectionCard
      title="Executive Insights"
      description="High-signal business and operational indicators"
      className="bg-card"
    >
      <div className="space-y-3 text-sm">
        <div className="rounded-lg border bg-background/70 p-4">
          <div className="flex items-center gap-2 font-medium">
            <TrendingUp className="h-4 w-4" />
            Lead conversion
          </div>
          <div className="mt-1 text-muted-foreground">
            {conversionRate}% of inquiries are converted into tours.
          </div>
        </div>

        <div className="rounded-lg border bg-background/70 p-4">
          <div className="flex items-center gap-2 font-medium">
            <BadgeCheck className="h-4 w-4" />
            Handling efficiency
          </div>
          <div className="mt-1 text-muted-foreground">
            {assignmentRate}% of inquiries are already assigned or converted.
          </div>
        </div>

        <div className="rounded-lg border bg-background/70 p-4">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4" />
            Content readiness
          </div>
          <div className="mt-1 text-muted-foreground">
            {contentReadiness}% of excursion and standard-description content is approved or published.
          </div>
        </div>

        <div className="rounded-lg border bg-background/70 p-4">
          <div className="flex items-center gap-2 font-medium">
            <TriangleAlert className="h-4 w-4" />
            Watch area
          </div>
          <div className="mt-1 text-muted-foreground">
            {hotelStats.inactive} inactive hotels and {cityStats.inactive} inactive cities may impact itinerary quality.
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function QuickActionsCard() {
  return (
    <SectionCard
      title="Quick Actions"
      description="Jump into the most frequent workflows"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Button className="h-10 justify-start">+ New Inquiry</Button>
        <Button variant="secondary" className="h-10 justify-start">
          + Add City
        </Button>
        <Button variant="secondary" className="h-10 justify-start">
          + Add Hotel
        </Button>
        <Button variant="secondary" className="h-10 justify-start">
          + Add Excursion
        </Button>
        <Button variant="outline" className="h-10 justify-start">
          View Quotations
        </Button>
        <Button variant="outline" className="h-10 justify-start">
          Review Descriptions
        </Button>
      </div>
    </SectionCard>
  );
}

function OperationsSummaryCard({
  users,
  cities,
  hotels,
  excursions,
  inquiries,
  standardDescriptions,
}) {
  const rows = [
    { label: "Users", value: users.length, icon: Users },
    { label: "Cities", value: cities.length, icon: MapPinned },
    { label: "Hotels", value: hotels.length, icon: Building2 },
    { label: "Excursions", value: excursions.length, icon: Compass },
    { label: "Inquiries", value: inquiries.length, icon: Mail },
    {
      label: "Descriptions",
      value: standardDescriptions.length,
      icon: FolderKanban,
    },
  ];

  return (
    <SectionCard
      title="Operations Summary"
      description="Cross-module volume snapshot"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md border bg-muted/50 p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">{row.label}</span>
              </div>

              <span className="text-lg font-semibold">{row.value}</span>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* =========================
   MAIN DASHBOARD
========================= */

export default function EnterpriseDashboardPage() {
  const dispatch = useDispatch();
  const [initialLoading, setInitialLoading] = useState(true);

  const usersState = useSelector((s) => s.users || {});
  const citiesState = useSelector((s) => s.cities || {});
  const hotelsState = useSelector((s) => s.hotels || {});
  const excursionsState = useSelector((s) => s.excursions || {});
  const inquiriesState = useSelector((s) => s.inquiries || {});
  const standardDescriptionsState = useSelector(
    (s) => s.standardDescriptions || {}
  );

  const users = usersState.items || [];
  const cities = citiesState.items || [];
  const hotels = hotelsState.items || [];
  const excursions = excursionsState.items || [];
  const inquiries = inquiriesState.items || [];
  const standardDescriptions = standardDescriptionsState.items || [];

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      dispatch(fetchUsers()),
      dispatch(fetchCities({ page: 1, limit: 50 })),
      dispatch(fetchHotels({ page: 1, limit: 50 })),
      dispatch(fetchExcursions({ page: 1, limit: 50 })),
      dispatch(fetchInquiries({ page: 1, limit: 50 })),
      dispatch(fetchStandardDescriptions({ page: 1, limit: 50 })),
    ]).finally(() => {
      if (active) setInitialLoading(false);
    });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const cityStats = useMemo(() => {
    const inactive = cities.filter(
      (item) => String(item.status || "").toLowerCase() === "inactive"
    ).length;

    return {
      total: cities.length,
      inactive,
      active: cities.length - inactive,
    };
  }, [cities]);

  const hotelStats = useMemo(() => {
    const inactive = hotels.filter(
      (item) => String(item.status || "").toLowerCase() === "inactive"
    ).length;

    return {
      total: hotels.length,
      inactive,
      active: hotels.length - inactive,
    };
  }, [hotels]);

  const excursionStats = useMemo(() => {
    const published = excursions.filter(
      (item) => String(item.status || "").toUpperCase() === "PUBLISHED"
    ).length;

    const draft = excursions.filter(
      (item) => String(item.status || "").toUpperCase() === "DRAFT"
    ).length;

    const featured = excursions.filter(
      (item) => !!item.is_featured_on_home
    ).length;

    return {
      total: excursions.length,
      published,
      draft,
      featured,
    };
  }, [excursions]);

  const inquiryStats = useMemo(() => {
    const assigned = inquiries.filter(
      (item) => String(item.status || "").toLowerCase() === "assigned"
    ).length;

    const converted = inquiries.filter(
      (item) => String(item.status || "").toLowerCase() === "converted"
    ).length;

    const spam = inquiries.filter(
      (item) => String(item.status || "").toLowerCase() === "spam"
    ).length;

    const fresh = inquiries.filter((item) => {
      const s = String(item.status || "").toLowerCase();
      return !s || s === "new";
    }).length;

    return {
      total: inquiries.length,
      new: fresh,
      assigned,
      converted,
      spam,
    };
  }, [inquiries]);

  const standardDescriptionStats = useMemo(() => {
    const approved = standardDescriptions.filter(
      (item) => String(item.status || "").toUpperCase() === "APPROVED"
    ).length;

    const draft = standardDescriptions.filter(
      (item) => String(item.status || "").toUpperCase() === "DRAFT"
    ).length;

    return {
      total: standardDescriptions.length,
      approved,
      draft,
    };
  }, [standardDescriptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Executive Dashboard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Unified visibility across inquiries, destinations, content,
              inventory, and operations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="h-10 px-4">+ New Inquiry</Button>
          <Button variant="outline" className="h-10 px-4">
            View Reports
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
      {/* TOP KPIS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EnterpriseStatCard
          title="Inquiries"
          value={inquiryStats.total}
          icon={Mail}
          subtle="Pipeline-wide lead volume"
          tone="info"
          breakdown={[
            { label: "New", value: inquiryStats.new },
            { label: "Assigned", value: inquiryStats.assigned },
            { label: "Converted", value: inquiryStats.converted },
          ]}
        />

        <EnterpriseStatCard
          title="Excursions"
          value={excursionStats.total}
          icon={Compass}
          subtle="Catalog content coverage"
          tone="success"
          breakdown={[
            { label: "Published", value: excursionStats.published },
            { label: "Draft", value: excursionStats.draft },
            { label: "Featured", value: excursionStats.featured },
          ]}
        />

        <EnterpriseStatCard
          title="Hotels"
          value={hotelStats.total}
          icon={Building2}
          subtle="Inventory available to planners"
          tone="default"
          breakdown={[
            { label: "Active", value: hotelStats.active },
            { label: "Inactive", value: hotelStats.inactive },
          ]}
        />

        <EnterpriseStatCard
          title="Cities"
          value={cityStats.total}
          icon={MapPinned}
          subtle="Destination network readiness"
          tone="warning"
          breakdown={[
            { label: "Active", value: cityStats.active },
            { label: "Inactive", value: cityStats.inactive },
          ]}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        <LatestInquiriesCard inquiries={inquiries} />
        <EnterpriseInsightsCard
          inquiryStats={inquiryStats}
          excursionStats={excursionStats}
          hotelStats={hotelStats}
          cityStats={cityStats}
          standardDescriptionStats={standardDescriptionStats}
        />
      </div>

      {/* SECOND GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        <InquiryFunnelCard stats={inquiryStats} />
        <TopDestinationsCard inquiries={inquiries} />
        <RecentActivityCard
          inquiries={inquiries}
          excursions={excursions}
          hotels={hotels}
          cities={cities}
        />
      </div>

      {/* THIRD GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ModuleHealthCard
          cityStats={cityStats}
          hotelStats={hotelStats}
          excursionStats={excursionStats}
          inquiryStats={inquiryStats}
          standardDescriptionStats={standardDescriptionStats}
        />
        <OperationsSummaryCard
          users={users}
          cities={cities}
          hotels={hotels}
          excursions={excursions}
          inquiries={inquiries}
          standardDescriptions={standardDescriptions}
        />
        <QuickActionsCard />
      </div>

      {/* BOTTOM KPIS */}
      <div className="grid gap-4 md:grid-cols-3">
        <EnterpriseStatCard
          title="Users"
          value={users.length}
          icon={Users}
          subtle="System operators and team members"
        />

        <EnterpriseStatCard
          title="Descriptions"
          value={standardDescriptionStats.total}
          icon={FolderKanban}
          subtle="Reusable content building blocks"
          breakdown={[
            { label: "Approved", value: standardDescriptionStats.approved },
            { label: "Draft", value: standardDescriptionStats.draft },
          ]}
        />

        <EnterpriseStatCard
          title="Operational Readiness"
          value={`${Math.round(
            (
              (cityStats.active +
                hotelStats.active +
                excursionStats.published +
                standardDescriptionStats.approved) /
              Math.max(
                cityStats.total +
                  hotelStats.total +
                  excursionStats.total +
                  standardDescriptionStats.total,
                1
              )
            ) * 100
          )}%`}
          icon={ShieldCheck}
          subtle="Aggregate readiness across core modules"
        />
      </div>
        </>
      )}
    </div>
  );
}
