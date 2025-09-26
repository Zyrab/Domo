import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = path.join(__dirname, "dist");
const indexFile = path.join(__dirname, "index.html");

const types = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
  json: "application/json",
  wasm: "application/wasm",
  woff2: "font/woff2",
};

http
  .createServer(async (req, res) => {
    try {
      const requestedPath = decodeURIComponent(req.url.split("?")[0]); // ignore query params
      let filePath = path.join(__dirname, requestedPath);

      let data;
      let ext = path.extname(filePath).slice(1);

      try {
        data = await fs.readFile(filePath); // try serving static file
      } catch {
        data = await fs.readFile(indexFile); // fallback to index.html
        ext = "html";
      }

      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error");
    }
  })
  .listen(3000, () => console.log("http://localhost:3000"));
