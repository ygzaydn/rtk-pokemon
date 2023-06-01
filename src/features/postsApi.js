import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com/",
        headers: {
            "Cache-Control":
                "no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate",
        },
    }),
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getPostById: builder.query({
            query: (id) => ({
                url: `posts/${id}`,
            }),
            providesTags: (result, error, arg) =>
                result ? ["Post"] : ["Post"],
        }),
        updatePost: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `posts/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (result, error, arg) => [
                "Post",
                //{ type: "Post", id: arg.id % 2 },
            ],
        }),
    }),
});

export const { useGetPostByIdQuery, useUpdatePostMutation } = postsApi;
