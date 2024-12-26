import { LoadFromCSV, SaveToCSV } from "./CSV.ts";
import { Word } from "./Word.ts";

async function RoutineNewWord(): Promise<Word[]> {
  const dictionary = await LoadFromCSV("./output/dictionary.csv");
  const newWords: Word[] = [];

  let isThereNewWord = await dictionary.tryAddNextWord();
  const atLeastOneNewWord = isThereNewWord;

  while (isThereNewWord) {
    const lastWord = dictionary.words.get(dictionary.words.size);
    if (lastWord != null) newWords.push(lastWord);
    isThereNewWord = await dictionary.tryAddNextWord();
  }

  if (atLeastOneNewWord) SaveToCSV(dictionary, "./output/dictionary.csv");

  return newWords;
}

export { RoutineNewWord };
