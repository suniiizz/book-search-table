import useMemoizedTableData from "@/hooks/table/useMemoizedTableData";
import DatePicker from "@/components/date-picker";
import Table from "@/components/table";
import {
  BookSearchParameter,
  BookInformationType,
  BookInformationReturnType,
} from "book-search";
import {
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
import { bookInformationColumns } from "@/utils/table-data/book";
const Main = () => {
  const [bookSearchParams, setBookSearchParams] = useState<BookSearchParameter>(
    bookSearchParamsDefault,
  );

  const { data } = useGlobalQuery<
    BookSearchParameter,
    BookInformationReturnType,
    BookInformationReturnType
  >("book", bookSearchParams, "book-search", {
    select: (data) => data.data,
  });

  const { tableData, tableColumns } = useMemoizedTableData<BookInformationType>(
    {
      data: data?.documents ? data.documents : [],
      columns: bookInformationColumns,
    },
  );

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
            setBookSearchParams((prev) => {
              return { ...prev, size: value };
            });
            table.setPageSize(parseInt(value));
          }}
        />
        <SelectWithHookForm
          registerName="size"
          afterValueChange={(value) => {
            setBookSearchParams((prev) => {
              return { ...prev, size: value };
            });
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
