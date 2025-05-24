import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useMutation } from "@tanstack/react-query";

interface CreateVNPayPaymentURLRequest {
  orderInfo: string;
  amount: number;
  language: "vn";
}

async function createVNPayPaymentURL(data: CreateVNPayPaymentURLRequest) {
  const response = await authClient.post(resourceUrls.PAYMENT_RESOURCE.CREATE_VNPAY_PAYMENT_URL, data);

  return response.data;
}

function useCreateVNPayPaymentURLApi() {
  return useMutation({
    mutationFn: createVNPayPaymentURL
  })
}

export {
  useCreateVNPayPaymentURLApi
}
