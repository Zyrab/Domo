import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const platform = os.platform();
let binary = platform === "win32" ? "resvg.exe" : "resvg";

const rsvgPath = path.join(_dirname, `../bin/${platform}/${binary}`);

export default rsvgPath;
