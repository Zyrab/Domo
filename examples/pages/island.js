import Domo from "../../packages/domo/src/index.js";
import createButton from "../../packages/domo-ui/components/button.js";

export default function Island() {
  let toggled = false;
  let count = 0;
  let list = null;

  let modes = {
    simple: ["Learn", "Build"],
    advanced: ["Ship", "Scale", "Optimize"],
  };

  let currentMode = "simple";

  let listDisplay = createList(modes[currentMode]);

  function createList(items) {
    return Domo("ul")
      .id("list")
      .child(items.map((item) => Domo("li").txt(item).css(styles.listItem)));
  }

  function updateList(mode) {
    const newList = createList(modes[mode]);

    // 🔥 DOM replacement (important for your SSG test)
    listDisplay.replace(listDisplay.build(), newList.build());
    listDisplay = newList;
  }

  function handleModeChange(e, target) {
    const mode = target.dataset.mode;

    currentMode = mode;
    updateList(mode);

    const active = target.parentNode.querySelector(".active");
    if (active) active.classList.remove("active");
    target.classList.add("active");
  }

  function handleAddItem() {
    const input = document.getElementById("item-input");
    if (!input.value) return;

    const list = document.getElementById("list");
    const li = document.createElement("li");
    li.textContent = input.value;

    list.appendChild(li);
    input.value = "";
  }

  function handleRemove(e, target) {
    target.remove();
  }
  function handleToggle(e, target) {
    toggled = !toggled;
    count++;

    target.textContent = toggled ? "On" : "Off";

    const box = document.getElementById("box");
    box.textContent = `Clicks: ${count}`;
  }

  return Domo("section")
    .state({ toggled, count, currentMode })
    .onClosest("click", {
      "#toggle-btn": handleToggle,
      "#add-btn": handleAddItem,
      "#list li": handleRemove,
      ".mode-btn": handleModeChange,
      "#box": (e, target) => {
        target.textContent = "😄 stop clicking me";
      },
    })
    .css(styles.section)
    .child([
      Domo("h2").txt("Mini Playground Island").css(styles.heading),

      // 🔹 controls
      Domo("div")
        .css(styles.controls)
        .child([
          createButton({ label: "Toggle", cls: "", "data-id": "toggle-btn" }).id("toggle-btn"),
          Domo("p").id("box").txt("Click the button").css(styles.boxText),
        ]),

      // 🔹 mode switcher (like your template switcher)
      Domo("div")
        .css(styles.switcher)
        .child(
          Object.keys(modes).map((mode) =>
            createButton({
              label: mode,
              cls: `mode-btn ${mode === currentMode ? "active" : ""}`,
              "data-mode": mode,
            }),
          ),
        ),

      // 🔹 list section (dynamic replacement target)
      Domo("div")
        .css(styles.listContainer)
        .child([
          Domo("input").id("item-input").attr({ placeholder: "Add item..." }).css(styles.input),
          createButton({ label: "Add", cls: "", "data-id": "add-btn" }).id("add-btn"),

          listDisplay,
        ]),
    ]);
}

const styles = {
  section: {
    padding: "30px",
    backgroundColor: "#1e1f26",
    borderRadius: "10px",
    width: "360px",
    margin: "60px auto",
    fontFamily: "sans-serif",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    color: "#f5f5f5",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "22px",
  },

  controls: {
    marginBottom: "20px",
  },

  switcher: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px",
  },

  boxText: {
    marginTop: "10px",
    fontSize: "14px",
  },

  listContainer: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#2a2c36",
    borderRadius: "6px",
  },

  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "none",
    width: "60%",
  },

  listItem: {
    listStyle: "none",
    padding: "6px",
    marginTop: "6px",
    backgroundColor: "#3a3d4a",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
