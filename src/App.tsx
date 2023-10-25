import usePersonTableData from "@/hooks/usePersonTableData";
import { personData, personColumns } from "@/utils/test";
import DatePicker from "@/components/date-picker";
import Table from "@/components/table";
import { Person } from "test";
const App = () => {
  const { tableData, tableColumns } = usePersonTableData<Person>({
    data: personData,
    columns: personColumns,
  });

  return (
    <>
      <br />
      <DatePicker />
      <br />
      <Table<Person> tableData={tableData} columns={tableColumns} />
    </>
  );
};

export default App;
