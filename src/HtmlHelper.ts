export { findElement, property };

import { HTMLElement } from "npm:node-html-parser";

function findElement(html: HTMLElement, prorieteAChercher: property) {
  switch (prorieteAChercher) {
    case property.word:
      return html.querySelector(".s_Entree")?.childNodes.find((node) => node.nodeType === 3)?.text.trim();
    case property.type:
      return (html.querySelector(".s_cat > span > span") || html.querySelector(".s_cat > span"))?.text.trim();
    case property.etymology:
      return html.querySelector(".s_zEtym")?.text.trim();
    case property.definition:
      return (html.querySelector(".s_Div_ol") || html.querySelector(".s_Corps") || html.querySelector(".s_DivPar"))?.text.trim();
  }
}

enum property {
  word,
  type,
  etymology,
  definition,
}
