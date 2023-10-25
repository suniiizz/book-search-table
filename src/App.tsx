import DatePicker from "@/components/date-picker";
import Table from "./components/table";
// import { Person } from "test";
// import { personData } from "./utils/test";
// import { createColumnHelper } from "@tanstack/react-table";
const App = () => {
  // const columnHelper = createColumnHelper<Person>();
  // const columns = [
  //   columnHelper.accessor("firstName", {
  //     cell: (info) => info.getValue(),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor((row) => row.lastName, {
  //     id: "lastName",
  //     cell: (info) => <i>{info.getValue()}</i>,
  //     header: () => <span>Last Name</span>,
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor("age", {
  //     header: () => "Age",
  //     cell: (info) => info.renderValue(),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor("visits", {
  //     header: () => <span>Visits</span>,
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor("status", {
  //     header: "Status",
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor("progress", {
  //     header: "Profile Progress",
  //     footer: (info) => info.column.id,
  //   }),
  // ];

  return (
    <>
      <br />
      <DatePicker />
      <br />
      {/* <Table<Person> tableData={personData} /> */}
      <Table />
    </>
  );
};

export default App;
