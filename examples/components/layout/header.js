import Domo from "../../../packages/domo/src/domo.js";
import Router from "../../../packages/domo-router/src/core.js";

export default function createHeader() {
  return Domo("header")
    .css({
      with: "100%",
      height: "40px",
      backgroundColor: "whitesmoke",
    })
    .child([
      Domo("nav")
        .css({
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.8rem",
          fontSize: "1.2rem",
          color: "brown",
        })
        .child([
          Domo("a").css({ cursor: "pointer" }).cls("nav-link").txt("Home").data({ link: "/" }),
          Domo("a").css({ cursor: "pointer" }).cls("nav-link").txt("about").data({ link: "/about" }),
          Domo("a").css({ cursor: "pointer" }).cls("nav-link").txt("contact").data({ link: "/contacts" }),
        ]),
    ])
    .on("click", (e) => {
      e.preventDefault();
      const link = e.target.closest(".nav-link");
      if (!link) return;
      Router.goTo(link.dataset.link);
    })
    .build();
}
