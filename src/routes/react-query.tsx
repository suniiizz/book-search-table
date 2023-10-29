import useGlobalQuery from "@/hooks/useGlobalQuery";
import { GET_GLOBAL_REQUEST } from "@/http/api/getRequest";
import { useGetRequest } from "@/services/useGetRequest";

const ReatcQuery = () => {
  const { data, isLoading, error } = useGetRequest();
  const { data: testData } = useGlobalQuery(GET_GLOBAL_REQUEST);

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div className="p-5 mb-5 border">
        <p className="mb-4">1. useQuery</p>
        <p>{data?.name}</p>
        <p>{data?.description}</p>
      </div>
      <div className="p-5 border">
        <p className="mb-4">2. useGlobalQuery</p>
        <p>{testData?.data.name}</p>
        <p>{testData?.data.description}</p>
      </div>
    </>
  );
};

export default ReatcQuery;
