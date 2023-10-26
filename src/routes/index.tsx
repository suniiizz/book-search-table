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

export default routes;
