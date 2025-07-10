import Domo from "../../packages/domo/src/domo.js";

export default function About() {
  const paragraph = Domo("p").txt("Welcome to the About Page. This is a mock description for demo purposes.").css({
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
    margin: "0",
  });

  let visible = true;

  function toggleVisibility() {
    paragraph.show((visible = !visible));
  }

  return Domo("section")
    .css({
      padding: "20px",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      maxWidth: "400px",
      margin: "50px auto",
      fontFamily: "Arial, sans-serif",
    })
    .child([
      Domo("h2").txt("About Us").css({ marginBottom: "10px", color: "#222" }),

      Domo("button").txt("Show/Hide Info").on("click", toggleVisibility).css({
        padding: "8px 12px",
        backgroundColor: "#007acc",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "10px",
      }),

      paragraph,
    ])
    .build();
}
