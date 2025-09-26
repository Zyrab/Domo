import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { argv } from "process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5000;

// Base directories for different modes
const INDEX_FILE = path.join(__dirname, "index.html");
const STATIC_BASE = path.join(__dirname, "dist");

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

// --- Command Line Argument Parsing ---

// process.argv is an array: [node_path, script_path, ...args]
const mode = argv[2] ? argv[2].toLowerCase() : "static"; // Default to 'static' if no argument is provided

// --- Server Handlers ---

/**
 * Handles requests in Single Page Application (SPA) mode.
 * Tries to serve the requested file; falls back to index.html for all not-found requests.
 */
async function handleSPAMode(req, res) {
  try {
    // Ignore query params and decode URI
    const requestedPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(__dirname, requestedPath); // Look for file in root directory

    let data;
    let ext = path.extname(filePath).slice(1);

    try {
      // 1. Try serving the static file exactly as requested
      data = await fs.readFile(filePath);
    } catch {
      // 2. Fallback: serve the SPA's index.html
      data = await fs.readFile(INDEX_FILE);
      ext = "html"; // Ensure content type is HTML for the fallback
    }

    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    console.error("SPA Mode Error:", err.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error in SPA mode");
  }
}

/**
 * Handles requests in Static mode.
 * Serves files from the 'dist' folder and handles directory lookups (appending index.html).
 * Sends a 404 page for file not found errors.
 */
async function handleStaticMode(req, res) {
  try {
    const requestedPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(STATIC_BASE, requestedPath);

    // If path is a directory, try appending index.html (e.g., / -> /dist/index.html)
    let stat;
    try {
      stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
    } catch {
      // file might not exist, will be caught by fs.readFile below
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).slice(1);
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    // Use optional chaining for error code check
    if (err?.code === "ENOENT" || err?.code === "EISDIR") {
      // File not found (ENOENT) or trying to read a directory as a file (EISDIR)
      try {
        const errorPage = await fs.readFile(path.join(STATIC_BASE, "404.html")); // Assuming a '404.html' file in 'dist'
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(errorPage);
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      }
    } else {
      console.error("Static Mode Error:", err.message);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Server error in Static mode");
    }
  }
}

// --- Main Server Logic ---

let requestHandler;
let serverModeDescription;

if (mode === "spa") {
  requestHandler = handleSPAMode;
  serverModeDescription = `SPA Mode (Serving from ${__dirname}, falling back to ${path.basename(INDEX_FILE)})`;
} else if (mode === "static") {
  requestHandler = handleStaticMode;
  serverModeDescription = `Static Mode (Serving from ${STATIC_BASE}, 404 on missing files)`;
} else {
  console.error(`Error: Invalid mode specified: ${mode}. Use 'spa' or 'static'.`);
  process.exit(1); // Exit with an error code
}

// Create and listen to the server
http.createServer(requestHandler).listen(PORT, () => {
  console.log(`Server is running in ${serverModeDescription}`);
  console.log(`Access at: http://localhost:${PORT}`);
});
