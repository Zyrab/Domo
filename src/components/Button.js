import { html } from "./DOMConstructor.js";
let count = 0;
export const counter = (increment = true, text) => {
  function onClick() {
    increment ? count++ : count--;
    text.textContent = `${count}`;
    ``;
  }
  return html({
    el: "button",
    text: increment ? "Increment" : "Decrement",
    events: {
      click: onClick,
    },
  });
};
