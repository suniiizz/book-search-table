import {
  Select as SelectWrap,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Select = ({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) => {
  return (
    <SelectWrap onValueChange={onValueChange} defaultValue="10">
      <SelectTrigger className="w-[10rem]">
        <SelectValue placeholder={selectOption.title} />
      </SelectTrigger>
      <SelectContent>
        {selectOption.value.map((value) => (
          <SelectItem key={value.value} value={value.value}>
            {value.title}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectWrap>
  );
};
export default Select;

const selectOption = {
  title: "10개",
  value: [
    {
      value: "5",
      title: "5개",
    },
    {
      value: "10",
      title: "10개",
    },
    {
      value: "20",
      title: "20개",
    },
  ],
};
