import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default Layout;
