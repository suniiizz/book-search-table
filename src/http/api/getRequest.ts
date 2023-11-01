import axios from "axios";
export const getRequest = async () => {
  const response = await axios.get(
    `https://api.github.com/repos/tannerlinsley/react-query`,
  );

  return response.data;
};
export const GET_GLOBAL_REQUEST = {
  key: "test_data_2",
  URL: "https://api.github.com/repos/tannerlinsley/react-query",
};
