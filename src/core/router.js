import { Home } from "../pages/Home.js";
import { Blog } from "../pages/Blog.js";
import { BlogPost } from "../components/blog/BlogPost.js";
import { Projects } from "../pages/Projects.js";
import { ProjectPage } from "../components/projects/ProjectPage.js";
import { Legal } from "../pages/Legal.js";
import { Error } from "../pages/Error.js";

const routes = {
  "/": {
    component: Home,
    meta: { title: "Home", description: "Home" },
  },
  "/projects": {
    children: {
      "/:id": {
        component: ProjectPage,
        meta: { title: "Projects", description: "Project" },
      },
      "/": {
        component: Projects,
        meta: { title: "Projects", description: "Projects" },
      },
    },
  },
  "/blog": {
    children: {
      "/:slug": {
        component: BlogPost,
        meta: { title: "Blog", description: "Blog" },
      },
      "/": {
        component: Blog,
        meta: { title: "Blog", description: "Blog" },
      },
    },
  },
  "/legal": {
    children: {
      "/:legal": {
        children: {
          "/:app": {
            component: Legal,
            meta: {
              title: "Privacy Policy",
              description: "Privacy Policy",
            },
          },
        },
      },
      "/": {
        component: Legal,
      },
    },
  },
  "*": {
    component: Error,
    meta: {
      title: "Error",
      description: "Page you are looking for does not exist",
    },
  },
};

const scrollPositions = {};
let previousUrl = "";

export const router = () => {
  const main = document.createElement("main");
  main.id = "main";
  return main;
};

export const initializeRouter = () => {
  ["DOMContentLoaded", "popstate"].forEach((event) =>
    window.addEventListener(event, initRouter)
  );
};

export const navigateTo = async (path) => {
  saveScrollPosition(previousUrl);
  previousUrl = path;
  const { segments, pureUrl } = parseUrl(path);
  const { routeData, params } = matchNestedRoute(segments);
  const changed = pushStateGuard(pureUrl);
  if (!changed) return;
  setActiveNav(segments[0]);
  await renderPage(routeData, params);
  restoreScrollPosition();
};

const initRouter = async () => {
  saveScrollPosition(previousUrl);
  const url = window.location.pathname + window.location.hash;
  previousUrl = url;
  const { segments, pureUrl } = parseUrl(url);
  const { routeData, params } = matchNestedRoute(segments);
  pushStateGuard(pureUrl);
  setActiveNav(segments[0]);
  await renderPage(routeData, params);
  restoreScrollPosition();
};

export const goBack = () => history.back();

const pushStateGuard = (url) => {
  if (window.location.pathname + window.location.hash !== url) {
    history.pushState(null, null, url);
    return true;
  }
  return false;
};
const setActiveNav = (route) => {
  document.querySelectorAll(".nav-link").forEach((link) => {
    const svg = link.children[0];
    svg &&
      svg.classList.toggle(
        "current",
        link.getAttribute("data-route") === route
      );
  });
};

const renderPage = async (routeData, params) => {
  const { component, meta } = routeData;
  const main = document.getElementById("main");
  try {
    const content = await component(params);
    main.replaceChildren();
    if (content instanceof HTMLElement) {
      main.appendChild(content);
      document.title = meta.title;
      document
        .querySelector("meta[name='description']")
        .setAttribute("content", meta.description);
    } else if (typeof content === "string") {
      const wrapper = document.createElement("div");
      wrapper.textContent = content;
      main.appendChild(wrapper);
    } else {
      throw new Error("Unsupported component output type");
    }
  } catch (error) {
    console.error("Rendering error:", error);
    const errorPage = Error({ error: error.message });
    main.replaceChildren();
    main.appendChild(errorPage);
  }
};

const parseUrl = (url) => {
  // Remove the hash from the URL explicitly for githab pages to serve index.html
  const pureUrl = url.includes("#") ? url.split("#")[1] : url;
  // Split the URL into segments keepinig '/' for nested routes
  const segments = pureUrl.split(/(?=\/)/g).filter(Boolean);
  return {
    segments,
    pureUrl,
  };
};

const matchNestedRoute = (segments) => {
  if (!segments.length) return { routeData: routes["/"] || routes["*"] };

  let current = routes;
  let params = {};

  for (const segment of segments) {
    if (current[segment]) {
      // exact match found go deeper
      current = current[segment].children || current[segment];
    } else {
      // look for dynamic route
      const key = Object.keys(current).find((key) => key.includes(":"));
      if (!key) return { routeData: routes["*"], params: {} };
      const parmName = key.split(":")[1];
      params = { ...params, [parmName]: segment.split("/")[1] };
      current = current[key];
      if (current.children) {
        current = current.children;
      }
    }
  }
  // we send for rendering default child if component doesnt exists
  let defaultChild = current.component ? current : current["/"] || routes["*"];

  return { params, routeData: defaultChild };
};
const saveScrollPosition = (oldPath) => {
  let location = oldPath || window.location.pathname;
  scrollPositions[location] = window.scrollY;
};

const restoreScrollPosition = () => {
  const position = scrollPositions[window.location.pathname];
  if (position) {
    window.scrollTo(0, position);
  } else {
    window.scrollTo(0, 0);
  }
};

const log = (t, l) => console.log(t + ":", l);
