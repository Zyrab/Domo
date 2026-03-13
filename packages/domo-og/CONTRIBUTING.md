# Contributing to @zyrab/domo-og

Thank you for your interest in contributing to `@zyrab/domo-og`! 

The primary goal of this package is to remain a **simple, lightweight, and blazing-fast config-driven OG image generator**. If the package becomes too heavy or feature-bloated, it defeats its own purpose (at which point, one might as well use Puppeteer or Satori). 

Before submitting a Pull Request, please read the guidelines below.

## How to Contribute

### 1. Reporting Bugs
If you find a bug, please open an issue! Be sure to include:
- A clear description of the problem.
- Your OS and Node.js version.
- A minimal reproducible code snippet (your `template` config).

### 2. Suggesting Features
I'm open to new feature ideas, but **the final decision on incorporating new features will be strictly mine**. 
Features that add significant dependencies, slow down the build process, or over-complicate the configuration API will likely be rejected to preserve the core goal of the project. Please open an issue to discuss your idea *before* writing any code.

### 3. Submitting Pull Requests
- Fork the repository and create your feature branch: `git checkout -b my-new-feature`
- Ensure your code adheres to standard JavaScript practices.
- If fixing a bug or changing behavior, update `CHANGELOG.md` properly.
- If introducing an API change (or an accepted feature), update `README.md` to reflect it.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request!

## Local Development

1. Clone the repository.
2. Run `npm install` in the project root.
3. Use the included `benchmark.js` standard file to evaluate that performance has not degraded after your changes:
   ```bash
   node benchmark.js
   ```

Thank you!
