import Router from "../packages/domo-router/src/core.js";
import { routes } from "./routes.js";

import createHeader from "./components/layout/header.js";

function initApp() {
  const body = document.getElementById("app");
  Router.routes(routes);
  Router.init();
  body.appendChild(createHeader());
  body.appendChild(Router.mount());
}

initApp();
