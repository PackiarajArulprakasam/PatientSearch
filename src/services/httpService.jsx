import axios from "axios";
import { toast } from "react-toastify";

//axios interceptor for handling the unexpected errors globally
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log("Logging error from interceptors:", error);
    toast.error("Unexpected error occurred.");
  }

  return Promise.reject(error);
});

//get mehtod
export const get = async (url, resource = "", query = {}) => {
  try {
    const qryStr = formatQueryParams(query);
    const rsc = resource ? "/" + resource : "";
    const requestURL = `${url}${rsc}${qryStr}`;
    const config = {
      headers: {
        Accept: "application/json+fhir"
      }
    };

    return await axios.get(requestURL, config);
  } catch (error) {
    toast.error("Unable to connect to server", new Error(error));
  }
};

//Converts query params to a query string
const formatQueryParams = queryParams => {
  const queryString = Object.keys(queryParams)
    .map(key => `${key}=${queryParams[key]}`)
    .join("&");
  return queryString ? "?" + queryString : "";
};
