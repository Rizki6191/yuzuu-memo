import { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPosts } from "../services/api";
import PostList from "../components/PostList";
import CodeBlock from "../components/CodeBlock";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0 && selectedPostId === null) {
      const slugMatch = window.location.pathname.match(/^\/posts\/([^/]+)/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const post = posts.find((p) => slugify(p.title) === slug);
        if (post) {
          setSelectedPostId(post.id);
          return;
        }
      }
      setSelectedPostId(posts[0].id);
    }
  }, [loading, posts, selectedPostId]);

  const selectedPost = posts.find((post) => post.id === selectedPostId);

  const headingCounter = useRef(0);

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[&/\\#,+()$~%.'":*?<>{}]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const getTextContent = (node) => {
    if (Array.isArray(node)) return node.map(getTextContent).join("");
    if (typeof node === "string") return node;
    if (node?.props?.children) return getTextContent(node.props.children);
    return "";
  };

  const HintParagraph = ({ children }) => {
    const text = getTextContent(children);
    if (text.trimStart().startsWith("|")) {
      const hintText = text.trimStart().slice(1).trimStart();
      return (
        <div className="hint-block">
          <span className="hint-pipe">|</span>
          <span>{hintText}</span>
        </div>
      );
    }
    return <p>{children}</p>;
  };

  const headings = useMemo(() => {
    const content = selectedPost?.content || "";
    const lines = content.split("\n");
    const counts = {};
    return lines.reduce((acc, line) => {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (!match) return acc;
      const level = match[1].length;
      const text = match[2].trim();
      const base = slugify(text) || "section";
      counts[base] = (counts[base] || 0) + 1;
      const id = counts[base] === 1 ? base : `${base}-${counts[base]}`;
      acc.push({ level, text, id });
      return acc;
    }, []);
  }, [selectedPost?.content]);

  const headingTree = useMemo(() => {
    const root = [];
    const stack = [{ level: 0, children: root }];
    headings.forEach((heading) => {
      const node = { ...heading, children: [] };
      while (stack.length > 1 && heading.level <= stack[stack.length - 1].level) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });
    return root;
  }, [headings]);

  const renderHeadingNodes = (items) => (
    <ul className="toc-items">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className={`toc-link level-${item.level}`}>
            {item.text}
          </a>
          {item.children.length > 0 && renderHeadingNodes(item.children)}
        </li>
      ))}
    </ul>
  );

  const renderHeading = (level) => ({ children }) => {
    const text = getTextContent(children);
    const heading = headings[headingCounter.current] || { id: slugify(text) || "section", text };
    headingCounter.current += 1;
    const Tag = `h${level}`;
    return (
      <Tag id={heading.id}>
        <a className="heading-link" href={`#${heading.id}`}>
          {children}
        </a>
      </Tag>
    );
  };

  const markdownComponents = {
    code: CodeBlock,
    p: HintParagraph,
    h1: renderHeading(1),
    h2: renderHeading(2),
    h3: renderHeading(3),
    h4: renderHeading(4),
    h5: renderHeading(5),
    h6: renderHeading(6)
  };

  headingCounter.current = 0;

  return (
    <main className="posts-page">
      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="section-label">Navigation</p>
            <h2>Latest posts</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading posts…</div>
        ) : (
          <div className="content-layout">
            <button
              type="button"
              className="button button-secondary sidebar-toggle mobile-sidebar-toggle"
              onClick={() => setSidebarOpen((visible) => !visible)}
            >
              {sidebarOpen ? "Close menu" : "Open menu"}
            </button>

            <div
              className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
              onClick={() => setSidebarOpen(false)}
            />

            <aside className={`post-sidebar ${sidebarOpen ? "open" : ""}`}>
              <div className="sidebar-header">
                <div>
                  <p className="section-label">Posts</p>
                  <h3>All writeups</h3>
                </div>
                <button
                  type="button"
                  className="button button-secondary sidebar-close-button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  {/* BUTTON */}
                </button>
              </div>
              <PostList
                posts={posts}
                selectedId={selectedPostId}
                onSelect={(id) => {
                  const post = posts.find((p) => p.id === id);
                  if (post) {
                    window.history.pushState({}, "", `/posts/${slugify(post.title)}`);
                  }
                  setSelectedPostId(id);
                  setSidebarOpen(false);
                }}
              />
              <div className="sidebar-footer">
                <p>Powered by <span className="highlight">CTF.Blog</span></p>
              </div>
            </aside>

            {/* ==================== HANYA BAGIAN INI YANG DIUBAH ==================== */}
            <article className="post-viewer overflow-x-hidden max-w-full">
              {selectedPost ? (
                <>
                  <div className="page-title">
                    <div>
                      <p className="post-label">POST</p>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                        {selectedPost.title}
                      </h1>
                    </div>
                  </div>

                  <div className="post-card-body bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 md:p-8 overflow-x-hidden">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {selectedPost.content}
                    </ReactMarkdown>
                  </div>
                </>
              ) : (
                <div className="empty-state">Pilih post untuk melihat konten.</div>
              )}
            </article>
            {/* ==================== AKHIR PERUBAHAN ==================== */}

            <aside className="toc-sidebar">
              <div className="sidebar-header">
                <div>
                  <p className="section-label">Daftar</p>
                  <h3>Isi konten</h3>
                </div>
              </div>
              {headings.length > 0 ? (
                <nav className="toc-list">
                  {renderHeadingNodes(headingTree)}
                </nav>
              ) : (
                <p className="toc-note">Konten belum memiliki judul markdown.</p>
              )}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Posts;