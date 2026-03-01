export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
}

async function request<T>(path: string, opts: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const { auth, ...rest } = opts;
  const res = await fetch(path, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(rest.headers as Record<string, string> | undefined),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  checkSetup: () => request<{ needsSetup: boolean }>("/api/auth/setup"),
  setup: (body: { username: string; password: string }) =>
    request<{ success: boolean }>("/api/auth/setup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { username: string; password: string }) =>
    request<{ token: string; username: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getBlogs: () => request<Post[]>("/api/blogs"),
  getBlog: (slug: string) => request<Post>(`/api/blogs/${slug}`),

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const body = new FormData();
    body.append("image", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
    return data as { url: string };
  },

  adminGetBlogs: () => request<Post[]>("/api/admin/blogs", { auth: true }),
  adminGetBlog: (id: string) => request<Post>(`/api/admin/blogs/${id}`, { auth: true }),
  adminCreateBlog: (body: Partial<Post>) =>
    request<{ id: string; slug: string }>("/api/admin/blogs", { method: "POST", body: JSON.stringify(body), auth: true }),
  adminUpdateBlog: (id: string, body: Partial<Post>) =>
    request<{ success: boolean }>(`/api/admin/blogs/${id}`, { method: "PUT", body: JSON.stringify(body), auth: true }),
  adminDeleteBlog: (id: string) =>
    request<{ success: boolean }>(`/api/admin/blogs/${id}`, { method: "DELETE", auth: true }),
};
