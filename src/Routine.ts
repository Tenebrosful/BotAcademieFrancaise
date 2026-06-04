import console from "node:console";
import { LoadFromCSV, SaveToCSV } from "./CSV.ts";
import { Word } from "./Word.ts";

async function RoutineNewWord(): Promise<Word[]> {
  const dictionary = await LoadFromCSV("./output/dictionary.csv");

  const newWords = await dictionary.fillDictionary();

  if (newWords.length > 0) SaveToCSV(dictionary, "./output/dictionary.csv");

  return newWords;
}

export { RoutineNewWord };
