import useQuery from "@/hooks/useQuery";
import { getRequest } from "@/http/api/getRequest";

export const useGetRequestQuery = () => ({
  queryKey: ["test_data_1"],
  queryFn: () => getRequest(),
});

export const useGetRequest = () => {
  const { data, isLoading, error } = useQuery(useGetRequestQuery());

  return { data, isLoading, error };
};
