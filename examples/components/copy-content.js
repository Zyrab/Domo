let toggled = false;
export function handleToggle(e, target) {
  toggled = !toggled;
  count++;

  target.textContent = toggled ? "On" : "Off";

  const box = document.getElementById("box");
  box.textContent = `Clicks: ${count}`;
}
