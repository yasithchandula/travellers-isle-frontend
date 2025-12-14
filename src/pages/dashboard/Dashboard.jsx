import SummaryGrid from "../../widgets/SummaryGrid";
import InquiriesChart from "../../widgets/InquiriesChart";
import ConversionPie from "../../widgets/ConversionPie";
import TopDestinations from "../../widgets/TopDestinations";
import RecentQuotations from "../../widgets/RecentQuotations";
import FollowupsTable from "../../widgets/FollowupsTable";

export default function Dashboard() {
  return (
    <div className="px-6 py-8 bg-ti-mist min-h-screen rounded-md">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-ti-forest">
          Dashboard
        </h1>
        <p className="text-ti-teal mt-1">
          Here’s an overview of your tour operations today 🌴
        </p>
      </div>

      <SummaryGrid />

      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2">
          <InquiriesChart />
        </div>
        <ConversionPie />
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <TopDestinations />
        <RecentQuotations />
      </div>

      <div className="mt-10">
        <FollowupsTable />
      </div>
    </div>
  );
}
