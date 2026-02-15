import axios from "axios";
import getCookie from "../customFunctions/GetCookie";
import Cookies from "js-cookie";

// Separate axios client for multikart API (admin panel endpoints)
const multikartClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MULTIKART_API || "http://localhost:3001/api",
  headers: {
    Accept: "application/json",
  },
});

const multikartRequest = async ({ ...options }, router) => {
  console.log("🔍 Multikart API Request:", {
    baseURL: multikartClient.defaults.baseURL,
    url: options.url,
    fullURL: `${multikartClient.defaults.baseURL}${options.url}`
  });
  multikartClient.defaults.headers.common.Authorization = `Bearer ${getCookie("uat")}`;
  const onSuccess = (response) => response;
  const onError = (error) => {
    if (error?.response?.status == 401) {
      Cookies.remove("uat");
      Cookies.remove("ue");
      Cookies.remove("account");
      localStorage.clear();
      router && router.push("/404");
    }
    return error;
  };
  try {
    const response = await multikartClient(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error);
  }
};

export default multikartRequest;
