import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com/",
    }),
    tagTypes: ["Post"],
    endpoints: (builder) => ({
        getPostById: builder.query({
            query: (id) => `posts/${id}`,
            providesTags: (result, error, arg) =>
                result ? [{ type: "Post", id: result.id }, "Post"] : ["Post"],
        }),
        updatePost: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `posts/${id}`,
                method: "PATCH",
                body: patch,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Post", id: arg.id },
            ],
        }),
    }),
});

export const { useGetPostByIdQuery, useUpdatePostMutation } = postsApi;
