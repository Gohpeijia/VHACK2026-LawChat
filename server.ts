import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const stats = {
    totalHits: 12450,
    userCount: 842,
    activeProjects: 12,
    uptime: "99.9%"
  };

  const items = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Project ${String.fromCharCode(65 + (i % 26))}${i}`,
    status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "In Progress" : "Pending",
    owner: ["Alice", "Bob", "Charlie", "David"][i % 4],
    updatedAt: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    commits: Math.floor(Math.random() * 100)
  }));

  // Boleh AI API Routes (Add as needed)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
