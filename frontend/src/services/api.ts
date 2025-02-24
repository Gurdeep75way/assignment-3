import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { User, ApiResponse } from "../types";

const baseUrl = import.meta.env.VITE_API_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // User API
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => "/user/",
    }),
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/user/me`,
    }),
    user: builder.query<ApiResponse<User>, { id: string }>({
      query: ({ id }) => `/user/${id}`,
    }),
    login: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: `/user/login`, method: "POST", body }),
    }),
    register: builder.mutation<
      ApiResponse<User>,
      Omit<User, "_id" | "active" | "role"> & { confirmPassword: string }
    >({
      query: (body) => ({ url: `/user/register`, method: "POST", body }),
    }),

    updateUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({ url: `/user/`, method: "PUT", body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: `/user/logout`, method: "POST" }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useMeQuery,
  useUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useLogoutMutation,
} = api;
