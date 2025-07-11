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
    meta: { title: "About" },
  },
  "/contacts": {
    component: Contacts,
    meta: { title: "contacts" },
  },
  "/projects": {
    children: {
      "/": { component: createProjects, meta: { title: "contacts" } },
      "/:id": {
        getDinamicList: async () => await loadJson("dist/data/projects.json"),
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
