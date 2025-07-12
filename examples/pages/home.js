import Domo from "../../packages/domo/src/domo.js";
import Router from "../../packages/domo-router/src/core.js";
import createSvgIcons from "../components/svg-icons.js";

export default function Home() {
  let toggled = false;

  function handleClick(e, target) {
    // @ssg-let toggled = false;
    toggled = !toggled;
    target.textContent = "Togled";
    const box = document.getElementById("box");
    box.textContent = toggled ? "You clicked the button!" : "Hello, user!";
  }

  function handleError(hello) {
    alert("hello there");
  }

  return Domo("section")
    .id("section-home")
    .onClosest("click", {
      "#home-button-1": handleClick,
      "#home-button": handleError,
      "#box": (e, target) => {
        target.textContent = "what are u doingg?";
      },
    })
    .css(styles.section)
    .child([
      Domo("h2").txt("Home Page").css(styles.heading),
      createSvgIcons("heart"),
      Domo("button").id("home-button-1").txt("Toggle Message").css(styles.button),
      Domo()
        .css(styles.boxContainer)
        .child([Domo("p").id("box").txt("Hello, user!").css(styles.boxText)]),
      Domo("button").id("home-button").txt("Wrong Button").css(styles.button),
    ]);
}
const styles = {
  section: {
    padding: "30px",
    backgroundColor: "#eef2f5",
    borderRadius: "8px",
    width: "300px",
    margin: "50px auto",
    fontFamily: "sans-serif",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
    fontSize: "20px",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007acc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  boxContainer: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: {
    fontSize: "16px",
    color: "#222",
    textAlign: "center",
    padding: "10px",
    margin: "0",
  },
};
