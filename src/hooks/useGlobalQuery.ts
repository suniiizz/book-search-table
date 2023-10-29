import axios from "axios";
import useQuery from "@/hooks/useQuery";
import { queryInformationType } from "query";

const useGlobalQuery = ({ key, URL }: queryInformationType) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, URL],
    queryFn: () => axios.get(URL),
  });

  return { data, isError, isSuccess, error };
};
export default useGlobalQuery;
