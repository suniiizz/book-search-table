import api from "@/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { QueryKeyInformation } from "query";

const useGlobalQuery = <T,>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  options?: UseQueryOptions,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    ...options,
  });
  const axiosReturnData = data as AxiosResponse;
  if (data) {
    const _data = axiosReturnData?.data;
    return { _data, isError, isSuccess, error };
  } else {
    const _data = {};
    return { _data, isError, isSuccess, error };
  }
};
export default useGlobalQuery;
