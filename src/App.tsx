import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "@/routes";
import { ModalContextProvider } from "@/components/modal/context/ModalContext";

const App = () => {
  const router = createBrowserRouter([routes]);

  return (
    <ModalContextProvider>
      <RouterProvider router={router} />
    </ModalContextProvider>
  );
};

export default App;
