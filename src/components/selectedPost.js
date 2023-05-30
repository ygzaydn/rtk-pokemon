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
