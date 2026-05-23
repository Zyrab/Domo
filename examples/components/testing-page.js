import Domo from "../../packages/domo/src/index.js";

export default function testPage(props) {
  const propKeys = Object.keys(props);
  // console.log(props);

  return Domo()
    .state({ counter: 0 })
    .onClosest("click", {
      button: (e, t) => {
        const action = t.textContent;
        let target = document.getElementById("counter-container");
        const tValue = target.textContent;
        let num = Number(tValue);
        if (action === "-1") {
          num--;
        } else if (action === "+1") {
          num++;
        } else {
          num *= 2;
        }
        target.textContent = num;
      },
    })
    .child([
      propKeys.map((key) => Domo("p").txt(props[key])),
      Domo("p").id("counter-container").txt(0),
      Domo().child([Domo("button").txt("+1"), Domo("button").txt("-1"), Domo("button").txt("*2")]),
    ]);
}
