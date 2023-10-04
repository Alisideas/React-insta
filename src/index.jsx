import React from "react";
import ReactDOMClient from "react-dom/client";
import { PluginFileCover } from "./screens/PluginFileCover";

const app = document.getElementById("app");
const root = ReactDOMClient.createRoot(app);
root.render(<PluginFileCover />);
