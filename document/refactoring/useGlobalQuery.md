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

---

## 20231105 2차 리팩토링

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
```

기존의 `useGlobalQuery`는 `options`의 타입을 `UseQueryOptions`값을 주었다. 그러다보니 `options`값에 `queryKey`, `queryFn` 값이 필수로 들어가 있는데 `options`값을 인자로 넘길 때 해당 값들을 넘겨주지 않아 에러가 발생했었다, (이러한 문제를 몰라서 `select`값을 따로 인자로 뺐음)<br><br>

해당 이슈를 해결하기위해 `Omit`값을 이용해서 이미 주어진 값들은 타입에서 제거했다

```tsx
const useGlobalQuery = <T, K, D>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  options?: Omit<
    UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
    "queryKey" | "queryFn"
  >,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    ...options,
  });
  return { data, isError, isSuccess, error };
};
```

```tsx
const { data } = useGlobalQuery<
  BookSearchParameter,
  BookInformationReturnType,
  BookInformationReturnType
>("book", bookSearchParams, "book-search", {
  select: (data) => data.data,
  staleTime: 5000, // 임의로 넣은 코드
});
```

해당 코드처럼 `options`값을 객체로 전달 가능해졌다

---

## 20231106 3차 리팩토링

> `select`를 이용해서 `AxiosResponse<K>` 타입이아닌 데이터를 조작해서 새롭게 리턴해줄 경우에는 세번째 제네릭 자리에 실제로 받을 타입을 작성해줘야하지만. `<K>` 제네릭 타입을 그대로 받아 사용할 일도 빈번하다. 그래서 D의 값을 기본적으로 K와 같게 세팅하여 data를 수정해서 전달해 줄 이유가 없을 때는 세번쨰 제네릭 자리를 작성하지 않아도 오류가 없이 수정했다.

```tsx
const useGlobalQuery = <T, K, D = K>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  options?: Omit<
    UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
    "queryKey" | "queryFn"
  >,
) => {
  const { data, isError, isSuccess, error } = useQuery({
    queryKey: [key, params],
    queryFn: () => api.get(URL, { params }),
    ...options,
  });
  return { data, isError, isSuccess, error };
};
export default useGlobalQuery;
```

```tsx
const { data } = useGlobalQuery<BookSearchParameter, BookInformationReturnType>(
  "book",
  bookSearchParams,
  "book-search",
  {
    select: (data) => data.data,
    placeholderData: keepPreviousData,
  },
);
```

---

## 20231110 4차 리팩토링

> `select`를 이용해서 보다 더 편리하게 백앤드가 전달해주는 자료를 받기위해 4차 리팩토링을 실시했다. 또한 추가적으로 `parameter` 값을 수정해서 필요한 인자를 더 유연하게 전달하는 방법으로 리팩토링을 실시했다. 해당 리팩토링을 위해 3차 리팩토링을 코드 리팩토링한
> 코드를 사용하고 있는 실무 코드를 가져와서 한번 더 리팩토링 해주도록 하겠다. 아래는 현재 실무에서 사용하고 있는 3차 리팩토링 코드를 조금 수정 한 버전이다.

```tsx
import http from "@/http";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
const useNewGlobalQuery = <T, K, D = K>(
  {
    URL,
    key,
  }: {
    URL: string;
    key: string;
  },
  params?: T,
  options?: Omit<
    UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
    "queryKey" | "queryFn"
  >,
  segment?: string,
) => {
  const res = useQuery<AxiosResponse<K>, AxiosError, D>({
    queryKey: params ? [key, params] : [key],
    queryFn: () =>
      http.get(!segment ? URL : `${URL}/${segment}`, params && { params }),
    select: (data) => data.data,
    ...options,
  } as UseQueryOptions<AxiosResponse<K>, AxiosError, D>);
  return { ...res };
};
export default useNewGlobalQuery;
```

위의 코드를 더 리팩토링해서 아래와 같은 코드를 작성했다

```tsx
import api from "@/api";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

type UseGlobalQueryParameterObjectType<T, K, D> = {
  URL: string;
  key: string;
  params?: T;
  options?: Omit<
    UseQueryOptions<AxiosResponse<K>, AxiosError, D>,
    "queryKey" | "queryFn"
  >;
  segment?: string;
};

const useGlobalQuery = <T, K, D = K>({
  URL,
  key,
  params,
  options,
  segment,
}: UseGlobalQueryParameterObjectType<T, K, D>) => {
  const res = useQuery<AxiosResponse<K>, AxiosError, D>({
    queryKey: params ? [key, params] : [key],
    queryFn: () =>
      api.get(!segment ? URL : `${URL}/${segment}`, params && { params }),
    select: (data) => data.data,
    ...options,
  } as UseQueryOptions<AxiosResponse<K>, AxiosError, D>);
  return { ...res };
};

export default useGlobalQuery;
```

가장 먼저 기존에 `options`값에 달려있던 `<AxiosResponse<K>, AxiosError, D>` 값들을 `useQuery`에 작성해줘서 제작의도대로 제네릭을 추가해줬다.<br>
그리고 기존의 그리고 `useQuery`의 인자값도 `as`를 통해서 확실하게 타입을 정해주었다. 여기서 `as`를 쓴 이유는 `options`의 타입은 `queryKey`와 `queryFn`을 `Omit` 한 타입인데 `useQuery`의 인자값 타입은 무조건 확정적으로 정해져있기 때문에 `as`를 써줘도 문제가 없다고 판단했기 떄문이다.

두 번째로 기존의 여러개의 인자값들을 한개의 객체로 받을 수 있게 변경했다<br>
이전의 코드는 `params`값이 필요하지 않는 경우도 있는데 `params`값이 두번 째 인자 값이라 빈 객체를 전달해주곤 했다.<br>
하나의 객체로 수정함으로써 내가 원하는 값들만 전달할 수 있게 됐다.<br><br>

세 번째로 options의 select값을 전달해주는게 아니라 안에서 우선적으로 실행하도록 했다.<br>
처음 의도는 백앤드가 던져주는 `return` 값이 아니라 우선 `AxiosResponse`의 값을 `return` 되는 `data` 값으로 받을려고했다.<br>
그리고 필요하면 `select: (data) => data.data` 값을 옵션 인자의 프로퍼티로 전달하여 `data` 값에 백엔드가 전달하는 값을 받으려했다.<br>
하지만 여기서 불필요한 제네릭값을 한번 더 써줘야하는 문제점이 발생했다<br><br>
예를들면 `select: (data) => data.data` 값을 추가하면 `data`에 들어오는 타입이 변경되므로 아래 코드와 같이 동일한 타입을 제네릭으로 전달해줘야 했다.<br>

```tsx
const { data } = useGlobalQuery<
  BookSearchParameter,
  BookInformationReturnType,
  BookSearchParameter
>;
```

만약 `AxiosResponse` 타입의 `data`가 필요한 상황이라면 세번째 제네릭에 `AxiosResponse<K>` 값을 추가해주고 `select` 옵션을 `select: (data) => data` 값으로 전달해주면 원하는 `AxiosResponse` 타입의 `data`를 전달 받을 수 있다

마지막으로 `segement` 라는 인자를 추가해줬다.<br>
프로제트를 진행하다보니 URL에 특정한 값을 추가해야할 상황이 발생했다 예를들면 `details/:id` 값과 같은<br>
이러한 문제를 해결하기 위해 `URL` 뒤에 `segement`를 추가해 이러한 상황에 대응가능하게 리팩토링했다.

> 3차 리팩토링 때만해도 더이상 수정할 부분이 생길까? 라는 의문을 해봤는데 역시 코드에는 완성이라는 개념이 없는 것 같다. 실무에서 사용을 하며 문제가 생기면 주저하지 않고 5차 리팩토링을 통해서 더 나은 코드를 작성할 수 있도록 노력해야겠다.
