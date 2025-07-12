import Domo from "../../packages/domo/src/domo.js";

export default function Contacts() {
  return Domo("section")
    .css(styles.container)
    .child([
      Domo("h2").txt("Contact Us").css({ marginBottom: "10px" }),
      Domo("form")
        .id("contact-fomr")
        .child([
          Domo("input")
            .id("contact-input")
            .attr({ type: "text", name: "username", placeholder: "Enter your name" })
            .css(styles.input)
            .on("input", (e) => {
              const val = e.target.value.trim();
              document.getElementById("contact-preview").textContent = val
                ? `Hello, ${val}!`
                : "Your name will appear here.";
            }),
          Domo("button").txt("Submit").attr({ type: "submit" }).css(styles.button),
        ])
        .on("submit", (e) => {
          e.preventDefault();
          const name = document.getElementById("contact-input").value.trim();
          if (name) alert(`Submitted name: ${name}`);
        }),
      Domo("p").id("contact-preview").css(styles.preview).txt("Your name will appear here."),
    ]);
}

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
  button: {
    padding: "8px 12px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
