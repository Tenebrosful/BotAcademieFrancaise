import { Dictionary } from "./Dictionary.ts";
import { writeCSV, type CellValue } from "bun-excel";

export { LoadFromCSV, SaveToCSV };

function SaveToCSV(dictionary: Dictionary, path: string) {


  const words = Array.from(dictionary.words.values()).sort((a, b) => a.id.localeCompare(b.id));
  const cells: CellValue[][] = [["id", "letter", "word", "type", "etymology", "definition", "added_at"]];

  words.forEach(word => {
    cells.push([word.id, word.letter, word.word, word.type, word.etymology, word.definition, word.added_at])
  })

  const file = Bun.file(path)

  writeCSV(file, cells, { includeHeader: true })
}

async function LoadFromCSV(path: string) {
  return new Dictionary().fillDictionaryFromCSV(path)
}
