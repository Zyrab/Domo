import Home from "./pages/home.js";
import About from "./pages/about.js";
import Contacts from "./pages/contacts.js";
import createProjects from "./pages/projects.js";
import createProjectPage from "./components/project-page.js";
import Error from "./pages/errot.js";
import { loadJson } from "./load-json.js";

export const routes = {
  "/": {
    component: Home,
    meta: { title: "Home" },
  },
  "/about": {
    component: About,
    script: ["test.js", { href: "js-with-props.js", preload: true }],
    style: ["test.css", { href: "css-with-props.css", preload: true }],
    font: ["test.woff2", { href: "font-with-props.woff2", preload: true }],
    meta: { title: "About" },
  },
  "/contacts": {
    component: Contacts,
    meta: {
      title: "contacts",
      description: "page description",
      descriptionOG: "Learn more about our mission and values.",
      canonical: "/test/canonical",
      ogImage: "/test/image.png",
      type: "product",
    },
  },
  "/projects": {
    children: {
      "/": { component: createProjects, meta: { title: "contacts" } },
      "/:id": {
        routeParams: async (parentRouteName) => await loadJson("dist/data/projects.json"),
        component: createProjectPage,
        meta: { title: "test page" },
      },
    },
  },
  "*": {
    component: Error,
    meta: { title: "error" },
  },
};
