import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { Input as InputWrap } from "@/components/ui/input";

type InputType<T extends FieldValues> = {
  field?: ControllerRenderProps<T>;
  onChange?: () => void;
};

const Input = <T extends FieldValues>({ field, onChange }: InputType<T>) => {
  return (
    <InputWrap
      placeholder="입력해 주세요."
      onChange={field ? (value) => field.onChange(value) : onChange}
    />
  );
};

type Props = {
  registerName: string;
};

const InputWithHookForm = ({ registerName }: Props) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={registerName}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <Input onChange={onChange} />
            {error && (
              <span className="inline-block mt-2">{error.message}</span>
            )}
          </>
        )}
      />
    </>
  );
};

export { Input, InputWithHookForm };
