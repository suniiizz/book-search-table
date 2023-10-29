import { RouteObject } from "react-router-dom";
import Main from "./main";
import Layout from "@/components/layout";
import RouteError from "@/components/error-component/route-error";
import ReatcQuery from "./react-query";

const routes: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [
    { index: true, element: <Main /> },
    { path: "react-query", element: <ReatcQuery /> },
  ],
  errorElement: <RouteError />,
};

export default routes;
