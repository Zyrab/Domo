import Home from "./home.js";
import About from "./about.js";
import Contacts from "./contacts.js";
import Error from "./error.js";


export const routes = {
    "/": {
        component: Home,
        fonts: [],
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


    // "/:empty-dynamic": {
    //     routeParams: async () => [],
    //     component: testPage,
    //     meta: { title: "Empty Dynamic" },
    // },

    // "/:invalid-dynamic": {
    //     routeParams: async () => [{ wrongKey: "missing-id" }],
    //     component: testPage,
    //     meta: { title: "Invalid Dynamic" },
    // },


    "/meta-only": {
        meta: { title: "Meta Only", description: "No component here" },
        styles: [{ href: "meta.css" }],
    },
    "*": {
        component: Error,
        meta: { title: "404 Error", description: "Page not found" },
    },
};
