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
