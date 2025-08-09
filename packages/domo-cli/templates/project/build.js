
import { buildSite } from "./services/static-site/index.js";

import { getRoutes } from "./src/pages/index.js";

await buildSite(await getRoutes());
console.log("✅ Build finished");
