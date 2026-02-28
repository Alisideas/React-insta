require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express  = require("express");
const cors     = require("cors");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const mongoose   = require("mongoose");
const multer     = require("multer");
const cloudinary = require("cloudinary").v2;
const { User, Post } = require("./db");

const app        = express();
const PORT       = process.env.SERVER_PORT  || 3001;
const JWT_SECRET = process.env.JWT_SECRET  || "change-me-in-production";
const CLIENT_URL = process.env.CLIENT_URL  || "http://localhost:1234";
const MONGO_URI  = process.env.MONGODB_URI || "mongodb://localhost:27017/blog";

// ── Cloudinary ────────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only image files are allowed"));
  },
});

// ── MongoDB connection (cached for serverless) ─────────────────────────────────
let connectionPromise = null;
function connectDB() {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(MONGO_URI)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        connectionPromise = null; // allow retry on next request
        throw err;
      });
  }
  return connectionPromise;
}

app.use(cors({ origin: CLIENT_URL || true }));
app.use(express.json());

// Ensure DB is connected before every request
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(500).json({ error: "Database connection failed" });
  }
});

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

// ── Image upload ──────────────────────────────────────────────────────────────
app.post("/api/admin/upload", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "blog", resource_type: "image" },
        (err, data) => (err ? reject(err) : resolve(data))
      ).end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ error: "Upload failed: " + e.message });
  }
});

// ── Setup / Auth ───────────────────────────────────────────────────────────────

app.get("/api/auth/setup", async (_req, res) => {
  const exists = await User.exists({});
  res.json({ needsSetup: !exists });
});

app.post("/api/auth/setup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password are required" });

  const exists = await User.exists({});
  if (exists)
    return res.status(409).json({ error: "Admin account already exists" });

  const hash = await bcrypt.hash(password, 12);
  await User.create({ username, password: hash });
  res.json({ success: true });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, username: user.username });
});

// ── Public blog routes ─────────────────────────────────────────────────────────

app.get("/api/blogs", async (_req, res) => {
  const posts = await Post
    .find({ published: true })
    .select("title slug excerpt cover_image createdAt")
    .sort({ createdAt: -1 });
  res.json(posts.map((p) => p.toJSON()));
});

app.get("/api/blogs/:slug", async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, published: true });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post.toJSON());
});

// ── Admin routes (protected) ───────────────────────────────────────────────────

app.get("/api/admin/blogs", requireAuth, async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts.map((p) => p.toJSON()));
});

app.get("/api/admin/blogs/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post.toJSON());
});

app.post("/api/admin/blogs", requireAuth, async (req, res) => {
  const { title, slug, excerpt, content, cover_image, published } = req.body;
  if (!title || !content)
    return res.status(400).json({ error: "Title and content are required" });

  const finalSlug =
    slug ||
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  try {
    const post = await Post.create({
      title, slug: finalSlug, excerpt: excerpt || "",
      content, cover_image: cover_image || "", published: Boolean(published),
    });
    res.json({ id: post._id.toString(), slug: finalSlug });
  } catch (e) {
    if (e.code === 11000) {
      res.status(409).json({ error: "A post with this slug already exists" });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.put("/api/admin/blogs/:id", requireAuth, async (req, res) => {
  const { title, slug, excerpt, content, cover_image, published } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, slug, excerpt: excerpt || "", content, cover_image: cover_image || "", published: Boolean(published) },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ success: true });
  } catch (e) {
    if (e.code === 11000) {
      res.status(409).json({ error: "A post with this slug already exists" });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.delete("/api/admin/blogs/:id", requireAuth, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ── Start ──────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Blog API → http://localhost:${PORT}`);
  });
}

module.exports = app;
