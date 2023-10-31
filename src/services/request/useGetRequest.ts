import api from "@/api";
import { useQuery } from "@tanstack/react-query";

const getRequest = async () => {
  const response = await api.get(
    `https://api.github.com/repos/tannerlinsley/react-query`,
  );

  return response.data;
};

const useGetRequestQuery = () => ({
  queryKey: ["test_data_1"],
  queryFn: () => getRequest(),
});

const useGetRequest = () => {
  const { data, isLoading, error } = useQuery(useGetRequestQuery());

  return { data, isLoading, error };
};

export default useGetRequest;
