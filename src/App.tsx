import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
const App = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  let k;
  return (
    <>
      <Button>Button</Button>
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border w-fit" />
    </>
  );
};

export default App;