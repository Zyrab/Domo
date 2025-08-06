import fs from "fs";

export function loadManifest(manifestPath) {
  try {
    return fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
  } catch (err) {
    console.error("Failed to load cache manifest:", err);
    return {};
  }
}

export function saveManifest(manifestPath, manifest) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}
