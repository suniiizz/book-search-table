import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { queryInformationType } from "query";

const useGlobalQuery = ({ key, URL }: queryInformationType) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, URL],
    queryFn: () => api.get(URL),
  });

  return { data, isError, isSuccess, error };
};
export default useGlobalQuery;
