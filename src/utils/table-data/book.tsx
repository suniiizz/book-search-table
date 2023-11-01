import { Row } from "@tanstack/react-table";
import { BookInformationType } from "book-search";

const bookInformationColumns = [
  {
    id: "thumbnail",
    header: "이미지",
    accessorKey: "thumbnail",
    cell: ({ row }: { row: Row<BookInformationType> }) => (
      <img src={row.original.thumbnail} alt="" />
    ),
  },
  {
    id: "title",
    header: "제목",
    accessorKey: "title",
  },
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

export { bookInformationColumns };
