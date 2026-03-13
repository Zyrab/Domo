import fs from "fs";

let manifestCache = null;
let manifestLoaded = false;
let manifestPathCache = null;

let debounceTimer = null;
const DEBOUNCE_DELAY = 500;

function loadManifest(manifestPath) {
  try {
    return fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};
  } catch (err) {
    console.error("[Domo-OG] Failed to load cache manifest");
    return {};
  }
}

function saveManifest(manifestPath, manifest) {
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  } catch {
    console.error("Domo-OG] Failed to Save cache manifest");
  }
}

export function getManifest(manifestPath) {
  if (!manifestLoaded) {
    manifestCache = loadManifest(manifestPath);
    manifestPathCache = manifestPath;
    manifestLoaded = true;
  }
  return manifestCache;
}

export function requestManifestWrite() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (manifestLoaded && manifestPathCache && manifestCache) {
      saveManifest(manifestPathCache, manifestCache);
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}

export function flushManifestImmediately() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (manifestLoaded && manifestPathCache && manifestCache) {
    saveManifest(manifestPathCache, manifestCache);
  }
}
