import { parse as parseHTML } from "node-html-parser";
import { idToIdStr, Word } from "./Word.ts";
import { getLetterFromAlphabetIndex, printTime, sleep } from "./Util.ts";
import { readCSV } from "bun-excel"
import console from "node:console";
import { dm, post } from "./Bluesky.ts";

const BASE_URL = "https://www.dictionnaire-academie.fr/article/";
const PREFIX_10_EDITION = "B0";
const PREFIX_INTERCALAIRE = "A9_";

class Dictionary {
  words: Map<string, Word> = new Map();
  current_letter = "A"
  current_letter_index = 1;
  current_id = 0

  async fillDictionary() {
    const newWords: Word[] = []

    let breakloop = false;

    for (let letterIndex = 1; letterIndex <= 27; letterIndex++) {
      if (breakloop) break;
      const letter = getLetterFromAlphabetIndex(letterIndex) as string;

      for (let length = 4; length <= 5; length++) {
        if (breakloop) break;
        console.log(`${printTime()} Recherche des mots en ${length == 4 ? letter + "XXXX" : letter + "XXXXX"}`)

        for (let id = 0; id <= 9999; id++) {
          if (breakloop) break;

          const id_str = idToIdStr(id, length);

          if (this.words.keys().some(k => k == letter + id_str)) continue;

          let error = false;

          do {
            try {
              const response = await fetchWord(letter, id, length);

              switch (response.status) {
                case 200:
                  {
                    const text = await response.text();
                    const word = Word.FromHTML(parseHTML(text), letter + id_str);
                    word.added_at = new Date();
                    this.words.set(letter + id_str, word);
                    newWords.push(word);
                    console.log(`${printTime()} Nouveau mot ${word.id} ! ${word.word} !${word.id.length == 6 ? " ✨ EXCLUSIF 10ème ✨ !" : ""}`)
                  }
                  break;
                case 403:
                  dm(`Aled @tenebrosful.fr ! Je suis ban de l'académie française (${letter + id_str}) ! [Erreur 403]`);
                  console.error(response)
                  breakloop = true;
                  break;
                case 404:
                  // console.error(`Mot introuvable pour l'id ${letter + id_str}`);
                  break;
                default:
                  console.error("Error", response.status);
                  break;
              }

              error = false;
            } catch (e: unknown) {
              error = true;
              console.error(e);
              console.log("Sleeping 5s")
              await sleep(5000)
            }
          } while (error)
          // await sleep(1000)
        }
      }
    }

    if (breakloop) console.error(`${printTime()} Loop has been broken ! ${newWords}`)

    return newWords;
  }

  async fillDictionaryFromCSV(path: string) {
    const workbook = await readCSV(Bun.file(path), { hasHeader: true });

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error("No worksheet found in CSV");
    }

    worksheet.rows.forEach((row) => {
      this.words.set(
        row.cells[0]?.value as string,
        new Word(
          row.cells[0]?.value as string,
          row.cells[1]?.value as string,
          row.cells[2]?.value as string,
          row.cells[3]?.value as string,
          row.cells[4]?.value as string,
          row.cells[5]?.value as string,
          row.cells[6]?.value != "" ? new Date(row.cells[6]?.value as string) : undefined,
        ),
      );
    });

    return this
  }

  fetchNextWord(): Promise<Response> {
    return fetchWord(this.current_letter, this.current_id);
  }

  tryAddNextWord(): Promise<boolean> {
    console.info(`Tentative d'ajout du mot ${this.current_letter + this.current_id}`);
    return new Promise((resolve, reject) => {
      this.fetchNextWord().then((response) => {
        switch (response.status) {
          case 200:
            response.text().then((text) => {
              const newWord = Word.FromHTML(parseHTML(text), this.current_letter + this.current_id);
              newWord.added_at = new Date();
              this.words.set(this.current_letter + this.current_id, newWord);
              resolve(true);
            });
            break; case 404:
            console.error(`Mot introuvable pour l'id ${this.current_letter + this.current_id}`);
            resolve(false);
            break;
          default:
            console.error("Error", response.status);
            resolve(false);
            break;
        }

        this.current_id++;
        if (this.current_id > 9999) {
          this.current_id = 0;
          this.current_letter_index++;
          this.current_letter = getLetterFromAlphabetIndex(this.current_letter_index) as string;
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

function getWordUrl(id: string): string {
  return `${BASE_URL}${PREFIX_10_EDITION}${id}`;
}

function fetchWord(letter: string, id: number, length: number | undefined): Promise<Response> {
  return fetch(getWordUrl(letter + idToIdStr(id, length)), { headers: { "User-Agent": "COME ON" } });
}

export { Dictionary, fetchWord, getWordUrl };
