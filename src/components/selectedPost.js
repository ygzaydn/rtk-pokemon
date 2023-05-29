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
                <button onClick={() => setSelectedPost(null)}>Deselect</button>
            </div>
        </div>
    );
};

export default SelectedPost;
