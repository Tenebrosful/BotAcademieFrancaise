import { parse as parseHTML } from "npm:node-html-parser";
import { parse as parseCSV } from "jsr:@std/csv";
import { idToIdStr, Word } from "./Word.ts";

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
          response.text().then(text => {
            this.words.set(i, Word.FromHTML(parseHTML(text), i));
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

  fillDictionaryFromCSV(csv: string) {
    const data = parseCSV(csv, { skipFirstRow: true });
    data.forEach((word) => {
      this.words.set(
        parseInt(word.id),
        new Word(
          parseInt(word.id),
          word.id_str,
          word.word,
          word.type,
          word.etymology,
          word.definition,
          word.added_at != "" ? new Date(word.added_at) : undefined
        )
      );
    });
  }

  fetchNextWord(): Promise<Response> {
    const nextId = this.words.size + 1;
    return fetchWord(nextId);
  }

  tryAddNextWord(): Promise<boolean> {
    const nextId = this.words.size + 1;
    console.info(`Tentative d'ajout du mot ${nextId}`);
    return new Promise((resolve, reject) => {
      this.fetchNextWord().then(response => {
        switch (response.status) {
          case 200:
            response.text().then(text => {
              const newWord = Word.FromHTML(parseHTML(text), nextId);
              newWord.added_at = new Date();
              this.words.set(nextId, newWord);
              resolve(true);
            });
            break;
          case 404:
            console.error(`Mot introuvable pour l'id ${nextId}`);
            resolve(false);
            break;
          default:
            console.error("Error", response.status);
            resolve(false);
            break;
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

function getWordUrl(id: number): string {
  return `${BASE_URL}${PREFIX_INTERCALAIRE}${idToIdStr(id)}`;
}

function fetchWord(id: number): Promise<Response> {
  return fetch(getWordUrl(id));
}

export { getWordUrl, fetchWord, Dictionary };