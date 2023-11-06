import { Skeleton } from "@/components/ui/skeleton";
import { Row } from "@tanstack/react-table";
import { BookInformationType } from "book-search";
const bookInformationColumns = (onOpenModal: () => void) => [
  {
    id: "thumbnail",
    header: "이미지",
    accessorKey: "thumbnail",
    cell: ({ row }: { row: Row<BookInformationType> }) => (
      <img
        src={row.original.thumbnail}
        className="cursor-pointer"
        alt="book-image"
        onClick={onOpenModal}
      />
    ),
  },
  {
    id: "title",
    header: "제목",
    accessorKey: "title",
    cell: ({ row }: { row: Row<BookInformationType> }) => (
      <a href={row.original.url} target="_blank" rel="noreferrer">
        {row.original.title}
      </a>
    ),
  },
  {
    id: "authors",
    header: "작가",
    accessorKey: "authors",
  },
  {
    id: "price",
    header: "가격",
    accessorKey: "price",
    cell: ({ row }: { row: Row<BookInformationType> }) => {
      const isSalePrice = row.original.sale_price > 0;
      return (
        <div className="flex flex-col items-center justify-center gap-0.5">
          {isSalePrice && (
            <span className={isSalePrice && "line-through text-gray-400"}>
              {row.original.sale_price.toLocaleString("ko-KR")}원
            </span>
          )}
          <span>{row.original.price.toLocaleString("ko-KR")}원</span>
        </div>
      );
    },
  },
  {
    id: "publisher",
    header: "출판사",
    accessorKey: "publisher",
  },
  {
    id: "status",
    header: "판매 상태",
    accessorKey: "status",
    cell: ({ row }: { row: Row<BookInformationType> }) =>
      row.original.status ? (
        row.original.status
      ) : (
        <span className="text-red-500">품절</span>
      ),
  },
];

const bookInformationColumnsSkeleton = [
  {
    id: "thumbnail",
    header: "이미지",
    accessorKey: "thumbnail",
    cell: () => <Skeleton className="w-[120px] h-[174px]" />,
  },
];

export { bookInformationColumns, bookInformationColumnsSkeleton };
