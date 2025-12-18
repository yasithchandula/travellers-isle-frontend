import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SummaryGrid from "../../widgets/SummaryGrid";
import InquiriesChart from "../../widgets/InquiriesChart";
import ConversionPie from "../../widgets/ConversionPie";
import TopDestinations from "../../widgets/TopDestinations";
import RecentQuotations from "../../widgets/RecentQuotations";
import FollowupsTable from "../../widgets/FollowupsTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-ti-mist px-6 py-6 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-ti-forest tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-ti-teal">
          Here’s an overview of your tour operations today
        </p>
      </div>

      {/* SUMMARY */}
      <SummaryGrid />

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Inquiries Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InquiriesChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionPie />
          </CardContent>
        </Card>
      </div>

      {/* LISTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Top Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopDestinations />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Recent Quotations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentQuotations />
          </CardContent>
        </Card>
      </div>

      {/* FOLLOW UPS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Pending Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FollowupsTable />
        </CardContent>
      </Card>

    </div>
  );
}
