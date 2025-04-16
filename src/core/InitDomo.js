export default class InitDomo {
  constructor(appId = "app") {
    this.app = document.getElementById(appId);
    this.components = [];
    document.addEventListener("DOMContentLoaded", () => this.initApp());
  }

  add(component) {
    this.components.push(component);
  }

  initApp() {
    this.components.forEach((comp) => this.app.appendChild(comp));
  }
}
