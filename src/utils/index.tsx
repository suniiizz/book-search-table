import { Row, Table } from "@tanstack/react-table";

const makeCSVArray = <T,>(table: Table<T>) => {
  return [
    [...table.getHeaderGroups()[0].headers.map((value) => value.id)],
    ...table
      .getRowModel()
      .rows.map((value) => Object.values(value.original as Row<T>)),
  ];
};

export { makeCSVArray };
