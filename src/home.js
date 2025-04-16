import { html } from "./DOMConstructor.js";

export const Home = () => {
  const box = html({ text: "Static Text" });
  return html({
    children: [
      html({
        el: "button",
        text: "Show/Hide",
        events: {
          click: () => {
            box.textContent =
              box.textContent === "Static Text" ? "Hide" : "Static Text";
          },
        },
      }),
      html({
        el: "div",
        ID: "box",
        style: {
          width: "100px",
          height: "100px",
        },
        children: [box],

        // dynamicChildren: [
        //   show,
        //   () =>
        //     show.value ? [html({ text: "Hide" })] : [html({ text: "Show" })],
        // ],
      }),
    ],
  });
};
