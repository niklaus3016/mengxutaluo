import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { getProceduralCardSvg } from "./server/proceduralCards";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/assets/tarot/:filename", (req, res) => {
    const { filename } = req.params;
    if (!filename.endsWith(".jpg") && !filename.endsWith(".png") && !filename.endsWith(".svg")) {
      return res.status(404).send("Not found");
    }
    const cleanId = filename.replace(/\.(jpg|png|svg)$/i, "");
    const isThumb = req.query.thumb === "true";

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    
    const svg = getProceduralCardSvg(cleanId, isThumb);
    return res.send(svg);
  });

  app.get("/api/debug-assets", async (req, res) => {
    try {
      const fs = await import("fs");
      const cwd = process.cwd();
      const env = process.env.NODE_ENV;
      const pathsToCheck = [
        path.join(cwd, "public", "assets", "tarot", "m00.jpg"),
        path.join(cwd, "dist", "assets", "tarot", "m00.jpg"),
        path.join(cwd, "assets", "tarot", "m00.jpg"),
      ];
      const checkResults = pathsToCheck.map(p => ({
        path: p,
        exists: fs.existsSync(p)
      }));
      res.json({
        cwd,
        env,
        checkResults,
        __dirname: cwd,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    // Explicitly serve public files in development mode to support direct asset urls
    app.use(express.static(path.join(process.cwd(), "public")));

    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
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
