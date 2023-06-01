# React with RTK Query

RTK Query is a library that manages fetch operations. It also provides caching and working well with Redux. In this blog post, we'll learn basics of *RTK Query*.

- [React with RTK Query](#react-with-rtk-query)
  - [Creating API for RTK Query](#creating-api-for-rtk-query)
  - [Wrapping Your App with Provider](#wrapping-your-app-with-provider)
  - [Connecting Reducer to Store](#connecting-reducer-to-store)
  - [Using RTK Query Hooks on React](#using-rtk-query-hooks-on-react)


## Creating API for RTK Query

First thing we need to create is an API for RTK Query. In this blog post, I'll use [JSON Placeholder API]("https://jsonplaceholder.typicode.com/"). Let's create API. RTK Query serves us an API called `createAPI()` to accomplish this goal.\
`createAPI` is the core of RTK Query's functionality. It allows you to define a set of endpoints describe how to retrieve data from a series of endpoints, including configuration of how to fetch and transform that data. In most cases, you should use this once per app, with "one API slice per base URL" as a rule of thumb.

Lets create a file called `postsApi.js` under `/src/features` and write some code.

```js
// src/features/postsApi

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postsApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://jsonplaceholder.typicode.com/",
    }),
    endpoints: (builder) => ({
        getPostById: builder.query({
            query: (id) => ({
                url: `posts/${id}`,
            })
        }),
    }),
});

export const { useGetPostByIdQuery } = postsApi;


```

Before moving on, it's necessary to explain what this code does.

-   `fetchBaseQuery()` is a small wrapper around fetch that aims to simplify requests. Intended as the recommended baseQuery to be used in createApi for the majority of users.
-   `reducerPath` defines the reducer path, we'll need this during our store definition.
-   baseQuery defines the base path of our query, we can also define our headers here
-   `endpoints` is the place that we define our requests. You can define queries and mutations here. In this example, we have only one query that fetches posts from given id.
-   `useGetPostByIdQuery` is the hook that `createApi` creates for us. We'll use it during our fetch.

This is the basic example of a RTK Query.

## Wrapping Your App with Provider

As a second step, you have to wrap your app with ```<Provider />``` that redux serves us. `<ApiProvider />` Can be used as a Provider if you do not already have a Redux store.

Example of an Next.js app should look like:

```js
import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/src/store";

export default function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}
```

## Connecting Reducer to Store

After wrapping your application, you can create a redux store now. Redux store is the main structure that holds your global state. RTK Toolkit's `configureStore()` API helps us to create a store.

Let's create a store under `/src`, called it `store.js`.

```js
import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "./features/postsApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const store = configureStore({
    reducer: {
        [postsApi.reducerPath]: postsApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(postsApi.middleware),
});

setupListeners(store.dispatch);

export default store;
```

Lets digest the store code before moving on:

-   `configureStore` is the API that redux toolkit serves us. It basically easens the process of creating store from scratch. It is very similar with `createRootStore` of Redux. `configureStore` has different input fields, the code above is the most basic configuration. We basically add our reducer and middleware to Redux store.
-   `setupListeners` is the utility function that we can use later on. It is a utility used to enable `refetchOnMount` and `refetchOnReconnect` behaviors, which we can study later on.


Now, we are ready to connect our Redux store to Nextjs app.

## Using RTK Query Hooks on React

Using the hooks on react components are easy. \
You need to import the auto-generated React hooks from the API slice into your component file, and call the hooks in your component with any needed parameters. RTK Query will automatically fetch data on mount, re-fetch when parameters change, provide {data, isFetching} values in the result, and re-render the component as those values change:

```jsx
import * as React from 'react'
import { useGetPostByIdQuery } from './features/postsApi'

export default function App() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPostByIdQuery(2)
  // render UI based on data and loading state
}

```

The above code fetches the data whenever it renders. You can track fetch status and show loading spinner by using `isLoading` parameter. Please note the parameters shown here is not the whole options that hook serves us. You should check documentary to see further details.


