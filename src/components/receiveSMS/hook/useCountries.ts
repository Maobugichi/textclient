import { useQuery } from "@tanstack/react-query";

import api from "../../../lib/axios-config";
import { Country } from "../types";

const fetchCountries = async () => {
  const res = await api.get("/api/sms/countries");
  
  return res.data;
};

export function useCountries(provider: string | null) {
  return useQuery<Country[]>({
    queryKey: ["countries", provider], 
    queryFn: fetchCountries,
    enabled: !!provider, 
    staleTime: 1000 * 60 * 5, 
  });
}
