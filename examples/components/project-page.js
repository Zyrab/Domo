import Domo from "../../packages/domo/src/domo.js";
import Router from "../../packages/domo-router/src/core.js";
import { loadJson } from "../load-json.js";

export default async function createProjectPage(params) {
  const data = (await loadJson(`/dist/data/${params.id}.json`)) || {};
  const testPAges = ["run", "go", "why", "because"];
  return Domo()
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
    .css({
      maxWidth: "800px",
      margin: "40px auto",
      padding: "24px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    })
    .child([
      Domo("h1").txt(data?.title).css({
        fontSize: "28px",
        marginBottom: "16px",
        color: "#333",
      }),
      Domo("p").txt(data?.description).css({
        fontSize: "16px",
        color: "#666",
        marginBottom: "20px",
      }),
      Domo("div").txt(data?.content).css({
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#444",
      }),
      testPAges.map((page) =>
        Domo("a")
          .css({
            display: "felx",
            gap: "0.5rem",
            padding: "0.8rem",
          })
          .cls("nav-link")
          .data({ link: page })
          .attr({ href: `/projects/${params.id}/${page}` })
          .txt("test page")
      ),
      Domo("div").txt(`Last updated: ${data?.updated}`).css({
        marginTop: "30px",
        fontSize: "13px",
        color: "#999",
      }),
    ]);
}
