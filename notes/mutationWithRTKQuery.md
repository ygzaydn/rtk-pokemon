# RTK Query Mutation Operation

On our [previous blog](https://erolyagizaydin.vercel.app/blog/20), we've successfully set up our RTK Query API and connect it redux. We also show how to fetch daha and how fetch mechanism works.\
In this blog, we'll try to `mutate` operations of RTK Query serves us. Mutation operations are basically operations that aims to change data on the backend. You can think them as *PUT, UPDATE, PATCH, DELETE* operations of REST APIs. \
In order to operate `mutate` operations, we have to add mutate endpoints to our RTK Query API. Let's start with this step.


- [RTK Query Mutation Operation](#rtk-query-mutation-operation)
  - [Adding Mutate Operation to RTK Query API](#adding-mutate-operation-to-rtk-query-api)
  - [Creating React Components](#creating-react-components)
  - [Adding Mutation Functions](#adding-mutation-functions)


## Adding Mutate Operation to RTK Query API

Similar to queries, we need to add mutate operations on `endpoints` field of our API. Let's add code that sends `PATCH` request to our backend.

```js
// src/features/postsApi.js

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

As you can see above, adding `mutation` operation is very similar to queries. You basically give your endpoint, method to operate and the data you want to change. \
Before moving on, I want to create some react components to demonstrate the endpoints that we've built.

## Creating React Components

First thing we'll add is the component to fetch new posts for us. We'll have 2 different ways to get posts. First one is the posts with random id, second one is for dedicated id's that we'll provide. \
To begin with, I'll add button for random fetching.

```jsx
// pages/index.js

import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function Home() {
    const [postID, setPostID] = useState([]);

    return (
            <main className={`${styles.main} ${inter.className}`}>
                    <div style={{ margin: "0 2rem" }}>
                        <p>Fetching posts with RTK Query</p>

                        <button
                            style={{ margin: ".5rem 0" }}
                            onClick={() => {
                                const newPostIDs = [...postID];
                                newPostIDs.push(getRandomInt(100));
                                setPostID(newPostIDs);
                            }}
                        >
                            Fetch Random Post
                        </button>
                    </div>
            </main>
    );
}
```

We basically keep the ID's that we're interested on a state. Later on we'll fetch those ID's on `postWithRTK` component. Whenever user clicks the button, new random ID will be added to postID state. \
As a second step, lets add an input field, and another button for dedicated id's.

```jsx
// pages/index.js

import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default function Home() {
    const [postID, setPostID] = useState([]);
    const text = useRef("");


    return (
            <main className={`${styles.main} ${inter.className}`}>
                    <div style={{ margin: "0 2rem" }}>
                        <p>Fetching posts with RTK Query</p>

                        <button
                            style={{ margin: ".5rem 0" }}
                            onClick={() => {
                                const newPostIDs = [...postID];
                                newPostIDs.push(getRandomInt(100));
                                setPostID(newPostIDs);
                            }}
                        >
                            Fetch Random Post
                        </button>
                        <div>
                            <input ref={text} />
                            <button
                                onClick={() => {
                                    const newPostIDs = [...postID];
                                    newPostIDs.push(
                                        parseInt(text.current.value)
                                    );
                                    setPostID(newPostIDs);
                                }}
                            >
                                Fetch this ID
                            </button>
                        </div>
                    </div>
            </main>
    );
}
```

We keep track dedicated id with `useRef` hook and add it to our state. Now we're ready to create a component for our posts and show it to user. Let's crate a new component called `postWithRTK` and add the code below.

```jsx
// components/postWithRTK.js
import { useGetPostByIdQuery } from "../features/postsApi";

const PostWithRTK = ({ id, setPostID }) => {
    const { data, isLoading, error, isFetching } = useGetPostByIdQuery(id);

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
                        onClick={() => {
                            setPostID((prev) => prev.filter((el) => el !== id));
                        }}
                    >
                        Remove From List
                    </button>
                </div>
            </div>
        );
    }
};

export default PostWithRTK;
```

Now, whenever a new ID is added to our postID state, we'll render a new `PostWithRTK` component to show it to our user. When a new `PostWithRTK` is rendered, it'll fetch given id from the server immediately. During fetching operation, it'll show *Fetching...* text. If the related query is on the `queries` list of the RTK Query, you'll see *Loading...* text. Whenever the data is available, you'll see the data itself.  \
Next step should be adding the component to the `index.js`. I won't write the all code below, just the code that we'll add is on below. 

```jsx
// pages/index.js
...
<div>
    {postID.length > 0 && (
        <div>
            <p>RTK Query PostID</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                {postID.map((el) => (
                    <PostWithRTK
                        key={el}
                        id={el}
                        setPostID={setPostID}
                    />
                ))}
            </div>
        </div>
    )}
</div>
...
```

Now we're able to render new posts on screen. \
For mutation operations, I want to select a post from the screen, and try to change it's ID. So let's add new state called `selectedPost` and pass it's information to `PostWithRTK` component.

```jsx
// pages/index.js
...
const [selectedPost, setSelectedPost] = useState(null)

<div>
    {postID.length > 0 && (
        <div>
            <p>RTK Query PostID</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                {postID.map((el) => (
                    <PostWithRTK
                        key={el}
                        id={el}
                        setPostID={setPostID}
                        setSelectedPost={setSelectedPost}
                        selectedPost={selectedPost}
                    />
                ))}
            </div>
        </div>
    )}
</div>
...

```

And, add the following code to `postwithRTK` component.

```jsx
// components/postWithRTK.js
 <button
    style={{ margin: "0 2rem 0 0" }}
    onClick={() => setSelectedPost(data)}
    disabled={selectedPost?.id === id}
>
    {selectedPost?.id === id ? "Selected" : "Select"}
</button>

```

To show selected post on the screen, let's create a new component called `selectedPost`.

```jsx
// components/selectedPost.js
const SelectedPost = ({ title, body, id, setSelectedPost }) => {

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <p>Post ID: {id}</p>
            <p>Title: {title}</p>
            <p>Post: {body}</p>
            <div>
                <button
                    onClick={() => setSelectedPost(null)}
                    style={{ marginBottom: "1rem" }}
                >
                    Deselect
                </button>
            </div>
        </div>
    );
};

export default SelectedPost;
```

And connect it to `index.js`

```jsx
// pages/index.js

...
{selectedPost && (
    <div>
        <SelectedPost
            {...selectedPost}
            setSelectedPost={setSelectedPost}
        />
    </div>
)}
...

```

Now it's time to add mutation functions to our application.

## Adding Mutation Functions

As we've planned, we'll try to change ID of selected posts. So it's the best place to use mutation hook on `SelectedPost` component. Finalized code should look like below. Please check the code, after that I'll try to explain what we've done.

```jsx
// components/SelectedPost.js

import { useState } from "react";
import { useUpdatePostMutation } from "../features/postsApi";

const SelectedPost = ({ title, body, id, setSelectedPost }) => {
    const [postID, setPostID] = useState(id);

    const [updatePost, { isLoading, isSuccess, isError } = result] =
        useUpdatePostMutation();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <p>Post ID: {id}</p>
            <p>Title: {title}</p>
            <p>Post: {body}</p>
            <div>
                <button
                    onClick={() => setSelectedPost(null)}
                    style={{ marginBottom: "1rem" }}
                >
                    Deselect
                </button>

                <div>
                    <p>Change ID of the post</p>
                    <input
                        value={postID}
                        onChange={(e) => setPostID(e.target.value)}
                    />
                    <button
                        onClick={() =>
                            updatePost({
                                id,
                                patch: JSON.stringify({ id: postID }),
                            })
                        }
                    >
                        Change
                    </button>
                    <span>
                        {isSuccess && "Patch request successed"}
                        {isLoading && "Patch request is processing"}
                        {isError && "Error during patch request"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SelectedPost;

```

We basically add a text input to enter our ID, connect this input to a new state, and a onChange listener to keep state alive. Those are the basic react operations. The valuable piece of codes are RTK Query codes. \
Unlike query operations, mutate operations has a **trigger** function to make them happen. Remember, by default query operations runs whenever the component renders (this is not an obligation, you can use `skip` parameter to prevent this action, but this is another post's topic), on the other hand you have to run **trigger** function to operate mutate operation. In our case, `updatePost` is our **trigger** function. \
We can send the mutate operation by following function: 

``` js
updatePost({
    id,
    patch: JSON.stringify({ id: postID }),
})
```

First parameter is the ID of our post, second parameter is the body. \
We also have `isLoading`, `isSuccess` and `isError` parameters just like on the query hooks. So by using RTK Query, that is how you operate mutation operations.