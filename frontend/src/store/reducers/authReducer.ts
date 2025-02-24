import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

// Define a type for decoded token
interface DecodedToken {
  _id: string;  // Assuming user ID is stored in `_id`
  email?: string;
  exp?: number;
}

// Function to decode user ID from token
const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token); // ✅ Correct usage
    return decoded._id || null;
  } catch (error) {
    return null;
  }
};

// Define the slice state
interface AuthState {
  accessToken: string;
  refreshToken: string;
  userId: string | null; // ✅ Store user ID
  isAuthenticated: boolean;
  loading: boolean;
}

// Define initial state
const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token") ?? "",
  refreshToken: localStorage.getItem("refresh_token") ?? "",
  userId: getUserIdFromToken(localStorage.getItem("access_token") ?? ""), // ✅ Extract and store user ID
  isAuthenticated: Boolean(localStorage.getItem("access_token")),
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = getUserIdFromToken(action.payload.accessToken); // ✅ Extract and store user ID
      state.isAuthenticated = true;
    },
    resetTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.userId = null; // ✅ Reset user ID
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const data = action.payload.data;
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
        state.userId = getUserIdFromToken(data.accessToken); // ✅ Extract and store user ID
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.userId = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        state.accessToken = "";
        state.refreshToken = "";
        state.userId = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { setLoading, setTokens, resetTokens } = authSlice.actions;
export default authSlice.reducer;
