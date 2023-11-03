### React Query - keepPreviousData

토이 프로젝트를 진행하며 `react-query`에대해 학습 하던 중 `keepPreviousData` 라는 `useQuery`의 `option`인자의 `property`를 알게됐다<br>
이는 `date`의 상태값이 `Inactive`되어 새로운 데이터 요청을 할 때 깜빡거림 현상을 쉽게 해결 할 수 있는 장점을 가지고 있다.<br>
<br>

물론 `useQuery`의 `return`값인 `isLoading`으로 `Spinner` 컴포넌트를 노출 시켜 줄 수도 있지만 테이블 데이터의 UI가 매우 크기 때문에 테이블 레이아웃은 유지해주는게 좋다는 생각을 했다.<br><br>
_(물론 이러한 문제는 개발자인 나 혼자서 판단하기 보다는 실제 프로젝트를 진행할 때 기획자 또는 PM과 논의해야할 사항이라고 생각한다.)_<br><br>

또한 노출시켜주는 행의 갯수를 변경할 때는 기존테이블 아래에 새로운 테이블이 붙는 UX가 더 사용자 친화적이라고 생각하여 무조건 isLoading 값을 이용하기 보다는 keepPreviousData 옵션값을 사용해주는 것도 좋은 방법이라고 생각한다.<br><br>

```tsx
const { _data: data } = useGlobalQuery(
  "book",
  bookSearchParams,
  "book-search",
  { keepPreviousData: true },
);
```

```tsx
const useGlobalQuery = <T,>(
  URL: string,
  params: T,
  key: QueryKeyInformation,
  options?: UseQueryOptions,
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
export default useGlobalQuery;
```

~~라고 수정했는데 예상치 못한 `type` 이슈가 발생했다. 기존 프로젝트에서 사용하던 코드를 리팩토링해서 `option`값을 객체 인자로 전달해주었지만
`v5`와 `v4`의 버전차이인지 타입에러로 인해 해당 기능이 작동안하는 이슈가 발생했다. 해당 문제는 `useGlobalQuery`를 리팩토링하여 차후 수정하도록 하겠다.<br>~~

**이전 프로젝트에서 사용하던 `useGlobalQuery`에서 문제가 없으므로 타입 이슈만 해결해주면 된다.**

> **_라고 생각 했는데 이럴수가 V4 에서는 잘 사용했던 `keepPreviousData` 가 v5 버전에서는 없어지고 말았다 v4에서 비슷한 기능을 찾아보려 했으나 아직은 찾지 못했다. 즉 타입이슈 때문에 사용못한건 아니기 때문에 타입설정은 제대로 해줬으나 해당 프로퍼티 자체가 삭제되어 에러가 발생했던 것이다._**
