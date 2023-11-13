# Input Component

`shadcn/ui`로 UI를 구성하고, `zod`를 사용하여 유효성 검사를 하는 `input` 컴포넌트를 구현해 보려고 한다.

</br>
  
### Controller

제어 / 비제어 컴포넌트를 같이 사용하기 위해 `controller`를 사용했다.

`react-hook-form`에 `controller`를 사용하는데 중점을 두어 구현하고자 했다.

</br>


### Controlled component vs Uncontrolled component

- 제어 컴포넌트는 `react`에서 `state`를 통해 관리되는 컴포넌트를 의미한다. `state`를 사용하여 값을 제어하기 때문에 다른 부분과 상호작용이 가능하다는 장점이 있다.
- 비제어 컴포넌트는 `DOM`에서 값을 가져오거나 설정하는 방식이다. `state`를 사용하지 않고, ref를 통해 `DOM` 요소에 접근하여 값을 제어한다. 이 방식이 `react-hook-form`의 방식으로 폼 요소의 값 을 직접 관리하고 유효성 검사 등의 기능이 있다.

</br>

shadcn/ui input을 아래 명령어로 설치했다.

```jsx
npx shadcn-ui@latest add input
```

</br>
  
```jsx
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
placeholder?: string;
};

const Input = <T extends FieldValues>({
field,
onChange,
placeholder,
}: InputType<T>) => {
return (
<InputWrap
placeholder={placeholder}
onChange={field ? (value) => field.onChange(value) : onChange}
/>
);
};

type Props = {
registerName: string;
placeholder?: string;
};

const InputWithHookForm = ({
registerName,
placeholder = "입력해 주세요.",
}: Props) => {
const { control } = useFormContext();

return (
<>
<Controller
control={control}
name={registerName}
render={({ field: { onChange }, fieldState: { error } }) => (
<>
<Input onChange={onChange} placeholder={placeholder} />
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

````

`Input`이라는 기본 컴포넌트를 만들고`react-hook-form`을 이용하기 위해 기본 컴포넌트를 return하여 `InputWithHookForm`이라는 컴포넌트를 추가로 만들었다.

`render`에서 `field` / `fieldState` 객체를 제공하는데 `onChange`와 `error`를 이용해 `input`에 입력되는 값의 상태와 오류를 관리할 수 있도록 했다.

이후 기본 컴포넌트에 `onChange`라는 `props`로 `callback` 함수를 전달 받아 `input`의 값을 알 수 있도록 작성했다.

(이때 `react-hook-form`을 쓰는 경우를 위해 `controller`의 `field`값에 따라 삼항연산자로 `input`의 상태를 관리할 수 있도록 했다.)

</br>

### zod

유효성 검증을 위해 스키마를 사용하여 객체 형식으로 나타냈다.

```jsx
import * as z from "zod";

const FormSchema = z.object({
  query: z
    .string()
    .min(2, {
      message: "최소 2글자 이상",
    })
    .max(5, { message: "최대 5글자 이하" }),
});

export { FormSchema };
````

```jsx
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/utils/zod";
import { InputWithHookForm } from "@/components/input";

const methods = useForm<z.infer<typeof FormSchema>>({
  defaultValues: bookSearchParamsDefault,
  resolver: zodResolver(FormSchema), // zod 유효성 검사를 위해 resolver 추가
});

const handleSubmit = (data: z.infer<typeof FormSchema>) =>
  setBookSearchParams((prev) => ({ ...prev, query: data.query }));

return (
	<FormProvider {...methods}>
		<form onSubmit={methods.handleSubmit(handleSubmit)}>
	    <div className="flex gap-2 justify-end mb-2">
	      <InputWithHookForm
	        registerName="query"
	        placeholder="책 정보를 입력해주세요"
	      />
	      <Button>검색</Button>
		<form>
	</FormProvider>
)
```

`zodResolver` 함수를 사용하여 만들어둔 스키마를 `resolver` 속성으로 지정하여 유효성 검사를 하도록 했다.
