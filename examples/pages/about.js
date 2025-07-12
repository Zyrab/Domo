import Domo from "../../packages/domo/src/domo.js";

export default function About() {
  let visible = true;

  function toggleVisibility() {
    // @ssg-let visible = true;
    const el = document.getElementById("about-info");
    if (!el) return;
    el.style.display = visible ? "none" : "";
    visible = !visible;
  }

  return Domo("section")
    .css(styles.container)
    .child([
      Domo("h2").txt("About Us").css(styles.heading),
      Domo("button").id("about-button").txt("Show/Hide Info").on("click", toggleVisibility).css(styles.button),
      Domo("p")
        .id("about-info")
        .txt("Welcome to the About Page. This is a mock description for demo purposes.")
        .css(styles.paragraph),
    ]);
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    maxWidth: "400px",
    margin: "50px auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "10px",
    color: "#222",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007acc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  paragraph: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
    margin: "0",
  },
};
