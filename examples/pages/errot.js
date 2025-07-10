import Domo from "../../packages/domo/src/domo.js";

export default function Error({ error }) {
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#ffe5e5",
      color: "#b00020",
      border: "1px solid #b00020",
      borderRadius: "6px",
      textAlign: "center",
      fontFamily: "sans-serif",
      marginTop: "50px",
      width: "300px",
      margin: "50px auto",
    },
    msg: {
      fontSize: "16px",
    },
  };

  const message = Domo("p")
    .txt(error || "Oops! Something went wrong.")
    .css(styles.msg);

  // Auto-remove error message
  setTimeout(() => {
    message.txt("Error cleared.");
  }, 3000);

  return Domo("div")
    .css(styles.container)
    .child([Domo("h2").txt("Error").css({ marginBottom: "10px" }), message])
    .build();
}
