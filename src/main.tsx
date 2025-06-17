import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

// Render the react application into HTML element with ID "root"
const root = document.getElementById("root");
if (root !== null) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element does not exist!");
}
