import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.join(__dirname, "dist");

const types = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
  json: "application/json",
  wasm: "application/wasm",
};

http
  .createServer(async (req, res) => {
    try {
      const requestedPath = decodeURIComponent(req.url);
      let filePath = path.join(base, requestedPath);

      // If path is a directory, try appending index.html
      let stat;
      try {
        stat = await fs.stat(filePath);
        if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
      } catch {
        // continue — file might still be valid if not a dir
      }

      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).slice(1);
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    } catch {
      const errorPage = await fs.readFile(path.join(base, "404/index.html"));
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(errorPage);
    }
  })
  .listen(3000, () => console.log("http://localhost:3000"));
