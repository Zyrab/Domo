import Home from "./pages/home.js";
import About from "./pages/about.js";
import Contacts from "./pages/contacts.js";
import createProjects from "./pages/projects.js";
import createProjectPage from "./components/project-page.js";
import testPage from "./components/testing-page.js";
import Error from "./pages/error.js";
import { loadJson } from "./load-json.js";

export const routes = {
  // --- Static routes ---
  "/": {
    component: Home,
    fonts: ["Routidan.woff2"],
    meta: {
      title: "Home",
      description: "Home description",
      descriptionOG: "OG description for Home",
      type: "article",
      ogImage: "images/home-og.png",
    },
  },
  "/about": {
    component: About,
    meta: { title: "About", description: "About description" },
  },
  "/contacts": {
    component: Contacts,
    scripts: ["contact.js"],
    meta: { title: "Contacts", description: "Contacts page", theme: "light" },
  },

  // --- Static route with multiple assets ---
  "/assets-test": {
    component: Home,
    styles: [{ href: "style-main.css", preload: true }, { href: "extra.css" }],
    scripts: ["extra.js", "analytics.js"],
    fonts: ["Font1.woff2", "Font2.woff2"],
    meta: { title: "Assets Test", description: "Assets-heavy route" },
  },

  // --- Dynamic routes ---
  "/projects": {
    component: createProjects,
    styles: [{ href: "projects.css", preload: true }],
    meta: {
      title: "Projects",
      description: "List of projects",
      canonical: "/projects-heyyeh",
    },

    // First-level dynamic route
    "/:id": {
      routeParams: async () => await loadJson("dist/data/projects.json"), // Array of { id, title, ... }
      component: createProjectPage,
      meta: { title: "Project Detail" },

      // Second-level dynamic route
      "/:item": {
        routeParams: async (parent) => await loadJson(`dist/data/${parent}-item.json`), // Array of { item, title, ... }
        component: createProjectPage,
        meta: { title: "Project Item Detail" },
      },
    },
  },

  // --- Deep nested dynamic (3 levels) ---
  // "/blog": {
  //   component: createProjects,
  //   meta: { title: "Blog", description: "Blog listing" },
  //   "/:category": {
  //     routeParams: async () => [
  //       { category: "tech", title: "Tech" },
  //       { category: "lifestyle", title: "Lifestyle" },
  //     ],
  //     component: testPage,
  //     meta: { title: "Blog Category" },

  //     "/:slug": {
  //       routeParams: async (parent) => [
  //         { slug: `${parent}-post-1`, title: "Post 1" },
  //         { slug: `${parent}-post-2`, title: "Post 2" },
  //       ],
  //       component: testPage,
  //       meta: { title: "Blog Post Detail" },

  //       "/:comment": {
  //         routeParams: async (parent) => [{ comment: `${parent}-comment-1` }, { comment: `${parent}-comment-2` }],
  //         component: testPage,
  //         meta: { title: "Blog Post Comments" },
  //       },
  //     },
  //   },
  // },

  // --- Edge case: empty routeParams ---
  "/:empty-dynamic": {
    routeParams: async () => [],
    component: testPage,
    meta: { title: "Empty Dynamic" },
  },

  // --- Edge case: routeParams with missing keys ---
  "/:invalid-dynamic": {
    routeParams: async () => [{ wrongKey: "missing-id" }],
    component: testPage,
    meta: { title: "Invalid Dynamic" },
  },

  // --- Large dynamic dataset for stress test ---
  // "/big-dynamic": {
  //   component: testPage,
  //   meta: { title: "Big Dynamic Test" },

  //   "/:dynamic": {
  //     routeParams: async () =>
  //       Array.from({ length: 200 }, (_, i) => ({
  //         dynamic: `item-${i}`,
  //         title: `Item ${i}`,
  //         description: `Description for item ${i}`,
  //       })),
  //     component: testPage,
  //     meta: { title: "Big Dynamic Test" },
  //   },
  // },

  // --- Meta-only route (no component) ---
  "/meta-only": {
    meta: { title: "Meta Only", description: "No component here" },
    styles: [{ href: "meta.css" }],
  },

  // --- Catch-all route ---
  "*": {
    component: Error,
    meta: { title: "404 Error", description: "Page not found" },
  },
};
