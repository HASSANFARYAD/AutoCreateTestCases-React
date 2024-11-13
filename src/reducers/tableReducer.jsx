import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError, getResponse } from "../exception/handler";
import { toast } from "react-toastify";
import { API_URL } from "../utils/system-keys";

export const usersList = createAsyncThunk(
    "user/usersList",
    async (
      { page, size, sortColumn, sortDirection, searchParam },
      { rejectWithValue, getState, dispatch }
    ) => {
      const user = getState()?.auth?.userAuth;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
  
      try {
        const response = await axios.post(
          `${API_URL}Admin/GetUserTable?start=${page}&length=${size}&sortColumnName=${sortColumn}
          &sortDirection=${sortDirection}&searchValue=${searchParam}`,
          null,
          config
        );
        const responseBack = getResponse(response, dispatch, user);
        return responseBack;
      } catch (error) {
        handleApiError(error?.response?.data, dispatch, user);
      }
    }
  );


  const tableSlice = createSlice({
    name: "tables",
    initialState: {
      loading: false,
      appError: null,
      appStatus: null,
      appStatusCode: null,
      serverError: null,
    },
    extraReducers: (builder) => {
      builder
        .addCase(usersList.pending, (state, action) => {
          state.appError = undefined;
          state.loading = true;
          state.serverError = undefined;
          state.appStatus = action.payload?.status || null;
          state.appStatusCode = action.payload?.statusCode || null;
        })
        .addCase(usersList.fulfilled, (state, action) => {
          state.appError = undefined;
          state.loading = false;
          state.serverError = undefined;
          state.appStatus = action.payload?.status || null;
          state.appStatusCode = action.payload?.statusCode || null;
        })
        .addCase(usersList.rejected, (state, action) => {
          state.appError = action.payload?.message || null;
          state.serverError = action.error?.message || "An error occurred on the server.";
          state.appStatus = action.payload?.status || null;
          state.appStatusCode = action.payload?.statusCode || null;
          state.loading = false;
        });
    },
  });
  
  export default tableSlice.reducer;