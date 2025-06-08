import { prepareParams, serializeParams } from "@utils/searchUtils.ts";
import { authClient } from "@apis/axiosClient.ts";
import resourceUrls from "@constants/resourceUrls.ts";
import { useQuery } from "@tanstack/react-query";

export enum TransactionStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export enum TransactionType {
  IN = "IN",
  OUT = "OUT"
}

export enum PaymentMethod {
  CASH = "CASH",
  VN_PAY = "VN_PAY",
  PAY_PAL = "PAY_PAL",
  CRYPTO = "CRYPTO"
}

// Search transactions API
interface TransactionSearchRequest {
  keyword?: string | undefined;
  pageIndex?: number| undefined;
  pageSize?: number| undefined;
  sortBy?: string| undefined;
  sortOrder?: 'ASC' | 'DESC'| undefined;
  ids?: string[]| undefined;
  userIds?: string[]| undefined;
  paymentMethods?: PaymentMethod[]| undefined;
  transactionStatuses?: TransactionStatus[]| undefined;
  transactionTypes?: TransactionType[]| undefined;
  startDate: number| undefined;
  endDate: number| undefined;
}

async function searchTransactions(request: TransactionSearchRequest) {
  const params = prepareParams(request);

  const response = await authClient.get(resourceUrls.TRANSACTION_RESOURCE.SEARCH, {
    params,
    paramsSerializer: {
      serialize: serializeParams
    }
  });

  return response.data;
}

function useSearchTransactionsApi(request: TransactionSearchRequest) {
  return useQuery({
    queryKey: ["transactions/search", request],
    queryFn: () => searchTransactions(request)
  });
}

export {
  useSearchTransactionsApi
}
