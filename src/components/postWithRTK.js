import { selectPokemon, removePokemonFromList } from "../features/pokemonSlice";
import { useGetPokemonByIdQuery } from "../features/pokemonApi";
import { useGetPostByIdQuery } from "../features/postsApi";

const PostWithRTK = ({ id, setPostID, setSelectedPost, selectedPost }) => {
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
                        style={{ margin: "0 2rem 0 0" }}
                        onClick={() => setSelectedPost(data)}
                        disabled={selectedPost?.id === id}
                    >
                        {selectedPost?.id === id ? "Selected" : "Select"}
                    </button>
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
