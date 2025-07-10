import Domo from "../../packages/domo/src/domo.js";

export default function Contacts() {
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "sans-serif",
      backgroundColor: "#f4f7fa",
      borderRadius: "8px",
      width: "300px",
      margin: "50px auto",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "14px",
      marginBottom: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    preview: {
      fontSize: "15px",
      color: "#333",
    },
  };

  const preview = Domo("p").txt("Your name will appear here.").css(styles.preview);

  const input = Domo("input")
    .attr({ type: "text", placeholder: "Enter your name" })
    .css(styles.input)
    .on("input", (e) => {
      const val = e.target.value.trim();
      preview.txt(val ? `Hello, ${val}!` : "Your name will appear here.");
    });

  return Domo("section")
    .css(styles.container)
    .child([Domo("h2").txt("Contact Us").css({ marginBottom: "10px" }), input, preview])
    .build();
}
