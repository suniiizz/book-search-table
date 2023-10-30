# Select Component

테이블이 노출 시키는 리스트의 row를 변경 시키기 위한 `Select` 컴포넌트 제작과정.

컴포넌트 UI는 `shadcn/ui`를 사용했고 `react-hook-form`과 결합한 컴포넌트와 그렇지 않은 컴포넌트 제작 과정을 통해 `shadcn/ui`와 `react-hook-form`의 `Controller` 를 이용해 컴포넌트를 제작해보자.

### 🏃‍♂️ 과정

`shadcn/ui`의 `Select` 컴포넌트 제작은 어렵지 않았다.

터미널에 `npx shadcn-ui@latest add select` 명령어를 입력해주고

```tsx
import {
  Select as SelectWrap,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Select = ({
  onValueChange,
  defaultValue,
}: {
  onValueChange: (value: string) => void;
  defaultValue?: string;
}) => {
  return (
    <SelectWrap onValueChange={onValueChange} defaultValue={defaultValue && ""}>
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
```

```tsx
<Select
  onValueChange={(value) => {
    table.setPageSize(parseInt(value));
  }}
/>
```

위와 같은 코드를 작성해줬다.

`onChangeValue`는 `callback`함수를 전달 받아 `selectOption`의 `value`의 `value`값만큼 테이블 row값을 변경 시켜 줬다.

하지만 최종적으로는 `react-hook-form`과 연동 시켜야 하기 때문에 `reack-hook-form`의 `Controller`컴포넌트를 사용해야 했다.

과거에 만들었던 방식은 Select 컴포넌트에서 `react-hook-form` 사용 여부를 분기 처리 할 수 있는 `props`하나를 추가하여 삼항연산자를 이용하여 컴포넌트를 확장 시켰다. 하지만 이러한 방법은 한개의 컴포넌트가 지나치게 거대해지고 중복되는 코드가 반복되어 이전과는 다른 방식을 사용하기로 결정했다.

- **과거의 못난 코드**
  registerName을 이용해서 react-hook-form을 이용하는 컴포넌트와 그렇지 않은 컴포넌트를 분기처리 해줬음

  ```tsx
  const Input = ({ registerName, requiredMessage, ...props }: Props) => {
    const {
      register,
      formState: { errors },
      setValue,
      watch,
    } = useFormContext();

    const resetRegisterValue = (registerName: string) => () => {
      setValue(registerName, "");
    };

    const className = `border border-line hover:border-black focus:border-black outline-0 placeholder:text-light py-2 px-4 w-full ${
      props.className ?? ""
    } ${
      registerName && errors[registerName]
        ? "border-error hover:border-error focus:border-error placeholder:text-error"
        : ""
    }`;
    if (!registerName)
      return (
        <div>
          <input {...props} className={className} />
        </div>
      );
    return (
      <div className="flex flex-col gap-1 relative">
        <input
          {...register(registerName, {
            required: requiredMessage ? requiredMessage : false,
          })}
          {...props}
          className={className}
        />
        {watch(registerName) && (
          <ImageSection
            src={iconX}
            onClick={resetRegisterValue(registerName)}
            className="w-4 h-4 absolute right-1 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
        {errors[registerName] && (
          <Text as="span" className="text-error pl-2">
            {requiredMessage}
          </Text>
        )}
      </div>
    );
  };
  ```

이번에는 `react-hook-form`을 이용하는 새로운 컴포넌트를 제작하고 기존에 제작한 Select 컴포넌트를 return 해주는 방식으로 코드를 작성해봤다.

```tsx
const Select = <T extends FieldValues>({
  onValueChange,
  defaultValue,
  field,
}: SelectType<T>) => {
  return (
    <SelectWrap
      onValueChange={field ? field.onChange : onValueChange}
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

const SelectWithHookForm = ({ registerName }: { registerName: string }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={registerName}
      render={({ field }) => <Select field={field} />}
    />
  );
};
```

`fileld`의 타입지정 때문에 잠시 방황하긴 했으나, 어렵지 않게 해결하긴 했다. 하지만 해당 컴포넌트에는 치명적인 오류가 있었다.

<aside>
📝 물론 타입 이슈 해결은 근본적인 문제점을 해결하지 못한 눈 가리고 아웅이나 마찬가지라고 생각한다. 매번 react-hook-form을 이용하여 컴포넌트를 만들 때 당면하는 문제이지만 언젠가 제대로 공부할 필요가 있다고 생각함

</aside>

### 💣 문제점

`table.setPageSize(parseInt(value))` 메서드를 이용해서 현재 `table`객체의 상태를 변경해야 한다.

기존에는 `onValueChange` 에 `callback` 함수를 전달하여 해당 로직을 실행했지만, 현재는 해당 자리에 react-hook-form 데이터를 변경하기 위한 `field.onChange` 가 위치하고 있다.

### ❗해결

하지만 `react-hook-form`, 역시 나를 실망 시키지 않는다. `onValueChange` 는 추가적으로 콜백함수를 리턴 할 수 있어서 우리에게 필요한 `table.setPageSize(parseInt(value))` 로직을 전달할 수 있다.

_`afterValueChange`_ 라는 `props` 를 추가해주고 해당 로직을 담은 `callback`함수를 전달하는 방식으로 수정했다.

```tsx
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
```

```tsx
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
```

```tsx
// react-hook-form 없이 사용 할 때
<Select
	onValueChange={(value) => {
		table.setPageSize(parseInt(value));
	}}
/>
// react-hook-form과 사용 할 때
<SelectWithHookForm
	registerName="volume"
	afterValueChange={(value) => {
		table.setPageSize(parseInt(value));
	}}
/>
```

이처럼 `react-hook-form` 여부에 따라 사용할 수 있는 컴포넌트를 제작했다

### 🏳️ 후기

`shadcn/ui`의 `Select`같은 경우 추가적으로 유효성 검사나 `checkbox`나 `radio`처럼 이벤트가 적어 `Controller` 컴포넌트를 이용해 비교적 쉽게 제작했다. 하지만 다른 컴포넌트 같은 경우 (`Checkbox`, `Input`, `Radio Group`) 은 해당 컴포넌트 처럼 `Controller` 컴포넌트를 이용해서 제작할 때 공식문서를 확실히 읽어봐야겠다는 생각이 들었다.

### ➕ 더 만들어 보기

`Select`의 `label`이나 추가적인 `style` 수정이 필요할 이슈가 발생할 수 있다. 그러므로 `Composition`을 이용한 `HOC`를 통해 `label` 태그를 함께 리턴 해보고 `props`를 추가해 `style`수정이 용이하도록 차후 해당 컴포넌트를 수정해보자.
