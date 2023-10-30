import {
  Select as SelectWrap,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type SelectType<T extends FieldValues> = {
  onValueChange?: (value: string) => void;
  afterValueChange?: (value: string) => void;
  defaultValue?: string;
  registerName?: string;
  field?: ControllerRenderProps<T>;
};

const Select = <T extends FieldValues>({
  onValueChange,
  defaultValue,
  field,
  afterValueChange,
}: SelectType<T>) => {
  return (
    <SelectWrap
      onValueChange={
        field
          ? (value) => {
              field.onChange(value);
              afterValueChange && afterValueChange(value);
            }
          : onValueChange
      }
      defaultValue={field ? field.value : defaultValue}
    >
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

const SelectWithHookForm = ({
  registerName,
  afterValueChange,
}: {
  registerName: string;
  afterValueChange?: (value: string) => void;
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={registerName}
      render={({ field }) => (
        <Select field={field} afterValueChange={afterValueChange} />
      )}
    />
  );
};

export { Select, SelectWithHookForm };

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
