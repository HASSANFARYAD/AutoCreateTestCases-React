import { logout } from "../reducers/authReducer";
import { toast } from "react-toastify";

export const handleApiError = (error, dispatch, data) => {
  if (error) {
    let statusCode = "";
    error.status
      ? (statusCode = error.status)
      : (statusCode = error.statusCode);
    const errorMessage = error.message || "An error occurred on the server";

    switch (statusCode) {
      case 401:
        UnauthorizedErrorHandler(error, dispatch, data);
        break;
      default:
        console.log(
          `Server returned error with status ${statusCode}: ${errorMessage}`
        );
        toast.error(errorMessage);
        break;
    }
  } else if (error.request) {
    toast.error("No response received from the server");
  } else {
    toast.error("Error setting up the request:", error.message);
  }
};

const UnauthorizedErrorHandler = (error, dispatch, data) => {
  if (error.status === 401 || error.statusCode === 401) {
    const currentTime = Date.now() / 1000;
    const tokenExpiryTime =
      new Date(parseInt(data?.tokenExpiry)).getTime() / 1000;

    if (tokenExpiryTime && tokenExpiryTime < currentTime) {
      toast.error("Session has expired, Login Again");
      dispatch(logout());
    } else {
      toast.error("Unauthorized error, you dont have access");
    }
  } else {
    toast.error("Non-401 error occurred:", error);
  }
};

export const getResponse = (response, dispatch, user) => {
  if (!response?.data?.status) {
    handleApiError(response?.data, dispatch, user);
  } else {
    if (response?.data?.data) {
      return response?.data?.data;
    } else {
      return response?.data;
    }
  }
};
