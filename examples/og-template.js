export const ogConfig = {
  width: 1200,
  height: 630,
  fontPath: "dist/assets/fonts/CutiveMono-Regular.ttf",
  background: {
    type: "image",
    src: "assets/og-image.png",
  },
  elements: [
    {
      type: "text",
      content: "@zyrab/domo-og",
      horizontalAlign: "left",
      verticalAlign: "top",
      fontSize: 25,
      color: "#FFFFFF",
      backgroundColor: "#000000",
      bgPadding: 10,
      padding: 4,
    },
    {
      type: "text",
      content: "{{title}} Hey there",
      fontSize: 38,
      color: "#F5BC00",
      horizontalAlign: "center",
      verticalAlign: "middle",
      width: 500,
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
      horizontalAlign: "right",
      verticalAlign: "bottom",
      width: 100,
      height: 100,
    },
    {
      type: "text",
      content: "This {{item}} page, is type {{type}} and now we will. add some more data to test this",
      fontSize: 16,
      color: "#F5BC00",
      horizontalAlign: "right",
      verticalAlign: "bottom",
    },
  ],
};

export const testOgConfig = {
  width: 1200,
  height: 630,
  fontPath: "dist/assets/fonts/SonoSans-Medium.ttf",
  background: {
    type: "image",
    src: "og-image.png",
  },
  elements: [
    // --- TEXT ALIGNMENT GRID ---

    { type: "text", content: "Top Left", horizontalAlign: "left", verticalAlign: "top", fontSize: 25, color: "#fff" },
    {
      type: "text",
      content: "Top Center",
      horizontalAlign: "center",
      verticalAlign: "top",
      fontSize: 25,
      color: "#fff",
    },
    { type: "text", content: "Top Right", horizontalAlign: "right", verticalAlign: "top", fontSize: 25, color: "#fff" },

    {
      type: "text",
      content: "Mid Left",
      horizontalAlign: "left",
      verticalAlign: "middle",
      fontSize: 25,
      color: "#fff",
    },
    {
      type: "text",
      content: "Mid Center",
      horizontalAlign: "center",
      verticalAlign: "middle",
      fontSize: 25,
      color: "#fff",
    },
    {
      type: "text",
      content: "Mid Right",
      horizontalAlign: "right",
      verticalAlign: "middle",
      fontSize: 25,
      color: "#fff",
    },

    {
      type: "text",
      content: "Bottom Left",
      horizontalAlign: "left",
      verticalAlign: "bottom",
      fontSize: 25,
      color: "#fff",
    },
    {
      type: "text",
      content: "Bottom Center",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      fontSize: 25,
      color: "#fff",
    },
    {
      type: "text",
      content: "Bottom Right",
      horizontalAlign: "right",
      verticalAlign: "bottom",
      fontSize: 25,
      color: "#fff",
    },

    // --- IMAGE ALIGNMENT GRID ---

    {
      type: "image",
      src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
      width: 100,
      height: 100,
      horizontalAlign: "right",
      verticalAlign: "top",
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
      width: 100,
      height: 100,
      horizontalAlign: "right",
      verticalAlign: "middle",
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
      width: 100,
      height: 100,
      horizontalAlign: "center",
      verticalAlign: "middle",
    },
    {
      type: "image",
      src: "https://raw.githubusercontent.com/Zyrab/Domo/d7c1f19eb992897c4540b30a9f684db9e595ab0b/assets/logo.png",
      width: 100,
      height: 100,
      horizontalAlign: "right",
      verticalAlign: "bottom",
    },

    // --- WIDTH CONSTRAINED TEXT TEST ---

    {
      type: "text",
      content:
        "Long wrapping text test to see how the engine behaves when width is constrained and alignment is centered.",
      horizontalAlign: "center",
      verticalAlign: "middle",
      width: 400,
      fontSize: 22,
      color: "#F5BC00",
    },

    // --- BACKGROUND BOX TEST ---

    {
      type: "text",
      content: "BG + Padding Test",
      horizontalAlign: "left",
      verticalAlign: "bottom",
      fontSize: 20,
      color: "#fff",
      backgroundColor: "#000",
      bgPadding: 12,
      padding: 16,
    },
    {
      type: "text",
      content: "BG + Padding Test",
      horizontalAlign: "right",
      verticalAlign: "middle",
      fontSize: 20,
      color: "#fff",
      backgroundColor: "#000",
      bgPadding: 90,
      padding: 16,
    },
    {
      type: "text",
      content: "BG + Padding Test",
      horizontalAlign: "left",
      verticalAlign: "middle",
      fontSize: 20,
      color: "#fff",
      backgroundColor: "#000",
    },

    // --- EXTREME RIGHT EDGE TEST ---

    {
      type: "text",
      content: "Edge Clamp Test",
      horizontalAlign: "right",
      verticalAlign: "top",
      fontSize: 18,
      width: 250,
      color: "#ff6666",
    },
  ],
};
