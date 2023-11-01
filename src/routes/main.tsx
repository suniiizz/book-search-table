import usePersonTableData from "@/hooks/table/usePersonTableData";
import DatePicker from "@/components/date-picker";
import Table from "@/components/table";
import { BookSearchParameter, BookInformationType } from "book-search";
import {
  // Row,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Select, SelectWithHookForm } from "@/components/select";
import { Sheet as SheetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CSVLink } from "react-csv";
import { makeCSVArray } from "@/utils";
import useGlobalQuery from "@/hooks/query/useGlobalQuery";
import { useState } from "react";
const Main = () => {
  const [bookSearchParams] = useState<BookSearchParameter>(
    bookSearchParamsDefault,
  );

  const { _data: data } = useGlobalQuery(
    "book",
    bookSearchParams,
    "book-search",
  );

  const { tableData, tableColumns } = usePersonTableData<BookInformationType>({
    data: data?.documents ? data?.documents : [],
    columns: bookInformationColumns,
  });

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    // 페이지네이션을 추가해주려면 해당 코드를 추가해줘야함
    getPaginationRowModel: getPaginationRowModel(),
  });

  const methods = useForm<BookSearchParameter>({
    defaultValues: bookSearchParamsDefault,
  });

  return (
    <FormProvider {...methods}>
      <div className="flex gap-2 items-center justify-end mb-2">
        <DatePicker />
        <Select
          onValueChange={(value) => {
            table.setPageSize(parseInt(value));
          }}
        />
        <SelectWithHookForm
          registerName="size"
          afterValueChange={(value) => {
            table.setPageSize(parseInt(value));
          }}
        />
        <CSVLink data={makeCSVArray<BookInformationType>(table)}>
          <Button variant={"outline"} className="flex gap-2">
            <SheetIcon color="#e5e7eb" />
            다운로드
          </Button>
        </CSVLink>
      </div>
      <Table<BookInformationType> table={table} />
    </FormProvider>
  );
};

export default Main;

const bookSearchParamsDefault = {
  query: "가와바타 야스나리",
  sort: "accuracy",
  page: 1,
  size: "10",
  target: "",
};

const bookInformationColumns = [
  // {
  //   id: "thumbnail",
  //   header: "이미지",
  //   cell: ({ row }: { row: Row<BookInformationType> }) => {
  //     return <span className="font-bold"></span>;
  //   },
  // },

  // {
  //   id: "authors",
  //   header: "작가",
  //   accessorKey: "authors",
  //   cell: ({ row }: { row: Row<BookInformationType> }) => {
  //     return <span className="font-bold"></span>;
  //   },
  // },
  // {
  //   id: "contents",
  //   header: "줄거리",
  //   accessorKey: "contents",
  // },
  // {
  //   id: "datetime",
  //   header: "발매일",
  //   accessorKey: "datetime",
  // },
  // {
  //   id: "isbn",
  //   header: "inbn",
  //   accessorKey: "isbn",
  // },
  {
    id: "price",
    header: "가격",
    accessorKey: "price",
  },
  {
    id: "publisher",
    header: "출판사",
    accessorKey: "publisher",
  },
  {
    id: "sale_price",
    header: "할인가격",
    accessorKey: "sale_price",
  },
  {
    id: "status",
    header: "판매 상태",
    accessorKey: "status",
  },
  {
    id: "title",
    header: "제목",
    accessorKey: "title",
  },
  // {
  //   id: "translators",
  //   header: "번역가",
  //   accessorKey: "translators",
  //   cell: ({ row }: { row: Row<BookInformationType> }) => {
  //     return <span className="font-bold"></span>;
  //   },
  // },
  // {
  //   id: "url",
  //   header: "주소",
  //   accessorKey: "url",
  // },
];
