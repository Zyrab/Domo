import Domo from "../../packages/domo/src/domo.js";
import Router from "../../packages/domo-router/src/core.js";
import { loadJson } from "../load-json.js";

export default async function createProjectPage(params) {
  const data = (await loadJson(`/dist/data/${params.id}.json`)) || {};
  const testPages = ["run", "go", "why", "because"];

  return Domo("section")
    .on(
      "click",
      (e) => {
        e.preventDefault();
        const link = e.target.closest(".nav-link");
        if (!link) return;
        Router.goTo(`/projects/${params.id}/` + link.dataset.link);
      },
      { ssg: false }
    )
    .css(styles.section)
    .child([
      Domo()
        .css(styles.container)
        .child([
          Domo("h1").txt(data?.title).css(styles.title),
          Domo("p").txt(data?.description).css(styles.description),
          Domo("div").txt(data?.content).css(styles.content),
          Domo().child(
            testPages.map((page) =>
              Domo("a")
                .cls("nav-link")
                .data({ link: page })
                .attr({ href: `/projects/${params.id}/${page}` })
                .css(styles.navLink)
                .txt(`Test ${page}`)
            )
          ),
          Domo("div").txt(`Last updated: ${data?.updated}`).css(styles.updated),
        ]),
      params?.outlet ? params.outlet(params) : "",
    ]);
}

const styles = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    alignItems: "center",
    padding: "3rem",
  },
  container: {
    maxWidth: "800px",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
  },
  description: {
    fontSize: "1.25rem",
    color: "#666",
  },
  content: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    color: "#444",
  },
  navLink: {
    padding: "0.8rem",
    cursor: "pointer",
    textDecoration: "none",
  },
  updated: {
    fontSize: "0.8rem",
    color: "#999",
  },
};
