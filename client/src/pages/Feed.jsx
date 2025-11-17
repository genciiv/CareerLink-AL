// client/src/pages/Feed.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/feed.css";

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "sapo";
  if (diffMinutes < 60) return `${diffMinutes} min më parë`;
  if (diffHours < 24) return `${diffHours} orë më parë`;
  if (diffDays < 7) return `${diffDays} ditë më parë`;
  return date.toLocaleDateString("sq-AL");
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState({}); // { postId: "koment..." }

  const currentUserRaw = localStorage.getItem("user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Nuk u ngarkua feed-i. Provo të rifreskosh faqen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Që të postosh, duhet të futesh në llogari.");
      return;
    }
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      setError("");
      const { data } = await api.post("/posts", {
        content: newPost.trim(),
      });
      setPosts((prev) => [data, ...prev]);
      setNewPost("");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Nuk u krijua postimi. Provo sërish.";
      setError(msg);
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (postId) => {
    if (!currentUser) {
      setError("Që të pëlqesh postimet, duhet të futesh në llogari.");
      return;
    }

    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      console.error(err);
      setError("Nuk u realizua veprimi i like.");
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Që të komentosh, duhet të futesh në llogari.");
      return;
    }

    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        text,
      });
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        "Nuk u shtua komenti. Provo sërish.";
      setError(msg);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const { data } = await api.delete(
        `/posts/${postId}/comments/${commentId}`
      );
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } catch (err) {
      console.error(err);
      setError("Nuk u fshi komenti.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Je i sigurt që dëshiron të fshish këtë postim?")) {
      return;
    }

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      setError("Nuk u fshi postimi.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Feed profesional</h1>
        <p>
          Ndaj përditësime, projekte dhe mundësi me komunitetin e CareerLink.
        </p>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      <section className="feed-page">
        <div className="feed-main">
          {/* New post */}
          <div className="card feed-new-post">
            {currentUser ? (
              <>
                <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  Çfarë po punon sot, {currentUser.fullName.split(" ")[0]}?
                </p>
                <form onSubmit={handleCreatePost}>
                  <textarea
                    placeholder="Shkruaj një update rreth projektit, punës, ideve..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="feed-new-post-actions">
                    <span>
                      {newPost.length > 0 && `${newPost.length} karaktere`}
                    </span>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={posting || !newPost.trim()}
                    >
                      {posting ? "Duke postuar..." : "Posto"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <p style={{ fontSize: "0.9rem" }}>
                Për të postuar dhe ndërvepruar me feed-in,{" "}
                <strong>futu në llogari</strong> ose krijo një llogari të re.
              </p>
            )}
          </div>

          {/* Lista e postimeve */}
          {loading && <p>Duke ngarkuar postimet...</p>}

          {!loading && posts.length === 0 && (
            <p>Ende s'ka postime. Bëhu i pari që ndan diçka!</p>
          )}

          {!loading &&
            posts.map((post) => {
              const isLiked =
                currentUser &&
                post.likes.some((id) => id === currentUser._id);
              const likeCount = post.likes.length;
              const commentCount = post.comments.length;
              const isAuthor =
                currentUser && post.author && post.author._id === currentUser._id;

              return (
                <article key={post._id} className="card post-card">
                  <div className="post-header">
                    <div className="post-avatar">
                      {getInitials(post.author?.fullName || "U")}
                    </div>
                    <div>
                      <div className="post-author">
                        {post.author?.fullName || "Përdorues"}
                      </div>
                      <div className="post-meta">
                        {post.author?.headline
                          ? post.author.headline
                          : post.author?.role === "employer"
                          ? "Kompani"
                          : "Përdorues"}{" "}
                        • {formatTime(post.createdAt)}
                      </div>
                    </div>
                    {isAuthor && (
                      <button
                        type="button"
                        className="btn-ghost small"
                        style={{ marginLeft: "auto" }}
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Fshi
                      </button>
                    )}
                  </div>

                  <div className="post-content">{post.content}</div>

                  <div className="post-footer">
                    <div className="post-actions">
                      <button
                        type="button"
                        className={isLiked ? "liked" : ""}
                        onClick={() => handleToggleLike(post._id)}
                      >
                        {isLiked ? "💚 Pëlqyer" : "🤍 Pëlqe"}
                      </button>
                    </div>
                    <div className="post-stats">
                      {likeCount > 0 && `${likeCount} pëlqime`}
                      {likeCount > 0 && commentCount > 0 && " • "}
                      {commentCount > 0 && `${commentCount} komente`}
                    </div>
                  </div>

                  {/* Komentet */}
                  <div className="post-comments">
                    {post.comments.map((c) => {
                      const isCommentOwner =
                        currentUser && c.user && c.user._id === currentUser._id;
                      return (
                        <div key={c._id} className="comment-item">
                          <div className="comment-avatar">
                            {getInitials(c.user?.fullName || "U")}
                          </div>
                          <div className="comment-body">
                            <div className="comment-meta">
                              {c.user?.fullName || "Përdorues"}
                            </div>
                            <div className="comment-text">{c.text}</div>
                            {isCommentOwner && (
                              <button
                                type="button"
                                className="comment-delete-btn"
                                onClick={() =>
                                  handleDeleteComment(post._id, c._id)
                                }
                              >
                                Fshi
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {currentUser && (
                      <form
                        className="comment-form"
                        onSubmit={(e) => handleAddComment(e, post._id)}
                      >
                        <input
                          type="text"
                          placeholder="Shkruaj një koment..."
                          value={commentText[post._id] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                        />
                        <button className="btn-primary" type="submit">
                          Komento
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              );
            })}
        </div>

        {/* Sidebar i thjeshtë */}
        <aside className="feed-sidebar">
          <div className="card">
            <h2 className="section-title">Sugjerime përdorimi</h2>
            <ul style={{ fontSize: "0.85rem", paddingLeft: "1.1rem" }}>
              <li>Ndaj projekte personale që po zhvillon.</li>
              <li>Posto mundësi internship-i ose pune.</li>
              <li>Kërko bashkëpunëtorë për projekte IT/AI.</li>
              <li>Ndaj këshilla karriere për nxënës dhe studentë.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Feed;
