import { parse } from "npm:node-html-parser";
import { idToIdStr, Word, WordCSV } from "./Word.ts";
import { findElement, property } from "./HtmlHelper.ts";

const BASE_URL = "https://www.dictionnaire-academie.fr/article/";
const PREFIX_INTERCALAIRE = "A9_";

class Dictionary {
  words: Map<number, Word> = new Map();

  async fillDictionary() {
    for (let i = 1; i <= 300; i++) {
      const response = await fetchWord(i);
      let echec404 = 0;

      switch (response.status) {
        case 200:
          response.text().then(async text => {
            const html = parse(text);
            const word = findElement(html, property.word);
            const type = findElement(html, property.type);
            const etymology = findElement(html, property.etymology);
            const definition = findElement(html, property.definition);
            this.words.set(i, new Word(i, idToIdStr(i), word, type, etymology, definition));
          });
          break;
        case 404:
          console.error(`Mot introuvable pour l'id ${i}`);
          echec404++;
          if (echec404 > 10) {
            console.error("Trop d'échecs 404, arrêt de la recherche");
            return;
          }
          break;
        default:
          console.error("Error", response.status);
          break;
      }
    }
  }

  getWordsArray(): Word[] {
    return [...this.words.values()];
  }

  getWordsArrayToCSV(): WordCSV[] {
    return this.getWordsArray().map(word => word.ToCSV());
  }
}

function getWordUrl(id: number): string {
  return `${BASE_URL}${PREFIX_INTERCALAIRE}${idToIdStr(id)}`;
}

function fetchWord(id: number): Promise<Response> {
  return fetch(getWordUrl(id));
}

export { getWordUrl, fetchWord, Dictionary };