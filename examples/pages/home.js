import Domo from "../../packages/domo/src/domo.js";
import Router from "../../packages/domo-router/src/core.js";
import createSvgIcons from "../components/svg-icons.js";

export default function Home() {
  const box = Domo("p").txt("Hello, user!").css({
    fontSize: "16px",
    color: "#222",
    textAlign: "center",
    padding: "10px",
    margin: "0",
  });

  let toggled = false;

  function handleClick() {
    toggled = !toggled;
    box.txt(toggled ? "You clicked the button!" : "Hello, user!");
  }
  function handleError() {
    console.log(Router.prev());
    console.log(Router.info());

    Router.goTo("/it-is-error");
    console.log(Router.path());
    console.log(Router.base());
  }

  return Domo("section")
    .css({
      padding: "30px",
      backgroundColor: "#eef2f5",
      borderRadius: "8px",
      width: "300px",
      margin: "50px auto",
      fontFamily: "sans-serif",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    })
    .child([
      Domo("h2").txt("Home Page").css({
        marginBottom: "20px",
        color: "#333",
        fontSize: "20px",
      }),
      createSvgIcons("heart"),
      Domo("button").id("home-button-1").txt("Toggle Message").on("click", handleClick).css({
        padding: "10px 16px",
        backgroundColor: "#007acc",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "20px",
      }),

      Domo()
        .id("box")
        .css({
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "10px",
          minHeight: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })
        .child([box]),
      Domo("button").id("home-button").txt("Wrong Button").on("click", handleError).css({
        padding: "10px 16px",
        margin: "50px auto",

        backgroundColor: "#007acc",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "20px",
      }),
    ]);
}
