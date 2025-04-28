import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/libs/baseQuery";
import { IFileUploadIntegration, IGraphQlIntegration, IIntegrationCatalog, IRestApiIntegration } from "@/types/integration-catalog";

const integrationCatalogApi = createApi({
    reducerPath: "integrationCatalogApi",
    baseQuery,

    endpoints: (builder) => ({
        getIntegrationCatalog: builder.query<IIntegrationCatalog[], void>({
            query: () => ({
                url: "integration-catalog",
                method: "GET",
            }),
            transformResponse: (response: { data: IIntegrationCatalog[] }) => response.data
        }),
        getRestAPIIntegration: builder.query<any[], void>({
            query: () => ({
                url: "rest-api-integration",
                method: "GET",
            }),
            transformResponse: (response: { data: IRestApiIntegration[] }) => response.data
        }),
        getGraphQLIntegration: builder.query<any[], void>({
            query: () => ({
                url: "graphql-integration",
                method: "GET",
            }),
            transformResponse: (response: { data: IGraphQlIntegration[] }) => response.data
        }),
        getFileUploadIntegration: builder.query<any[], void>({
            query: () => ({
                url: "file-integration",
                method: "GET",
            }),
            transformResponse: (response: { data: IFileUploadIntegration[] }) => response.data
        }),
        getFileUploadIntegrationById: builder.query<IFileUploadIntegration, string>({
            query: (id) => ({
                url: `file-integration/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: IFileUploadIntegration }) => response.data
        }),

        updateFileUploadIntegration: builder.mutation<IFileUploadIntegration, { id: string; data: Partial<IFileUploadIntegration> }>({
            query: ({ id, data }) => ({
                url: `file-integration/${id}`,
                method: "PATCH",
                body: data
            }),
        }),
        restApiIntegration: builder.mutation<void, any>({
            query: (data) => ({
                url: "/rest-api-integration",
                method: "POST",
                body: data
            })

        }),
        graphqlIntegration: builder.mutation<void, any>({
            query: (data) => ({
                url: "/graphql-integration",
                method: "POST",
                body: data
            })
        }),
        fileUploadIntegration: builder.mutation<void, any>({
            query: (data) => ({
                url: "/file-integration",
                method: "POST",
                body: data
            })
        }),
        deleteRestApiIntegration: builder.mutation<void, string>({
            query: (id) => ({
                url: `/rest-api-integration/${id}`,
                method: "DELETE",
            })
        }),
        deleteGraphqlIntegration: builder.mutation<void, string>({
            query: (id) => ({
                url: `/graphql-integration/${id}`,
                method: "DELETE",
            })
        }),
        deleteFileUploadIntegration: builder.mutation<void, string>({
            query: (id) => ({
                url: `/file-integration/${id}`,
                method: "DELETE",
            })
        }),
        getRestAPIIntegrationById: builder.query<IRestApiIntegration, string>({
            query: (id) => ({
                url: `rest-api-integration/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: IRestApiIntegration }) => response.data
        }),
        updateRestAPIIntegration: builder.mutation<any, { id: string; data: Partial<any> }>({
            query: ({ id, data }) => ({
                url: `rest-api-integration/${id}`,
                method: "PUT",
                body: data
            }),
        }),
        getGraphQLIntegrationById: builder.query<IGraphQlIntegration, string>({
            query: (id) => ({
                url: `graphql-integration/${id}`,
                method: "GET",
            }),
            transformResponse: (response: { data: IGraphQlIntegration }) => response.data
        }),
        updateGraphQLIntegration: builder.mutation<IGraphQlIntegration, { id: string; data: Partial<IGraphQlIntegration> }>({
            query: ({ id, data }) => ({
                url: `graphql-integration/${id}`,
                method: "PUT",
                body: data
            }),
        }),
    })
});

export const { useGetIntegrationCatalogQuery,
    useRestApiIntegrationMutation,
    useGraphqlIntegrationMutation,
    useFileUploadIntegrationMutation,
    useGetRestAPIIntegrationQuery,
    useGetGraphQLIntegrationQuery,
    useGetFileUploadIntegrationQuery,
    useDeleteRestApiIntegrationMutation,
    useDeleteGraphqlIntegrationMutation,
    useDeleteFileUploadIntegrationMutation,
    useGetFileUploadIntegrationByIdQuery,
    useUpdateFileUploadIntegrationMutation,
    useGetRestAPIIntegrationByIdQuery,
    useUpdateRestAPIIntegrationMutation,
    useGetGraphQLIntegrationByIdQuery,
    useUpdateGraphQLIntegrationMutation,
} = integrationCatalogApi;

export default integrationCatalogApi