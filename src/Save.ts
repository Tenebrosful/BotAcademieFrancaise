import { writeFile } from "node:fs";
import { Dictionary } from "./Dictionary.ts";
import { mkConfig, generateCsv, asString } from "npm:export-to-csv";
import { Buffer } from "node:buffer";

export { SaveToCSV };

const csvConfig = mkConfig({ useKeysAsHeaders: true });

function SaveToCSV(dictionary: Dictionary, path: string) {
  const csv = generateCsv(csvConfig)(dictionary.getWordsArrayToCSV());
  const buffer = new Uint8Array(Buffer.from(asString(csv), "utf-8"));

  writeFile(path, buffer, (err) => {
    if (err) {
      throw err;
    }
    console.log("The file was saved!");
  });

}
