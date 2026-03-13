export function getDefaultConfig() {
  return {
    width: 1200,
    height: 630,
    background: {
      type: "color",
      value: "#272727",
    },
    elements: [
      {
        type: "text",
        content: "NEW ARTICLE",
        horizontalAlign: "center",
        verticalAlign: "top",
        padding: 80,
        fontSize: 24,
        color: "#272727",
        backgroundColor: "#E9FA00",
        bgPadding: 16,
        borderRadius: 8,
      },
      {
        type: "text",
        content: "{{title}}",
        horizontalAlign: "center",
        verticalAlign: "middle",
        padding: 40,
        fontSize: 76,
        color: "#FFFFFF",
      },
      {
        type: "text",
        content: "Zyrab.dev",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        padding: 60,
        fontSize: 28,
        color: "#928585",
      },
    ],
  };
}
