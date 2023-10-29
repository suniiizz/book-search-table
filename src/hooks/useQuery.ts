import { useQuery as _useQuery } from "@tanstack/react-query";
import { Query } from "query";

const useQuery = <TQueryFn>({
  queryKey,
  queryFn,
  options,
}: Query<TQueryFn>) => {
  return _useQuery<TQueryFn>({
    queryKey,
    queryFn,
    ...options,
  });
};

export default useQuery;
