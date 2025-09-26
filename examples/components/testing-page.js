import Domo from "../../packages/domo/src/domo.js";

export default function testPage(props) {
  const propKeys = Object.keys(props);
  // console.log(props);

  return Domo()
    .txt("testing page")
    .child([propKeys.map((key) => Domo("p").txt(props[key]))]);
}
