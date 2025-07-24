import Home from "./pages/home.js";
import About from "./pages/about.js";
import Contacts from "./pages/contacts.js";
import createProjects from "./pages/projects.js";
import createProjectPage from "./components/project-page.js";
import Error from "./pages/error.js";
import { loadJson } from "./load-json.js";

export const routes = {
  "/": {
    component: Home,
    meta: {
      title: "Home",
      description: "Home description",
      descriptionOG: "this is a Og test description",
      type: "article",
      ogImage: "custum/ogimage/link.png",
    },
    fonts: ["Routidan.woff2"],
  },
  "/about": {
    component: About,
    meta: { title: "About", description: "About description" },
  },
  "/contacts": {
    component: Contacts,
    meta: { title: "contacts", description: "contacts description" },
    scripts: ["Routidan.js"],
  },
  "/projects": {
    children: {
      "/": {
        component: createProjects,
        meta: { title: "Projects", description: "Projects description", canonical: "/projects-heyyeh" },
        styles: [{ href: "Routidan.css", preload: true }],
      },
      "/:id": {
        routeParams: async () => await loadJson("dist/data/projects.json"),
        component: createProjectPage,
        meta: { title: "test page" },
      },
    },
  },
  "*": {
    component: Error,
    meta: { title: "error", description: "Error description" },
  },
};
