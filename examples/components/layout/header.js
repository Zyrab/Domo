import Domo from "../../../packages/domo/src/domo.js";
import Router from "../../../packages/domo-router/src/core.js";

export default function createHeader() {
  const current = Router.base();
  return Domo("header")
    .css({
      width: "100%",
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
        .child(
          routes.map(({ label, link }) =>
            Domo("a")
              .css({
                cursor: "pointer",
                textDecoration: "none",
                color: current === link ? "red" : "inherit",
              })
              .cls("nav-link")
              .txt(label)
              .data({ link })
              .attr({ href: link })
          )
        ),
    ])
    .on(
      "click",
      (e) => {
        e.preventDefault();

        const link = e.target.closest(".nav-link");
        if (!link) return;
        Router.goTo(link.dataset.link);
      },
      { ssg: false }
    )
    .build();
}

const routes = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/contacts" },
  { label: "Projects", link: "/projects" },
];
