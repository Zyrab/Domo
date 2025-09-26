import Router from "../packages/domo-router/src/core.js";
import { routes } from "./routes.js";

import createHeader from "./components/layout/header.js";

function initApp() {
  Router.routes(routes);
  Router.init();
  Router.mount();
}

initApp();
