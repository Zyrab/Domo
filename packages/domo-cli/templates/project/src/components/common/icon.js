import Domo from "@zyrab/domo";

export default function createIcon({ icon, size = "1.25rem" }) {
  return Domo()
    .cls("flex jc-c ai-c")
    .child([
      Domo("img")
        .css({ width: size, height: size })
        .attr({
          loading: "lazy",
          src: "https://img.icons8.com/" + icons[icon] + ".png",
          alt: "",
          "aria-hidden": "true",
        }),
    ]);
}

const icons = {
  gh: "3d-fluency/35/github",
  gmail: "color/35/gmail-new",
  glxy: "flat-round/35/galaxy",
  exp: "ffffff/ios-filled/35/expo",
  frb: "color/35/firebase",
  rn: "color/35/react-native",
  fg: "color/35/figma--v1",
  gglplay: "color/35/google-play",
  dmn: "fluency/35/domain",
  vue: "color/35/vue-js",
  tlwcss: "color/35/tailwindcss",
  admb: "color/35/google-admob",
  close: "color/35/delete-sign--v1",
  play: "color/35/play",
  pause: "color/35/pause",
  replay: "color/35/replay",
  warp: "color/35/black-hole",
  dwnld: "color/35/download--v1",
  unt: "fluency/35/unity",
  cshrp: "color/35/c-sharp-logo-2",
  css: "color/35/css3",
  js: "color/35/javascript--v1",
  html: "color/35/html-5--v1",
  lnkdn: "color/35/linkedin",
  npm: "color/35/npm",
  html5: "color/35/html-5--v1",
};
