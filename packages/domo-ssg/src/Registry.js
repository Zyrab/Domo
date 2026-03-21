// src/registry.js
class BuildRegistry {
  constructor() {
    this.routePaths = {};
  }

  setRoutes(routes) {
    this.routePaths = routes;
  }

  getRoute(name) {
    return this.routePaths[name];
  }
}

// Export a single instance to be shared across the build process
export const registry = new BuildRegistry();
