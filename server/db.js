const mongoose = require("mongoose");

// ── Transform helper: _id → id, timestamps → snake_case ──────────────────────
function addTransform(schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform: (_, ret) => {
      ret.id         = ret._id?.toString();
      ret.created_at = ret.createdAt?.toISOString() ?? null;
      ret.updated_at = ret.updatedAt?.toISOString() ?? null;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  });
}

// ── User ──────────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
addTransform(userSchema);

// ── Post ──────────────────────────────────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true, trim: true },
    excerpt:     { type: String, default: "" },
    content:     { type: String, required: true },
    cover_image: { type: String, default: "" },
    published:   { type: Boolean, default: false },
  },
  { timestamps: true }
);
addTransform(postSchema);

module.exports = {
  User: mongoose.model("User", userSchema),
  Post: mongoose.model("Post", postSchema),
};
