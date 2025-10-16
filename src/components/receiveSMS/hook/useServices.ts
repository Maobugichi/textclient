import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/axios-config";

interface Service {
  id: number;
  title: string;
  price: number;
  [key: string]: any; 
}

const fetchServices = async (countryId: number): Promise<Service[]> => {
  const res = await api.get("/api/sms/price", {
    params: { id: countryId },
  });
  return Object.values(res.data);
};

export function useServices(countryId?: number) {
  return useQuery<Service[]>({
    queryKey: ["services", countryId],
    queryFn: () => fetchServices(countryId!),
    enabled: !!countryId, 
    staleTime: 1000 * 60 * 2, 
    retry: 1,
  });
}
