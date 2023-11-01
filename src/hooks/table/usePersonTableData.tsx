import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
const usePersonTableData = <T,>({
  data,
  columns,
}: {
  data: T[];
  columns: ColumnDef<T>[];
}) => {
  const tableData: T[] = useMemo(() => data, []);
  const tableColumns = useMemo(() => columns, []);
  return { tableData, tableColumns };
};
export default usePersonTableData;
