import axios from "axios";

const config = {
  baseURL: "https://dapi.kakao.com/v3/search",
  headers: {
    Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
  },
};

const api = axios.create(config);

export default api;
