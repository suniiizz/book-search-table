# useQuery 어떻게 써야하는가?

`react-query`에서 `get` 요청을 담당하는 `useQuery`를 사용하면서 useState를 이용하지 않고서도 효율적인 상태 관리가 가능해졌습니다. 또한 강력한 `캐싱` 기능을 이용해서 (물론 아직 해당 기능을 잘 사용하고 있다고 생각하지는 않습니다.) 이전보다는 더 효율적으로 애플리케이션을 제작하고 있었습니다.

하지만 프로젝트가 점점 커지자 사용 중인 `useQuery`의 불편한 점을 발견했는데 어떠한 문제점인지 아래의 코드를 보면서 설명해 보겠습니다.

```tsx
import api from "@/api";
import { useQuery } from "@tanstack/react-query";

const getRequest = async () => {
  const response = await api.get(
    `https://api.github.com/repos/tannerlinsley/react-query`,
  );

  return response.data;
};

const useGetRequestQuery = () => ({
  queryKey: ["test_data_1"],
  queryFn: () => getRequest(),
});

const useGetRequest = () => {
  const { data, isLoading, error } = useQuery(useGetRequestQuery());

  return { data, isLoading, error };
};

export default useGetRequest;
```

위 코드는 프로젝트에서 사용 중인 `useQuery`를 이용한 `custom hook`의 핵심 일부 로직을 가져온 코드입니다.

실제로 백앤드와 통신에 필요한 함수는 `axios`를 `instance`한 `api`라는 객체를 `import`해와서 `get` 요청을 수행하고 그 응답 값인 `response`의 `data`를 `return` 하는 함수를 생성했습니다.

이후 `useQuery`의 인자로 전달해야 할 `queryKey`와 `queryFn`을 `property`를 가지는 객체를 리턴 하는 함수를 추가적으로 생성해 줍니다.

이후 해당 함수를 `useQuery`에 전달하여 로직에 필요한 데이터`(data, isLoading, error)`를 `return`하여 필요한 해당 데이터들이 필요한 컴포넌트에서 사용하고 있습니다.

이러한 `custom hook`을 만들게 되어 컴포넌트와 로직이 분리되어 보다 더 효율적인 코드를 작성할 수 있는 장점은 명확했습니다. (물론 상태 관리 기능 이상을 사용하고 있다고 생각은 하지 않습니다)

하지만 앞서 언급한 대로 프로젝트가 커지면서 매번 `get` 요청이 필요할 때마다 이러한 `custom hook`을 만들어야 했고 비록 `custom hook`의 `boiler plate`가 크게 복잡하진 않지만 매우 비효율적이라는 생각이 들었습니다.

저는 그래서 이 로직 역시 모듈화 하여 필요한 값들만 인자로 전달하여 (예를 들면 `api주소`, `queryKey`, `useQuery`의 `option객체`) 사용하면 더 편하지 않을까?라는 의문을 가지고 코드를 작성해봤습니다.

```tsx
import api from "@/api";
import { useQuery, ContextOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

type QueryInformationType = {
  key: string;
  URL: string;
};

const useGlobalQuery = <T, U>(
  params: T,
  { key, URL }: QueryInformationType,
  option?: U & ContextOptions,
) => {
  const { data, isError, isSuccess, refetch, remove, status, error } = useQuery(
    {
      queryKey: [key, params, URL],
      queryFn: () => http.get(URL, { params }),
      options: option,
    },
  );

  const _error = error as AxiosError;

  return { data, isError, isSuccess, refetch, remove, status, _error };
};

export default useGlobalQuery;
```

그 결과로 `useGlobalQuery`라는 `custom Hook`을 작성했습니다. `params`는 `get`요청에 필요한 `parameter` 값들을 전달해주는 객체고, `key`값과 `get`요청에 필요한 `URL`을 객체로 받아 각각 `get`요청의 `URL`과 `queryKey`의 `key`값으로 전달해줬습니다.

_몇 가지 타입에러가 발생했지만 중독성 강한 as 덕분에 해당 이슈를 모면할 수 있었습니다._

확실히 `useGlobalQuery`를 사용한 이후부터 느낌적인 느낌으로 조금 더 선언적인 코드를 작성한다고 생각했습니다.

기존에는 매번 새로운 파일을 만들고 `boiler plate` 코드를 써줘야 했지만

```tsx
const GET_GLOBAL_REQUEST = {
  key: "test_data_2",
  URL: "https://api.github.com/repos/tannerlinsley/react-query",
};
const { data: testData } = useGlobalQuery(GET_GLOBAL_REQUEST);
```

이처럼 `useGlobalQuery`를 이용하여 프로젝트에 적용하니 확실히 더 빠르게 진행할 수 있었습니다.

하지만 여전히 사수 없이, 조력자 없이 저를 비난, 비판해주는 사람이 없다 보니 매번 머릿속에서 지울 수 없는 생각 이 코드가 과연 나의 최선일까?라는 생각이 계속 머리에 맴돌았습니다.

더 잘 만들 수 있을까?라는 생각도 들었지만 그것보다 더 머릿속에서 울리는 목소리는 과연 정말 이게 `useQuery`의 의도대로 만든 코드일까?라는 근본적인 불안감 역시 지울 수 없었습니다.

또한 몇 가지 알 수 없는 이슈들에 직면했습니다. 사용하는데 있어서는 큰 문제가 되지 않았지만 가령

```tsx
const useGlobalQuery = <T, U>(
  params: T,
  { key, URL }: QueryInformationType,
  option?: U & ContextOptions,
) => {
  const { data, isError, isSuccess, refetch, remove, status, error } = useQuery(
    {
      queryKey: [key, params, URL],
      queryFn: () => http.get(URL, { params }),
      options: option,
    },
  );
```

해당 코드에서 저 같은 경우 `queryKey` 배열 값에는 `key`값만 넣어주고 싶었지만 망할 `eslint`에서 자꾸 `params`와 `URL`을 다 넣지 않으면 오류가 발생해 `husky`가 `commit`을 막아버리는 문제가 발생했습니다.

프로젝트 진행을 위해 우선 모든 값을 배열에 넣긴 했지만 어딘가 찜찜한 기분은 여전히 사라지지 않고 현재 진행중입니다.

이렇게 작성한 코드가 나중에 이슈가 생겼을 때 확장성에 문제가 없냐는 고민도 끊임없이 들었습니다.

하지만 `react-query`의 공식 문서는 너무나 불친절했고 이 문제를 스스로 해결하기엔 제가가진 인사이트가 너무 부족해서 눈물이 날 지경입니다.

그러나 분명히 이러한 문제를 기록해둘 필요가 있다고 생각하여 부끄러운 코드지만 작성해두고 더 나은 코드로 작성하도록 노력해보겠습니다.
