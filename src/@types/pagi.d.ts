declare module "pagi" {
  export type PagiType = {
    total: number | undefined;
    defaultPageSize: number;
    current: number;
    onChange: (page: number) => void;
  };
}
