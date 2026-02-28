require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express = require("express");
const cors    = require("cors");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("./db");

const app        = express();
const PORT       = process.env.PORT       || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:1234";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// ── Auth middleware ────────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || "").split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ── Setup / Auth ───────────────────────────────────────────────────────────────

// Check if first-run setup is needed
app.get("/api/auth/setup", (_req, res) => {
  const exists = db.prepare("SELECT id FROM users LIMIT 1").get();
  res.json({ needsSetup: !exists });
});

// Create admin account (only works when no user exists)
app.post("/api/auth/setup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  const exists = db.prepare("SELECT id FROM users LIMIT 1").get();
  if (exists)
    return res.status(409).json({ error: "Admin account already exists" });

  const hash = await bcrypt.hash(password, 12);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hash);
  res.json({ success: true });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, username: user.username });
});

// ── Public blog routes ─────────────────────────────────────────────────────────

app.get("/api/blogs", (_req, res) => {
  const posts = db
    .prepare(
      "SELECT id, title, slug, excerpt, cover_image, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC"
    )
    .all();
  res.json(posts);
});

app.get("/api/blogs/:slug", (req, res) => {
  const post = db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .get(req.params.slug);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// ── Admin routes (protected) ───────────────────────────────────────────────────

app.get("/api/admin/blogs", requireAuth, (_req, res) => {
  const posts = db
    .prepare(
      "SELECT id, title, slug, excerpt, published, created_at, updated_at FROM posts ORDER BY created_at DESC"
    )
    .all();
  res.json(posts);
});

app.get("/api/admin/blogs/:id", requireAuth, (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

app.post("/api/admin/blogs", requireAuth, (req, res) => {
  const { title, slug, excerpt, content, cover_image, published } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content are required" });

  const finalSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  try {
    const result = db
      .prepare(
        "INSERT INTO posts (title, slug, excerpt, content, cover_image, published) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(title, finalSlug, excerpt || "", content, cover_image || "", published ? 1 : 0);
    res.json({ id: result.lastInsertRowid, slug: finalSlug });
  } catch (e) {
    if (e.message.includes("UNIQUE")) {
      res.status(409).json({ error: "A post with this slug already exists" });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.put("/api/admin/blogs/:id", requireAuth, (req, res) => {
  const { title, slug, excerpt, content, cover_image, published } = req.body;
  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  try {
    db.prepare(
      `UPDATE posts
       SET title=?, slug=?, excerpt=?, content=?, cover_image=?,
           published=?, updated_at=datetime('now')
       WHERE id=?`
    ).run(title, slug, excerpt || "", content, cover_image || "", published ? 1 : 0, req.params.id);
    res.json({ success: true });
  } catch (e) {
    if (e.message.includes("UNIQUE")) {
      res.status(409).json({ error: "A post with this slug already exists" });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.delete("/api/admin/blogs/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Blog API →  http://localhost:${PORT}`);
});
