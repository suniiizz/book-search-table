import useMemoizedTableData from "@/hooks/table/useMemoizedTableData";
import { DatePickerWithHookForm } from "@/components/date-picker";
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
import { SelectWithHookForm } from "@/components/select";
import Modal from "@/components/modal";
import { Sheet as SheetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CSVLink } from "react-csv";
import { makeCSVArray } from "@/utils";
import { useContext } from "react";
import { ModalContext } from "@/components/modal/context/ModalContext";
import useGlobalQuery from "@/hooks/query/useGlobalQuery";
import { useState } from "react";
import { bookInformationColumns } from "@/utils/table-data/book";
import { keepPreviousData } from "@tanstack/react-query";
import Pagi from "@/components/pagi";
import { DevTool } from "@hookform/devtools";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/utils/zod";
import { InputWithHookForm } from "@/components/input";

const Main = () => {
  const { isOpen, onOpenModal, onCloseModal } = useContext(ModalContext);
  const [bookSearchParams, setBookSearchParams] = useState<BookSearchParameter>(
    bookSearchParamsDefault,
  );

  const { data } = useGlobalQuery<
    BookSearchParameter,
    BookInformationReturnType
  >("book", bookSearchParams, "book-search", {
    select: (data) => data.data,
    placeholderData: keepPreviousData,
  });

  const { tableData, tableColumns } = useMemoizedTableData<BookInformationType>(
    {
      data: data?.documents ? data.documents : [],
      columns: bookInformationColumns(onOpenModal),
    },
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    // 페이지네이션을 추가해주려면 해당 코드를 추가해줘야함
    getPaginationRowModel: getPaginationRowModel(),
  });

  const methods = useForm<z.infer<typeof FormSchema>>({
    defaultValues: bookSearchParamsDefault,
    resolver: zodResolver(FormSchema), // zod 유효성 검사를 위해 resolver 추가
  });

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    data;
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div className="flex gap-2 justify-end mb-2">
            <div className="flex flex-col">
              <InputWithHookForm registerName="search" />
            </div>
            <Button>검색</Button>
            {/* <DatePicker /> */}
            <DatePickerWithHookForm registerName="date" />
            {/* <Select
              onValueChange={(value) => {
                setBookSearchParams((prev) => {
                  return { ...prev, size: value };
                });
                table.setPageSize(parseInt(value));
              }}
            /> */}
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
          <Pagi
            total={data?.meta.pageable_count}
            defaultPageSize={bookSearchParams.size as number}
            current={bookSearchParams.page}
            onChange={(page) => {
              setBookSearchParams((prev) => {
                return {
                  ...prev,
                  page,
                };
              });
            }}
          />
        </form>
      </FormProvider>
      <DevTool control={methods.control} />
      {isOpen && (
        <Modal title="Modal Title">
          Modal Content
          <div className="flex justify-end w-full gap-2">
            <Button
              variant={"secondary"}
              className="flex gap-2"
              onClick={onCloseModal}
            >
              취소
            </Button>
            <Button className="flex gap-2" onClick={onCloseModal}>
              확인
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Main;

const bookSearchParamsDefault = {
  query: "가와바타 야스나리",
  sort: "accuracy",
  page: 1,
  size: "5",
  target: "",
  search: "",
};
