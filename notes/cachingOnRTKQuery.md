# RTK Query Caching Mechanism

One of the benefits that RTK Query gives us is the caching mechanism. With caching, we can prevent unnecessary fetches to decrease load on the server. On modern web development, this approach is popular, and it's a good choice to use caching on your web apps.

On previous posts, we have [initialize RTK Query](), and also worked on [mutation operations on RTK Query](). In this post, we'll talk about caching mechanism on RTK Query.\
This blog tries to give information about caching and how RTK Query handles it.

- [RTK Query Caching Mechanism](#rtk-query-caching-mechanism)
  - [Caching](#caching)
  - [Caching on RTK Query](#caching-on-rtk-query)
    - [Caching Mechanism Example](#caching-mechanism-example)
  - [Manual Refetching](#manual-refetching)
    - [Manual Refetch with Refetch](#manual-refetch-with-refetch)
    - [Manuel Refetch with Initiate](#manuel-refetch-with-initiate)
  - [Automated Refetching](#automated-refetching)
    - [Tags](#tags)
      - [Providing Tags](#providing-tags)
      - [Invalidating Tags](#invalidating-tags)

## Caching

Caching is the mechanism that keeping data in some resources by the motivation of serving the user if they need them. On the web, caching is keeping data that we've fetched from the server in case we need to use later on. By keeping the data, we may prevent additional requests on the server which results in decrease on server load.\
As an example, consider fetching some posts from a database by using API. When you get the data, you will show the posts to users. User have read the post and then started to surf around your website. After some time, user wanted to see the same post, so instead of asking server, we can take the data from the cache, so we do not have to connect with server again.

## Caching on RTK Query

RTK Query helps us about caching. I think this is a good time to talk about some concepts that RTK Query has.
Remember that we've created APIs and connected it to redux on our previous blogs. Store that is connected to RTK Query has some specific data that RTK Query serves us.

RTK Query store is an object and has `query` and `subscription` fields. `query` field keeps the queries that we've done through RTK Query. `subscrtiption` field keeps the components that consumes the queries that we've done before.

> To keep track queries and subscriptions, RTK Query has `queryCacheKey` parameter.

As a rephrase, when we fetch data from the server, the data is stored on `query` field. Whenever a component uses the data from this specific query, `subscription` field will keep track of it.\
Whenever user makes another query that is on `query` field, it will not send request to server; data will be served from the RTK Query store.

Whenever we have unrender a component, RTK Query store deletes its track on `subscription` field. After amount of some time (1 min by default - and its changeable), if there are no component that is fed by that specific `query`, RTK Query store will delete the record on `query` field.

> There is a parameter called `keepUnusedDataFor` which defines the time that delete operation on query field for unsubscribed entities.

Let's go through an example.

### Caching Mechanism Example

I'll use the example on [official RTK page.](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)

```jsx
import { useGetUserQuery } from "./api.ts";

function ComponentOne() {
  // component subscribes to the data
  const { data } = useGetUserQuery(1);

  return <div>...</div>;
}

function ComponentTwo() {
  // component subscribes to the data
  const { data } = useGetUserQuery(2);

  return <div>...</div>;
}

function ComponentThree() {
  // component subscribes to the data
  const { data } = useGetUserQuery(3);

  return <div>...</div>;
}

function ComponentFour() {
  // component subscribes to the *same* data as ComponentThree,
  // as it has the same query parameters
  const { data } = useGetUserQuery(3);

  return <div>...</div>;
}
```

On the example above, our app will send fetch requests for id `1`, `2` and `3`. If we render `ComponentFour` after `ComponentThree`, we do not send get request on `ComponentFour`, and vice versa. Query parameters `1` and `2` will each have a single subscriber, while query parameter `3` has two subscribers. RTK Query will make three distinct fetches; one for each unique set of query parameters per endpoint.\
Data is kept in the cache as long as at least one active subscriber is interested in that endpoint + parameter combination. When the subscriber reference count reaches zero, a timer is set, and if there are no new subscriptions to that data by the time the timer expires, the cached data will be removed. The default expiration is 60 seconds.

Let's manipulate expiration timer on our project. add `keepUnusedDataFor` option to `createApi` and set it to 45. So our expiration time is 45s from now on.

```jsx
// src/features/postsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  keepUnusedDataFor: 45,
  endpoints: (builder) => ({
    getPostById: builder.query({
      query: (id) => ({
        url: `posts/${id}`,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
  }),
});

export const { useGetPostByIdQuery, useUpdatePostMutation } = postsApi;
```

> You can also set `keepUnusedDataFor` inside each query. The value that you write inside queries will override the general timer.

## Manual Refetching

It is possible to refetch your data manually by 2 different ways. You can use either use `refetch` that query hook serves or use `initiate` thunk action from dispatch object.

---

Before moving on further, I want to add some headers to our API to see fetching mechanism on RTK Query better. Browsers have some internal mechanism on caching, so you may miss whether RTK Query uses caching or not. To prevent that let's disable browser caching by setting some headers.

```jsx
// src/features/postsApi.js
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
  endpoints: (builder) => ({
    getPostById: builder.query({
      query: (id) => ({
        url: `posts/${id}`,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
  }),
});

export const { useGetPostByIdQuery, useUpdatePostMutation } = postsApi;
```

> Please note that you can add different headers for each mutation & query endpoint which overrules the general configuration like in `keepUnusedDataFor` example.

---

### Manual Refetch with Refetch

As I've told above, query hook serves us another function, which is `refetch`. Let's add refetch button on our `PostWithRTK` component.

```jsx
import { useGetPostByIdQuery } from "../features/postsApi";

const PostWithRTK = ({ id, setPostID, setSelectedPost, selectedPost }) => {
  const { data, isLoading, isError, isFetching, refetch } =
    useGetPostByIdQuery(id);

  if (isFetching) return <p>Fetching...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error during fetch id:{id}!</p>;
  if (data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
          margin: ".5rem",
        }}
      >
        <p>Post ID: {data.id}</p>
        <p>Title: {data.title}</p>
        <p>Post: {data.body}</p>
        <div>
          <button
            style={{ margin: "0 2rem 0 0" }}
            onClick={() => setSelectedPost(data)}
            disabled={selectedPost?.id === id}
          >
            {selectedPost?.id === id ? "Selected" : "Select"}
          </button>
          <button
            style={{ margin: "0 2rem 0 0" }}
            onClick={() => {
              setPostID((prev) => prev.filter((el) => el !== id));
            }}
          >
            Remove From List
          </button>
          <button style={{ margin: "0 2rem 0 0" }} onClick={() => refetch()}>
            Refetch with refetch()
          </button>
        </div>
      </div>
    );
  }
};

export default PostWithRTK;
```

When you click _Refect_ you'll send another get request to the server.

### Manuel Refetch with Initiate

Similar with `refetch`, you can directly use dispatch method to operate refetch operation. For this operation we need to import API itself and `useDispatch` from redux.

```jsx
import { useGetPostByIdQuery, postsApi } from "../features/postsApi";
import { useDispatch } from "react-redux";

const PostWithRTK = ({ id, setPostID, setSelectedPost, selectedPost }) => {
  const { data, isLoading, isFetching, refetch } = useGetPostByIdQuery(id);
  const dispatch = useDispatch();

  const refetchWithDispatch = () => {
    dispatch(
      postsApi.endpoints.getPostById.initiate(id, { forceRefetch: true })
    );
  };

  if (isFetching) return <p>Fetching...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
          margin: ".5rem",
        }}
      >
        <p>Post ID: {data.id}</p>
        <p>Title: {data.title}</p>
        <p>Post: {data.body}</p>
        <div>
          <button
            style={{ margin: "0 2rem 0 0" }}
            onClick={() => setSelectedPost(data)}
            disabled={selectedPost?.id === id}
          >
            {selectedPost?.id === id ? "Selected" : "Select"}
          </button>
          <button
            style={{ margin: "0 2rem 0 0" }}
            onClick={() => {
              setPostID((prev) => prev.filter((el) => el !== id));
            }}
          >
            Remove From List
          </button>
          <button style={{ margin: "0 2rem 0 0" }} onClick={() => refetch()}>
            Refetch with refetch()
          </button>

          <button
            style={{ margin: "0 2rem 0 0" }}
            onClick={refetchWithDispatch}
          >
            Refetch with dispatch initiate
          </button>
        </div>
      </div>
    );
  }
};

export default PostWithRTK;
```

## Automated Refetching

RTK Query also serves re-fetching on automated manner. When you call a `mutate` operation, you may need to refetch data from the server due to possible changes on data. RTK Query handles automated refetching with parameters called **tag**.

> Its same as cache invalidating.

### Tags

For RTK Query, tags are just a name that you can give to a specific collection of data to control caching and invalidation behavior for re-fetching purposes. It can be considered as a 'label' attached to cached data that is read after a mutation, to decide whether the data should be affected by the mutation.\
Tags are defined in the `tagTypes` argument when defining an api. For example, for out application that has both Posts, we might define `tagTypes: ['Post']` when calling `createApi`.

> An individual tag has a type, represented as a string name, and an optional `id`, represented as a `string` or `number`. It can be represented as a plain string (such as `'Post'`), or an object in the shape `{type: string, id?: string|number}` (such as `[{type: 'Post', id: 1}]`).

There are 2 types of tags, which are:

- Providing Tags
- Invalidating Tags

#### Providing Tags

A query can have its cached data provide tags. Doing so determines which 'tag' is attached to the cached data returned by the query. Same data structure with tags. (`providesTags` on `createApi`)

#### Invalidating Tags

A mutation can invalidate specific cached data based on the tags. Doing so determines which cached data will be either refetched or removed from the cache. (`invalidatesTags` on `createApi`)

So basically, invalidating tags will invalidate providing tag queries if they have same or common value.

Let's add tags to our RTK Query API.

```jsx
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
        result ? [{ type: "Post", id: arg.id }, "Post"] : ["Post"],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id % 2 },
        "Post",
      ],
    }),
  }),
});

export const { useGetPostByIdQuery, useUpdatePostMutation } = postsApi;
```

Please check `invalidatesTags` on mutation operation. It invalidates posts that has **id of even numbers**. On `providesTags` in query operation provides tags for **ALL** posts. When you make a mutation operation now, it'll refetch posts _that has even id numbers_.
