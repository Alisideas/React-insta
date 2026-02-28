const BASE = (typeof process !== "undefined" && process.env.API_URL) || "http://localhost:3001";

function getToken() {
  return localStorage.getItem("admin_token");
}

async function request(path, opts = {}) {
  const { auth, ...rest } = opts;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(rest.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  // Auth
  checkSetup:        ()        => request("/api/auth/setup"),
  setup:             (body)    => request("/api/auth/setup", { method: "POST", body: JSON.stringify(body) }),
  login:             (body)    => request("/api/auth/login",  { method: "POST", body: JSON.stringify(body) }),

  // Public
  getBlogs:          ()        => request("/api/blogs"),
  getBlog:           (slug)    => request(`/api/blogs/${slug}`),

  // Admin (protected)
  adminGetBlogs:     ()        => request("/api/admin/blogs",      { auth: true }),
  adminGetBlog:      (id)      => request(`/api/admin/blogs/${id}`, { auth: true }),
  adminCreateBlog:   (body)    => request("/api/admin/blogs",      { method: "POST",   body: JSON.stringify(body), auth: true }),
  adminUpdateBlog:   (id, body)=> request(`/api/admin/blogs/${id}`, { method: "PUT",    body: JSON.stringify(body), auth: true }),
  adminDeleteBlog:   (id)      => request(`/api/admin/blogs/${id}`, { method: "DELETE", auth: true }),
};
