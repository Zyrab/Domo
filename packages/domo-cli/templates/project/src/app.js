import Router from "@zyrab/domo-router";
import { routes } from "./pages/index.js";

import createHeader from "./components/layout/header.js";

function initApp() {
    const body = document.getElementById("app");
    Router.routes(routes);
    Router.init();
    body.appendChild(createHeader());
    body.appendChild(Router.mount());
}

initApp();
