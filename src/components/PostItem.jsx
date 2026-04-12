import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

function PostItem({ post }) {
  const [show, setShow] = useState(false);

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div>
          <p className="post-label">POST</p>
          <h3>{post.title}</h3>
        </div>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {show && (
        <div className="post-card-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      )}
    </article>
  );
}

export default PostItem;