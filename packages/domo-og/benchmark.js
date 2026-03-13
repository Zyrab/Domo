import { generateOgImage } from "./packages/domo-og/src/index.js";
import { performance } from "perf_hooks";
import os from "os";
import fs from "fs";

// --- 1. System Info ---
console.log("=========================================");
console.log("DOMO-OG BENCHMARK SUITE");
console.log("=========================================");
console.log(`CPU: ${os.cpus()[0].model}`);
console.log(`Cores: ${os.cpus().length}`);
console.log(`Total RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log(`Node Version: ${process.version}`);
console.log("=========================================\n");

// --- Helper to run tests ---
async function runTest(testName, iterations, templateConfig) {
  console.log(`Running: ${testName} (${iterations} iterations)...`);

  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    await generateOgImage({
      slug: `bench-${testName.toLowerCase().replace(/\s+/g, "-")}-${i}`,
      ogOutputPath: "./benchmark-output",
      template: templateConfig,
      title: `Benchmark Test #${i}`,
      category: "Speed Test",
    });
  }

  const endTime = performance.now();
  const totalTimeMs = endTime - startTime;
  const avgTimePerImage = totalTimeMs / iterations;

  console.log(`Done!`);
  console.log(`Total Time: ${(totalTimeMs / 1000).toFixed(2)} seconds`);
  console.log(`Avg Time per Image: ${avgTimePerImage.toFixed(2)} ms\n`);
}

async function startBenchmarks() {
  if (fs.existsSync("./benchmark-output")) {
    fs.rmSync("./benchmark-output", { recursive: true, force: true });
  }

  const simpleTemplate = {
    width: 1200,
    height: 630,
    background: { type: "color", value: "#1a1a1a" },
    elements: [
      {
        type: "text",
        content: "{{title}}",
        horizontalAlign: "center",
        verticalAlign: "middle",
        fontSize: 60,
        color: "#fff",
      },
    ],
  };

  const complexTemplate = {
    width: 1200,
    height: 630,
    background: { type: "color", value: "#272727" },
    elements: [
      {
        type: "text",
        content: "NEW ARTICLE",
        horizontalAlign: "left",
        verticalAlign: "top",
        padding: 80,
        fontSize: 24,
        color: "#000",
        backgroundColor: "#E9FA00",
      },
      {
        type: "text",
        content: "{{title}}",
        horizontalAlign: "center",
        verticalAlign: "middle",
        fontSize: 76,
        color: "#FFFFFF",
      },
      {
        type: "image",
        src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
        horizontalAlign: "center",
        verticalAlign: "middle",
        width: 100,
        height: 100,
      },
    ],
  };

  try {
    await runTest("Simple Template (Cold)", 200, simpleTemplate);

    await runTest("Complex Template (Remote Image)", 50, complexTemplate);
    await runTest("Cache Hit Test (Re-run Simple)", 200, simpleTemplate);
  } catch (err) {
    console.error("Benchmark failed:", err);
  } finally {
    if (fs.existsSync("./benchmark-output")) {
      fs.rmSync("./benchmark-output", { recursive: true, force: true });
    }
  }
}

startBenchmarks();
