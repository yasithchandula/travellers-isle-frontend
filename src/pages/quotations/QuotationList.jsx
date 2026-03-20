import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { quotationApi } from "../../api/quotationApi";
//import { setQuotations, duplicateIntoDraft } from "../../app/slices/quotationSlice";

export default function QuotationList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quotations = useSelector(s => s.quotations.items);

  const [filters, setFilters] = useState({
    search: "", status: "", month: "", executive: "",
    tourType: "", paxMin: "", paxMax: ""
  });

  // useEffect(() => {
  //   (async () => {
  //     const list = await quotationApi.getAll();
  //     dispatch(setQuotations(list));
  //   })();
  // }, [dispatch]);

  // const filtered = useMemo(() => {
  //   const q = filters.search.toLowerCase();
  //   return quotations.filter((qt) => {
  //     if (filters.status && qt.status !== filters.status) return false;
  //     if (filters.month && !qt.tourStart?.startsWith(filters.month)) return false;
  //     if (filters.executive && qt.executiveId !== filters.executive) return false;
  //     if (filters.tourType && qt.tourType !== filters.tourType) return false;
  //     const pax = (qt.adults || 0) + (qt.children?.length || 0);
  //     if (filters.paxMin && pax < Number(filters.paxMin)) return false;
  //     if (filters.paxMax && pax > Number(filters.paxMax)) return false;
  //     if (q && !(`${qt.guestName || ""} ${qt.tourNumber || ""}`.toLowerCase().includes(q))) return false;
  //     return true;
  //   });
  // }, [quotations, filters]);

  return (
    <div className=" max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Quotations</h1>
        <Button onClick={() => navigate("/quotations/new")}>+ New Quotation</Button>
      </div>
      <Card>

        {/* <QuotationTable
          // data={filtered}
          // openQuotation={(q) => navigate(`/quotations/${q.id}`)}
          // duplicateQuotation={(q) => {
          //   // dispatch(duplicateIntoDraft(q));
          //   navigate("/quotations/new");
          // }}
        /> */}
      </Card>
    </div>
  );
}
