import Home from "./pages/home.js";
import About from "./pages/about.js";
import Contacts from "./pages/contacts.js";
import createProjects from "./pages/projects.js";
import createProjectPage from "./components/project-page.js";
import testPage from "./components/testing-page.js";
import Error from "./pages/error.js";
import { loadJson } from "./load-json.js";
const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#272727"/>
    <rect width="1200" height="47" fill="#474444"/>
    <rect width="233" height="47" fill="#3A3838"/>
    <text id="JS" fill="#E9FA00" xml:space="preserve" style="white-space: pre"  font-family="Cutive Mono" font-size="26.4" font-weight="bold" letter-spacing="0.04em"><tspan x="5" y="32.344">JS</tspan></text>
    <text id="Zyrab.dev" fill="white" xml:space="preserve" style="white-space: pre" font-family="Cutive Mono"   font-size="26.4" letter-spacing="0.04em"><tspan x="50" y="32.344">testing</tspan></text>
    <text id="x" fill="#928585" xml:space="preserve" style="white-space: pre" font-family="Cutive Mono"  font-size="28.8" letter-spacing="0.04em"><tspan x="213" y="33.2776">x</tspan></text>
    <ellipse id="Ellipse 21" cx="1095.84" cy="23.5" rx="11.232" ry="10.53" fill="#FF0000"/>
    <ellipse id="Ellipse 22" cx="1137.5" cy="23.5" rx="11.232" ry="10.53" fill="#FFFF00"/>
    <ellipse id="Ellipse 23" cx="1179.17" cy="23.5" rx="11.232" ry="10.53" fill="#008000"/>
    <text x="600" y="300" text-anchor="middle" dominant-baseline="middle" fill="#D9D9D9" font-family="Cutive Mono" font-weight="400"  font-size="76" letter-spacing="0.05em" >
      {{title}}
    </text>  
  </svg>
`;

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
      generateOgImage: true,
      templateId: "prjwws5c",
    },

    // First-level dynamic route
    "/:id": {
      routeParams: async () => await loadJson("dist/data/projects.json"), // Array of { id, title, ... }
      component: createProjectPage,
      meta: {
        title: "Project Detail",
        generateOgImage: true,
        svgTemplate: svg,
        templateId: "v22",
        ogImageOptions: {
          maxLength: 25,
          lineHeight: 5,
        },
      },

      // Second-level dynamic route
      "/:item": {
        routeParams: async (parent) => await loadJson(`dist/data/${parent}-item.json`), // Array of { item, title, ... }
        component: createProjectPage,
        meta: { title: "Project Item Detail", generateOgImage: true, svgTemplate: svg, templateId: "v3" },
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
