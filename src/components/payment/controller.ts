import api from "../../lib/axios-config";


export const getNowCurrencies = async () => {
  const res = await api.get("/api/now-currencies");
  return res.data.selectedCurrencies;
};

export const checkPaymentStatus = async (paymentId: string) => {
  const res = await api.get(`/api/payment-status/${paymentId}`);
  return res.data;
};
