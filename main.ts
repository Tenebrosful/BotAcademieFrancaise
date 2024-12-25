import { Dictionary } from "./src/Dictionary.ts";
import { SaveToCSV } from "./src/Save.ts";

const dictionary = new Dictionary();
await dictionary.fillDictionary();
console.log(dictionary.words);

SaveToCSV(dictionary, "./output/dictionary.csv");