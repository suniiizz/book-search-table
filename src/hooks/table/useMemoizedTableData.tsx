import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
const useMemoizedTableData = <T,>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) => {
  const tableData: T[] = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [data]);
  return { tableData, tableColumns };
};
export default useMemoizedTableData;
