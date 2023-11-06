# Date Picker

Naver API에서 다음 API로 변경하면서 날짜 컴포넌트는 사용할 일이 없어졌지만 이번 기회를 통해 Date Picker 컴포넌트를 만들어 다음 프로젝트에서 사용할 생각으로 제작했다<br><br>
기존에 만들어 두었던 `date-picker` 컴포넌트 역시 react-hook-form과 함께 쓰기 위해서 `DatePickerWithHookForm` 이라는 컴포넌트를 제작했다. 방법은 기존과 동일하게 `registerName`값을 `string`으로 받아 `Controller` 컴포넌트에게 전달해주고 `render` 속성값에 기존에 만들어 두었던 `DatePicker` 컴포넌트를 리턴 하는 방식이다.<br>

이렇게 컴포넌트를 분리시킴으로서 `react-hook-from` 과 같이쓰는 컴포넌트 그렇지 않은 컴포넌트를 개별 적으로 사용 할 수 있게됐고 코드도 안에서 분기처리하는 방식보다 더 깔끔하게 작성 할 수 있게 됐다.

```tsx
const DatePickerWithHookForm = ({ registerName }: { registerName: string }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={registerName}
      render={({ field }) => <DatePicker field={field} />}
    />
  );
};
```

다만 한가지 아쉬운점은 `react-hook-form` 에 데이터를 전달해주는 방법을 `useEffect`로 작성했다.<br>
Calendar 컴포넌트의 onSelect 속성값을 이용해 알맞은 데이터를 전달해주고 싶었으나, 원하는 값이 전달 안되는 이슈가 발생해서 (해당 이슈는 더 확인해볼 필요가 있다.) 기능 구현을위해 useEffect를 이용해서 해당 로직을 구현했다.

```tsx
const DatePicker = <T extends FieldValues>({
  className,
  field,
}: React.HTMLAttributes<HTMLDivElement> & {
  field?: ControllerRenderProps<T>;
}) => {
  const [date, setDate] = React.useState<DateRange | undefined>();
  useEffect(() => {
    if (!date) return;
    field?.onChange(date);
  }, [date]);

  return (
    <div className={cn("grid gap-2", className ?? "")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, DATEFORMAT_YYYYMMDD_KOR)} -{" "}
                  {format(date.to, DATEFORMAT_YYYYMMDD_KOR)}
                </>
              ) : (
                format(date.from, DATEFORMAT_YYYYMMDD_KOR)
              )
            ) : (
              <span>날짜를 선택해주세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
```

이처럼 전달받은 `field`값을 통해 `date` 값을 `react-hook-form`에 전달하여 `useForm`이 리턴하는 객체값에서 사용 가능해졌다
