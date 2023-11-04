import api from "@/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { QueryKeyInformation } from "query";

const useGlobalQuery = <T, K, D>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  callback?: (data: AxiosResponse<K>) => D,
  options?: UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
  // options?: UseQueryOptions<QueryFunction<K>>,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    select: callback,
    ...options,
  });
  return { data, isError, isSuccess, error };

  // const axiosReturnData = data as AxiosResponse;
  // if (data) {
  //   return { _data, isError, isSuccess, error };
  //   const _data = axiosReturnData?.data;
  // } else {
  //   const _data = {};
  //   return { _data, isError, isSuccess, error };
  // }
};
export default useGlobalQuery;
