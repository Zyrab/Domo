import Domo from "@zyrab/domo";
import createIcon from "../common/icon.js";

export const createFooter = () => {
  const links = ({ icon, link, text, label }) =>
    Domo()
      .cls("flex ai-c g-0.5")
      .child([
        createIcon({ icon }),
        Domo("a")
          .cls("sm hv:txt-psec ")
          .attr({ href: link, target: "_blank", "aria-label": label, rel: "noopener noreferrer" })
          .txt(text),
      ]);

  return Domo("footer")
    .cls("flex col jc-c ai-c w-full mb-5 lg:mb-0")
    .child([
      Domo("nav").attr({ "aria-label": "Social links" }).cls("flex ai-c g-1 p-1").child(data.map(links)),
      Domo()
        .cls("flex ai-c g-1")
        .child([
          Domo("p").cls("sm").txt("\u00A9 2025 Zyrab,"),
          Domo("a")
            .cls("md hv:txt-psec italic ")
            .attr({
              href: "https://icons8.com",
              target: "_blank",
              rel: "noopener noreferrer",
            })
            .txt("icons by icons8"),
        ]),
    ]);
};

const data = [
  {
    icon: "gh",
    link: "https://github.com/Zyrab",
    text: "/Zyrab",
    label: "GitHub profile",
  },
  {
    icon: "lnkdn",
    link: "https://www.linkedin.com/in/zurakruashvili/",
    text: "/in/Zyrab/",
    label: "LinkedIn profile",
  },
  { icon: "gmail", link: "mailto:hello@zyrab.dev", text: "hello@zyrab.dev", label: "Send an E-mail" },
];
