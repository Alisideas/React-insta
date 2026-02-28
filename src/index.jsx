import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { HomePage }       from "./screens/HomePage";
import { BlogList }       from "./screens/Blog/BlogList";
import { BlogPost }       from "./screens/Blog/BlogPost";
import { AdminLogin }     from "./screens/Admin/Login";
import { AdminSetup }     from "./screens/Admin/Setup";
import { AdminDashboard } from "./screens/Admin/Dashboard";
import { PostEditor }     from "./screens/Admin/PostEditor";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/blog"       element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Admin auth */}
      <Route path="/admin"       element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin protected */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/new"       element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />
      <Route path="/admin/edit/:id"  element={<ProtectedRoute><PostEditor /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOMClient.createRoot(document.getElementById("app"));
root.render(<App />);
