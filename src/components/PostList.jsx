function PostList({ posts, selectedId, onSelect }) {
  return (
    <div className="post-sidebar-list">
      {posts.map((post) => (
        <button
          key={post.id}
          type="button"
          className={`post-nav-item ${
            selectedId === post.id ? "active" : ""
          }`}
          onClick={() => onSelect(post.id)}
        >
          {post.title}
        </button>
      ))}
    </div>
  );
}

export default PostList;