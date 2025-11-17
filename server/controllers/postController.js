// server/controllers/postController.js
import Post from "../models/Post.js";

// GET /api/posts
export async function getFeed(req, res) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "fullName email role headline")
      .populate("comments.user", "fullName email")
      .limit(50); // mjafton për tani

    res.json(posts);
  } catch (err) {
    console.error("getFeed error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë marrjes së postimeve" });
  }
}

// POST /api/posts
export async function createPost(req, res) {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Përmbajtja nuk mund të jetë bosh" });
    }

    const post = await Post.create({
      author: req.userId,
      content: content.trim(),
      likes: [],
      comments: [],
    });

    const populated = await Post.findById(post._id)
      .populate("author", "fullName email role headline")
      .populate("comments.user", "fullName email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("createPost error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë krijimit të postimit" });
  }
}

// POST /api/posts/:id/like (toggle)
export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Postimi nuk u gjet" });

    const userIdStr = req.userId.toString();
    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userIdStr
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "fullName email role headline")
      .populate("comments.user", "fullName email");

    res.json(populated);
  } catch (err) {
    console.error("toggleLike error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë veprimit të like" });
  }
}

// POST /api/posts/:id/comments
export async function addComment(req, res) {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Komenti nuk mund të jetë bosh" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Postimi nuk u gjet" });

    post.comments.push({
      user: req.userId,
      text: text.trim(),
    });

    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "fullName email role headline")
      .populate("comments.user", "fullName email");

    res.status(201).json(populated);
  } catch (err) {
    console.error("addComment error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë shtimit të komentit" });
  }
}

// DELETE /api/posts/:postId/comments/:commentId
export async function deleteComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Postimi nuk u gjet" });

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Komenti nuk u gjet" });
    }

    // Lejo fshirjen vetëm nëse komentin e ka bërë ky user ose admin më vonë nëse shton
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Nuk mund të fshish këtë koment" });
    }

    comment.deleteOne(); // heq subdoc

    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "fullName email role headline")
      .populate("comments.user", "fullName email");

    res.json(populated);
  } catch (err) {
    console.error("deleteComment error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes së komentit" });
  }
}

// DELETE /api/posts/:id  (opsionale - i zoti i postimit)
export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Postimi nuk u gjet" });

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Nuk mund të fshish këtë postim" });
    }

    await post.deleteOne();
    res.json({ message: "Postimi u fshi" });
  } catch (err) {
    console.error("deletePost error:", err.message);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes së postimit" });
  }
}
