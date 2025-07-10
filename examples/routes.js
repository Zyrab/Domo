import Home from "./pages/home.js";
import About from "./pages/about.js";
import Contacts from "./pages/contacts.js";
import Error from "./pages/errot.js";

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
  "*": {
    component: Error,
    meta: { title: "error" },
  },
};
