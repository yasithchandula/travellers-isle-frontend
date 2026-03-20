import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchCities } from "@/app/slices/citySlice";

export default function useCitiesLoader(dispatch) {
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAllCities() {
      try {
        setIsLoadingCities(true);

        let page = 1;
        const limit = 50;
        let allCities = [];
        let totalPages = 1;

        do {
          const res = await dispatch(
            fetchCities({ search: "", page, limit })
          ).unwrap();

          const data = res?.data || res;

          if (!data?.items) {
            throw new Error("Invalid city response");
          }

          allCities = [...allCities, ...data.items];
          totalPages = data.total_pages || 1;
          page++;
        } while (page <= totalPages);

        if (!isMounted) return;

        const formatted = allCities.map((c) => ({
          id: String(c.id),
          name: c.city,
        }));

        setCities(formatted);
      } catch (error) {
        console.error("Failed to load cities:", error);
        toast.error("Failed to load cities");
      } finally {
        if (isMounted) {
          setIsLoadingCities(false);
        }
      }
    }

    loadAllCities();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return {
    cities,
    isLoadingCities,
  };
}