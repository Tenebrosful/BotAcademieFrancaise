import { readFile, writeFile } from "node:fs";
import { Dictionary } from "./Dictionary.ts";
import { stringify } from "@std/csv";
import { printTime } from "./Util.ts";

export { LoadFromCSV, SaveToCSV };

function SaveToCSV(dictionary: Dictionary, path: string) {
  const tmp = Array.from(dictionary.words.values());
  const csv = stringify(tmp, { columns: ["id", "id_str", "word", "type", "etymology", "definition", "added_at"] });

  writeFile(path, csv, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${printTime()} File saved !`);
  });
}

function LoadFromCSV(path: string): Promise<Dictionary> {
  return new Promise((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) {
        try {
          SaveToCSV(new Dictionary(), path);
        } catch (err) {
          reject(err);
        }
      }

      if (data?.toString() === "") {
        resolve(new Dictionary());
        return;
      }

      const dictionary = new Dictionary();
      dictionary.fillDictionaryFromCSV(data.toString());

      resolve(dictionary);
    });
  });
}
