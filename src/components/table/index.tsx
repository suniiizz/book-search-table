import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table as TableComponent,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Table = <T,>({
  tableData,
  columns,
  caption,
}: {
  tableData: T[];
  columns: ColumnDef<T>[];
  caption?: string;
}) => {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // 페이지네이션을 추가해주려면 해당 코드를 추가해줘야함
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Select
        onValueChange={(value) => {
          table.setPageSize(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[10rem]">
          <SelectValue placeholder="갯수" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5개</SelectItem>
          <SelectItem value="10">10개</SelectItem>
          <SelectItem value="15">20개</SelectItem>
        </SelectContent>
      </Select>

      <TableComponent>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="border-t-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableComponent>
    </>
  );
};

export default Table;
