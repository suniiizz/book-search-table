# React Query

**리액트 쿼리란?**

- 비동기 데이터를 관리하기 위한 라이브러리이다.
- Axios나 Fetch API와 같은 fetching 라이브러리와 원활하게 작동되도록 설계되었다.

**리액트 쿼리를 쓰는 이유는?**

- 직관적인 API 코드이며 서버 상태 관리에 용이하다.
- 보일러플레이트를 방지한다.
- 캐싱을 통해 반복적인 데이터 호출을 방지한다.
- devtool을 지원하여 데이터 흐름을 파악할 수 있다.
 <br />
   
## 설치

```jsx
npm i @tanstack/react-query

// devtool 설치
npm i @tanstack/react-query-devtools
```
 <br />
   
## 세팅

```jsx
import ReactDOM from "react-dom/client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "@/App.tsx";
import { AuthContextProvider } from "@/hooks/services/user/context/auth";
import "@/index.css";
import { queryClient } from "@/query/client.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
```

`QueryClientProvider`는 비동기 요청을 처리하기 위한 `ContextProvider`로 동작하며 앱 전체에서 생성한 `QueryClient`에 접근이 가능하도록 한다.
  
 <br />
   
## ➡️ 리액트 쿼리를 어떻게 쓰는게 좋을까?

기본으로 제공하는 `useQuery`와 `useMutation` 두가지의 hook이 있지만, 함수형 컴포넌트 안에서 사용해야 하거나 커스텀이 제한적일 수 있다. 그러하여 `Custom hook`을 만들어 추가 로직이 있거나 등 좀 더 유연하게 사용하려고 한다.

- **기본 제공 hook을 사용할 경우**
    - 컴포넌트 내에 로직 코드가 종속되는 느낌
    - 반복적인 코드 작성
    - 재사용이 어렵고 유사 시 코드 수정이 어렵다.
 <br />
   
- **custom hook을 사용할 경우**
    - 복잡한 로직일 경우 커스텀이 가능하다.
    - 다수의 컴포넌트에서 데이터에 접근할 경우 매번 코드를 작성할 필요 X
    - 재사용과 수정이 용이하다.
 <br />
   
## useQuery
- get API 요청을 위한 hook이다.
- 비동기로 동작한다. (여러개의 query는 `useQueries` 사용)
- `QueryKey`를 기반으로 데이터 캐싱을 관리한다.
- 파라미터
    - `unique key` : 해당 쿼리의 고유 식별자(배열이어야 함)
    - `queryFn` : 쿼리에 사용할 promise 기반의 비동기 API 함수
    - `options` : 쿼리에 사용할 옵션
- 반환값
    - `data`: fetch한 데이터. 데이터가 fetch될 때까지 `undefined` 의 값을 가진다.
    - `status`: 쿼리의 상태. `loading`, `error`, `success`의 세가지 종류가 있고 string 값을 가진다.
    - `error`: 쿼리에 오류가 발생한 상태. 에러의 세부 정보를 확인 할 수 있다.
    - `isError` : 쿼리에 오류가 발생한 상태. 데이터가 정의되지 않기 때문에 반환 값이 필요하며 boolean 값을 가진다.
    - `isFetching`: 쿼리가 fetching 중인지 여부를 나타내는 값으로 boolean 값을 가진다.
    - `isSuccess` :  쿼리의 상태가 성공 했을 때의 값으로 boolean 값을 가진다.
    - `isLoading` : 쿼리에 아직 데이터가 없다.
 <br />
   
  ### 1. useQuery.ts
  
  ```jsx
  import { useQuery as _useQuery } from "@tanstack/react-query";
  import { Query } from "query";
  
  const useQuery = <TQueryFn>({
    queryKey,
    queryFn,
    options,
  }: Query<TQueryFn>) => {
    return _useQuery<TQueryFn>({
      queryKey,
      queryFn,
      ...options,
    });
  };
  
  export default useQuery;
  ```
  
  - `useQuery`는 제네릭 함수로, `Query`라는 타입을 받습니다. 이 타입은 쿼리 함수의 파라미터와 옵션에 대한 타입 정보를 나타낸다.
  - `React Query`의 `useQuery`를 사용하면서, `queryKey`, `queryFn`, `options`을 받아와 호출한다.
  
  ```jsx
  import axios from "axios";
  
  export const getRequest = async () => {
    const response = await axios.get(
      `https://api.github.com/repos/tannerlinsley/react-query`,
    );
  
    return response.data;
  };
  ```
  
  - `getRequest` 함수는 `axios`를 사용하여 API에서 데이터를 가져오는 비동기 함수이다.
  
  ```jsx
  import useQuery from "@/hooks/useQuery";
  import { getRequest } from "@/http/api/getRequest";
  
  export const useGetRequestQuery = () => ({
    queryKey: ["test_data_1"],
    queryFn: () => getRequest(),
  });
  
  export const useGetRequest = () => {
    const { data, isLoading, error } = useQuery(useGetRequestQuery());
  
    return { data, isLoading, error };
  };
  ```
  
  - `useGetRequestQuery` 커스텀 훅은 `React Query`의 쿼리를 정의하는 역할을 한다. 이 쿼리는 `queryKey`와 `queryFn`을 정의하여 `getRequest` 함수를 사용하여 데이터를 가져오도록 한다.
  - `useGetRequest` 커스텀 훅은 `useGetRequestQuery`를 사용하여 데이터를 가져오는데 필요한 쿼리를 정의하고, `useQuery`를 호출하여 데이터를 가져오는 비동기 작업을 수행한다. 결과적으로 데이터, 로딩 상태(`isLoading`), 오류(`error`)를 반환한다.

  <br />
    
  
  > 💡 **위처럼 `custom hook`을 만들었지만, `url`마다 반복적인 코드를 작성해야 하거나 수정이 쉽지 않은 이슈가 생겼다.
   이를 해결하기 위해 `useGlobalQuery`라는 새로운 `custom hook`을 만들었다.**
  
   <br />
   
  ### 2. useGlobalQuery.ts
  
  ```jsx
  import axios from "axios";
  import useQuery from "@/hooks/useQuery";
  import { queryInformationType } from "query";
  
  const useGlobalQuery = ({ key, URL }: queryInformationType) => {
    const { data, isError, isSuccess, error } = useQuery({
      queryKey: [key, URL],
      queryFn: () => axios.get(URL),
    });
  
    return { data, isError, isSuccess, error };
  };
  export default useGlobalQuery;
  ```
  
  - `useGlobalQuery`는 `key`와 `URL`을 받아온다. 이 때 타입은 `queryInformationType`을 가진다.
  - `useQuery`를 호출하여 데이터를 가져온다. `queryKey`와 `queryFn`을 설정하고, `axios`를 사용하여 서버에서 데이터를 가져온다.
  - 데이터를 가져오는데 성공하면 `data`, `isSuccess`, `error`를 반환한다.
  
  ```jsx
  export const GET_GLOBAL_REQUEST = {
    key: "test_data_2",
    URL: "https://api.github.com/repos/tannerlinsley/react-query",
  };
  
  // example
  const { data } = useGlobalQuery(GET_GLOBAL_REQUEST);
  ```
  
  - `GET_GLOBAL_REQUEST` 객체는 API에 대한 요청 정보를 정의한다. 이 객체는 `key`와 `URL`을 가지고 있다.
  - `useGlobalQuery` 커스텀 훅에 인자로 전달하여 데이터를 반환한다.
