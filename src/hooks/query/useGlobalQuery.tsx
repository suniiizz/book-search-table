import api from "@/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { QueryKeyInformation } from "query";

const useGlobalQuery = <T, K, D>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  options?: Omit<
    UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
    "queryKey" | "queryFn"
  >,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    ...options,
  });
  return { data, isError, isSuccess, error };
};
export default useGlobalQuery;
