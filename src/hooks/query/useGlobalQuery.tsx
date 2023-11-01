import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryKeyInformation } from "query";

const useGlobalQuery = <T,>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, URL, params],
    queryFn: () => api.get(URL, { params }),
  });

  const _data = data ? data.data : undefined;

  return { _data, isError, isSuccess, error };
};
export default useGlobalQuery;
