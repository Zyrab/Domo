import Domo from "../../packages/domo/src/domo.js";
import Router from "../../packages/domo-router/src/core.js";
import { loadJson } from "../load-json.js";
export default async function createProjects() {
  const data = await loadJson("dist/data/projects.json");

  return Domo()
    .css({
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      padding: "20px",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
    })
    .child(
      data.map((i) =>
        Domo("a")
          .cls("nav-link")
          .data({ link: i.id })
          .attr({ href: `/projects/${i.id}` })
          .css({
            cursor: "pointer",
            width: "220px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            textDecoration: "none",
            color: "inherit",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            transition: "transform 0.2s",
          })
          .on(
            "click",
            (e) => {
              e.preventDefault();
              const link = e.target.closest(".nav-link");
              if (!link) return;
              Router.goTo("/projects/" + link.dataset.link);
            },
            { ssg: false }
          )
          .child([
            Domo("h3").txt(i.title).css({ margin: "0 0 8px", fontSize: "18px", color: "#333" }),
            Domo("p").txt(i.description).css({ margin: 0, fontSize: "14px", color: "#666" }),
          ])
      )
    );
}
