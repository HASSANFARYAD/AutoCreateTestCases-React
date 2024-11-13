import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../exception/handler";
import { toast } from "react-toastify";
import { API_URL } from "../utils/system-keys";

//#region User Authentication Actions

export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${API_URL}Auth/Login`, userData, config);
      const responseBack = getResponse(response, dispatch);
      
      if (!responseBack) return responseBack;

      localStorage.setItem("userInfo", JSON.stringify(responseBack));
      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch);
    }
  }
);

export const companyLogin = createAsyncThunk(
  "user/companyLogin",
  async (userData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${API_URL}Auth/PostCompanyLogin`, userData, config);
      const responseBack = getResponse(response, dispatch);

      if (!responseBack) return responseBack;

      localStorage.setItem("userInfo", JSON.stringify(responseBack));
      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.auth?.userAuth;

    try {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("modalShown");
    } catch (error) {
      return handleApiError(error, dispatch, user);
    }
  }
);

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//#endregion

//#region User Profile Actions

export const fetchLoggedInUser = createAsyncThunk(
  "user/fetchProfile",
  async (id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.get(`${API_URL}Auth/GetLoggedinUser?id=${id}`, config);
      const responseBack = getResponse(response, dispatch, user);
      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch, user);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  "user/updateProfilePicture",
  async (user, { rejectWithValue, getState, dispatch }) => {
    const currentUser = getState()?.authentication?.userAuth;
    const formData = new FormData();
    formData.append("id", user.Id);

    if (user.isDeleted) {
      formData.append("isDelete", 1);
    } else {
      formData.append("file", user.file);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await axios.put(`${API_URL}Auth/UpdateProfilePicture`, formData, config);
      const responseBack = getResponse(response, dispatch, user);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }

      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch, user);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userProfile, { rejectWithValue, getState, dispatch }) => {
    const currentUser = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };

    try {
      const response = await axios.put(`${API_URL}Auth/UpdateProfile`, userProfile, config);
      const responseBack = getResponse(response, dispatch, currentUser);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }

      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch, currentUser);
    }
  }
);

//#endregion

//#region Password Actions

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue, getState, dispatch }) => {
    const currentUser = getState()?.authentication?.userAuth;
    const config = {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`,
      },
    };

    try {
      const response = await axios.put(`${API_URL}Auth/UpdatePassword`, passwordData, config);
      const responseBack = getResponse(response, dispatch, currentUser);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }

      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch, currentUser);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${API_URL}Auth/ForgotPassword`, email, config);
      const responseBack = getResponse(response, dispatch);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }

      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (resetData, { rejectWithValue, getState, dispatch }) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(`${API_URL}Auth/ResetPassword`, resetData, config);
      const responseBack = getResponse(response, dispatch);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
      }

      return responseBack;
    } catch (error) {
      return handleApiError(error, dispatch);
    }
  }
);

//#endregion

//#region Slice Definition

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    userAuth: userFromStorage,
    loading: false,
    appError: null,
    appStatus: null,
    appStatusCode: null,
    serverError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.appError = undefined;
        state.loading = true;
        state.serverError = undefined;
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.userAuth = action?.payload;
        state.appError = undefined;
        state.loading = false;
        state.serverError = undefined;
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.appError = action.payload?.message || null;
        state.serverError = action.error?.message || "An error occurred on the server.";
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
        state.loading = false;
      });

    builder
      .addCase(companyLogin.pending, (state, action) => {
        state.appError = undefined;
        state.loading = true;
        state.serverError = undefined;
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
      })
      .addCase(companyLogin.fulfilled, (state, action) => {
        state.userAuth = action?.payload;
        state.appError = undefined;
        state.loading = false;
        state.serverError = undefined;
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
      })
      .addCase(companyLogin.rejected, (state, action) => {
        state.appError = action.payload?.message || null;
        state.serverError = action.error?.message || "An error occurred on the server.";
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
        state.loading = false;
      });

    builder
      .addCase(logout.pending, (state, action) => {
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.userAuth = undefined;
        state.loading = false;
        state.appError = undefined;
        state.serverError = undefined;
      })
      .addCase(logout.rejected, (state, action) => {
        state.appError = action.payload?.message || null;
        state.serverError = action.payload?.message || null;
        state.appStatus = action.payload?.status || null;
        state.appStatusCode = action.payload?.statusCode || null;
        state.loading = false;
      })
},
});

export default authenticationSlice.reducer;
