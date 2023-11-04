# UseGlobalQuery - refactor

## 원인

기존에 사용하고 있던 `useGlobalQuery`는 `option`인자의 타입 문제와 `return`되는 데이터의 타입을 추론할 수 없다는 문제 때문에 리팩토링이 반드시 필요했다.<br><br>
특히 두 가지 문제가 맞물려 `option`의 `select`값을 이용할 때 타입이 꼬여버리는 문제가 가장 큰 문제였다. 해당 이슈를 확인하는 동시에 `refactoring` 과정을 함께 살펴보도록 하자

## 과정

첫 번째 이슈는 `option`의 `type`문제다<br><br>
내가 제작한 `useGlobalQuery`는 `queryFn`에 전달할 `Promise`를 `return`하는 함수의 `URL`과 `paramete`값 그리고 `queyrKey`에 전달해줄 `key`값을 인자로 받았다.<br><br>
하지만 `useQuery`의 `option`을 전달해주지 않아서 `useGlobalQuery`에 `options`인자를 작성하고 이를 `useQuery`에 전달하는 방법으로 문제를 해결하려고 했다<br><br>

물론 해당 기능은 잘 작동했다. 하지만 알맞은 `options` 타입을 찾지 못해서 처음에는 아래와 같은 잘못된 코드를 작성했다.<br><br>
이후 공식 문서와 타입파일을 탐색한 결과 `QueryObserverOptions` 이란 타입을 찾을 수 있었고 이를 상속받은 `UseQueryOptions` 이라는 타입을 찾아서 `options`에 타입으로 설정해 주었다.<br><br>

```tsx
import api from "@/api";
import {
  UndefinedInitialDataOptions,
  UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { QueryKeyInformation } from "query";

const useGlobalQuery = <T,>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  //   options?: UndefinedInitialDataOptions, // 처음 작성했던 option type
  options?: UseQueryOptions, // 알맞은 타입 설정 => 하지만 이게 전부가 아님
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    ...options,
  });
  const axiosReturnData = data as AxiosResponse;
  if (data) {
    const _data = axiosReturnData?.data;
    return { _data, isError, isSuccess, error };
  } else {
    const _data = {};
    return { _data, isError, isSuccess, error };
  }
};
```

문제를 전부 해결했다고 생각했지만 그렇게 호락호락한 타입스크립트가 아니였다.

```tsx
const { _data: data } = useGlobalQuery(
  "book",
  bookSearchParams,
  "book-search",
  {
    select: (data) => {}, // 해당 data 인자에서 타입이슈가 계속 발생 했다.
  },
);
```

여전히 위의 코드에서 `select` 함수를 사용하면 `data`의 타입에러가 발생했고 아래의 코드 처럼

```tsx
import useMemoizedTableData from "@/hooks/table/useMemoizedTableData";
import DatePicker from "@/components/date-picker";
import Table from "@/components/table";
import { BookSearchParameter, BookInformationType } from "book-search";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Select, SelectWithHookForm } from "@/components/select";
import { Sheet as SheetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { CSVLink } from "react-csv";
import { makeCSVArray } from "@/utils";
import useGlobalQuery from "@/hooks/query/useGlobalQuery";
import { useState } from "react";
import { bookInformationColumns } from "@/utils/table-data/book";
const Main = () => {
   const [bookSearchParams, setBookSearchParams] = useState<BookSearchParameter>(
    bookSearchParamsDefault,
  );

  const { _data: data } = useGlobalQuery(
    "book",
    bookSearchParams,
    "book-search",
    {
        select :(data) => {} // 해당 data에서 타입이슈가 계속 발생 했다.
    }
  );

  const { tableData, tableColumns } = useMemoizedTableData<BookInformationType>(
    {
      data: data?.documents ? data?.documents : [],
      // 필요한 데이터를 쓸 때마다 타입 추론이 안되기 떄문에 optional chaining을 이용하는 문제점 발생
      columns: bookInformationColumns,
    },
  );

```

`useGlobalQuery`가 `return`하는 `_data`의 `type`을 지정해주지 않아 해당 코드처럼
`data?.documents ? data?.documents ` 타입스크립트 를 이용함에도 `optional chaining`을 써야하는 단점이 생겼다. <br><br>

결국 이러한 이슈를 해결하기 위해서는 `useQuery`에서 사용하는 `type`을 확실히 학습 후 정리해야겠다라는 생각이 들었다. ~~[링크(문서작성중)]()~~

해당 문서에서 가볍게 정리하면

```tsx
export function useQuery<
  TQueryFnData = unknown, //useQuery로 실행하는 query functiong(queryFn)의 return값을 정하는 제네릭 타입입니다.
  TError = unknown, // TError는 query function의 error 형식을 정하는 제네릭 타입입니다.
  TData = TQueryFnData, //  data에 담기는 실질적 type을 뜻합니다.
  TQueryKey extends QueryKey = QueryKey //  useQuery의 첫 번째 인자로 주는 queryKey의 타입을 명시적으로 지정해주는 제네릭 타입입니다.
>
```

에러가 나는부분은 `option`의 타입인 `UseQueryOptions`값의 제네릭을 알맞은 값을 넣어줘야 하기 때문에 코드를 아래 처럼 수정했다

```tsx
const useGlobalQuery = <T, K, D>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  callback?: (data: AxiosResponse<K>) => D,
  options?: UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    select: callback,
    ...options,
  });
  return { data, isError, isSuccess, error };
};
export default useGlobalQuery;
```

`AxiosResponse<K>`을 첫번째 제네릭자리로 넣은 이유는 `api.get()` 함수가 `Promise` 리턴하기 때문이다 그리고 실제로 `Promise`의 `data`에 리턴되는 값은 백엔드에서 전달해주는 타입을 넣어 백엔드가 전달해주는 `type`을 추론할 수 있게 작성했다.<br><br>

두번째 제네릭은 `AxiosError`는 `api.get()`이 에러가 발생해줄 때 리턴해주는 에러 타입을 넣어주었고<br><br>

마지막 세번째 제네릭 타입은 실제로 `useQuery`가 `return`하는 객체의 `data` 타입을 추론하여 내가 쓰고싶은 값만 사용할 수 있게 작성했다.<br>
그리고 그 데이터의 변형은 `select`의 `callback`함수로 받아 해당값을 만들어주고 리턴해주는 식으로 작성했다<br>
`callback?: (data: AxiosResponse<K>) => D` 여기서 select에 전달되는 callback함수의 인자는 `AxiosResponse<K>`의 타입과 같고 해당 함수가 실제 data인 제네릭 D타입과 동일하게 일치시켜줬다.<br><br>

이렇게 수정함으로써 `select`함수를 언제든지 내가 필요한 방법으로 작성해서 전달할 수 있게 됐고 내가 원하는 값들만 `useQuery`의 `return`값으로 전달 받을 수 있게 됐다.

```tsx
const { data } = useGlobalQuery<
  BookSearchParameter,
  BookInformationReturnType,
  BookInformationType[]
>("book", bookSearchParams, "book-search", (data) => {
  return data.data.documents;
});
```

`useGlobalQuery`의 첫번째 제네릭 자리에는 `api.get` 함수에 필요한 `parameter` 값의 타입을 전달한다<br>
두번째 제네릭 자리에는 `axios`의 `return`값으로 오는 `Promise`에서 백엔드가 전달해주는 타입값을 전달하고<br>
마지막으로 실제 내가 받고싶은 `data`의 타입을 세번째 제네릭 자리에 넣어준다<br><br>

이렇게 함으로써 세번째 인자에 `select`에서 사용할 콜백함수를 작성하면 해당 콜백함수의 인자값이 `AxiosResponse<BookInformationReturnType>` 으로 추론되어 백엔드가 전달해주는 `data`를 `data.data`로 받고 거기서 내가 필요한 데이터만 `return`하던가 `data.data.document (해당 프로퍼티의 타입은 BookInformationType[] 이다)` 원하는 로직을 작성해서 필요한 값들만 리턴해줄 수 있다.<br><br>

해당 리팩토링을 수행함으로써 기존에 사용했던 `optional chaining`을 사용하지 않고

```tsx
// before
const { tableData, tableColumns } = useMemoizedTableData<BookInformationType>({
  data: data?.documents ? data?.documents : [],
  columns: bookInformationColumns,
});

// after
const { tableData, tableColumns } = useMemoizedTableData<BookInformationType>({
  data: data ? data : [],
  columns: bookInformationColumns,
});
```

after처럼 코드를 사용할 수 있게 됐다.

## 결과

이전의 코드보다 보다 확실히 `type`을 내가 확실하게 지정해주기 때문에 조금 더 안정적인 코드가 됐다고 생각한다.<br>
또한 이젠 `useQuery`의 다양한 `option`값들을 제어할 수 있어 설정값을 수정해 해당 컴포넌트에 필요한 로직을 작성 할 수 있게됐다<br>
하지만 여전히 아쉬운 점은 존재한다 가령 `select`의 `callback`함수를 익명함수로 작성해주지 않으면 매번 `AxiosResponse<K>` 같은 타입을 작성해줘야하는 불편함이 존재했다.<br><br>
그러나 확실히 이전보다는 더 나은 코드를 작성했다는 뿌듯함은 있다. 이번 프로젝트에서는 따로 `useMutation`을 작성하지 않지만 다음 프로젝트에서는 `useMutation`도 글로벌하게 만들어서 보다 더 선언적인 코드를 작성할 수 있게 만들어 봐야겠다.
