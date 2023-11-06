import Pagination from "rc-pagination";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PagiType } from "pagi";

const Pagi = ({ total, defaultPageSize, current, onChange }: PagiType) => {
  return (
    <Pagination
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2rem",
        gap: "1rem",
      }}
      prevIcon={
        <Button variant={"outline"} className="flex gap-2">
          <ChevronLeft />
        </Button>
      }
      nextIcon={
        <Button variant={"outline"} className="flex gap-2">
          <ChevronRight />
        </Button>
      }
      total={total}
      defaultPageSize={defaultPageSize}
      current={current}
      onChange={onChange}
    />
  );
};

export default Pagi;
