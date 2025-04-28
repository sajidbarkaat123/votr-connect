import { baseURL } from "@/configs";
import { RootState } from "@/store";
import { BaseQueryApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const prepareHeaders = (
    headers: Headers,
    { getState }: Pick<BaseQueryApi, "getState">
) => {
    const state = getState() as RootState;
    const token = state.auth.token || localStorage.getItem("jwtToken");

    if (token) {
        headers.set("Authorization", `${token}`);
    }

    return headers;
};

console.log(baseURL, "baseURL");
const baseQuery = fetchBaseQuery({
    baseUrl: `${baseURL}/`,
    prepareHeaders,
});

export default baseQuery