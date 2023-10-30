- **route error**

  ## route error

  ### 📝 react-router-dom 에서 제공하는 errorElement로 에러를 핸들링 해보자

  `react-router-dom v6` 업데이트 이후 `v5`와 많은 부분이 변경됐다. 특히 `<RouteProvider />` 라는 컴포넌트를 이용해서 `createBrowserRouter` 함수의 리턴값을 전달해서 `route` 구조를 잡아 나갔다.

  ```tsx
  // @/App.tsx
  import { RouterProvider, createBrowserRouter } from "react-router-dom";
  import routes from "@/routes";

  const App = () => {
    const router = createBrowserRouter([routes]);
    return <RouterProvider router={router} />;
  };

  export default App;
  ```

  ```tsx
  // @/routes/index.tsx

  import { RouteObject } from "react-router-dom";
  import Main from "./main";
  import Layout from "@/components/layout";
  import RouteError from "@/components/error-component/route-error";
  const routes: RouteObject = {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <Main /> }],
    errorElement: <RouteError />,
  };

  export defa
  ```

  특이점은 `errorElement`를 이용해서 `404 에러`를 컨트롤 할 수 있다.

  ```tsx
  // @src/components/error-component/route-error.tsx
  import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
  import { CircleOff as CircleOffIcon } from "lucide-react";
  import { Button } from "@/components/ui/button";
  const RouteError = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error) && error.status === 404) {
      return (
        <div className="w-screen h-screen flex items-center justify-center flex-col gap-1">
          <CircleOffIcon className="w-1/6 h-1/6" />
          <p className="italic text-[6rem] font-bold">404</p>
          <p className="text-[2rem]">Page Not Found</p>
          <p className="text-xl">
            You can search for the page you want here or return to the homepage
          </p>
          <Button className="mt-5">
            <Link to="/">Back</Link>
          </Button>
        </div>
      );
    }
  };

  export default RouteError;
  ```

  라우팅하지 않은 URL로 접속하면 `useRouteError`에서 `error` 객체를 리턴 한다. 아직 다른 에러는 확인해보지 못했지만 단순히 `404` 에러를 제어하기에는 적합해 보인다.

  `404` 에러는 해당 기능을 통해서 쉽게 해결 할 수 있지만 그 외 다른 에러는 React에서 제공해주는 **`ErrorBoundary`** 기능을 학습할 필요가 있어보인다.

  - ErrorBoundary 참조자료
    - [링크](https://jikor1st.tistory.com/23?category=1271628)
    - [공식 문서](https://ko.legacy.reactjs.org/docs/error-boundaries.html)
