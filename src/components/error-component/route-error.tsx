import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { CircleOff as CircleOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
const RouteError = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col gap-1">
        <CircleOffIcon className="w-1/6 h-1/6" />
        <p className="italic text-[6rem] font-bold">{error.status}</p>
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
