declare module "query" {
  export interface Query<TQueryFn> {
    queryKey: QueryKey;
    queryFn: () => TQueryFn | Promise<TQueryFn>;
    options?: UseQueryOptions<TQueryFn>;
  }

  export interface queryInformationType {
    key: string;
    URL: string;
  }
}
