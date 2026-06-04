import { CronJob } from "cron";
import { RoutineNewWord } from "./src/Routine.ts";
import { dm, login, post } from "./src/Bluesky.ts";
import { getWordUrl } from "./src/Dictionary.ts";
import { printOnExit, printTime } from "./src/Util.ts";
import console from "node:console";
import { sleep } from "bun";

console.log(`${printTime()} Login to Bluesky...`);

await login();

console.log(`${printTime()} Logged in !`);

console.log(`${printTime()} Starting !`);

const task = async () => {
  console.log(`${printTime()} Routine...`);
  const newWords = await RoutineNewWord();

  for (const word of newWords) {
    console.log(`${printTime()} New Word : ${word.word} (${word.type})`);
    post(`📖✒️ Nouveau mot ${word.id.length == 6 ? "✨ EXCLUSIF ✨" : ""} de la 10ème édition !${word.id[0] == "_" ? " (Mot intercalaire !)" : ""}\n\n${word.word} (${word.type})\n\n${getWordUrl(word.id)}`);
    await sleep(1000);
    // console.log(`📖✒️ Nouveau mot intercalaire !\n\n${word.word} (${word.type})\n\n${getWordUrl(word.id)}`);
  };

  if (newWords.length > 0) dm("hey ! Je viens de poster des nouveaux mots !")

  console.log(`${printTime()} End routine, next date : ${getNextDateJob()}`);
}

const cron = new CronJob("0 12 * * *", task, null, true, "Europe/Paris");

const nextDates = cron.nextDates(3);
console.log(`${printTime()} Next dates: ${nextDates[0]?.toString()}, ${nextDates[1]?.toString()}, ${nextDates[2]?.toString()}`);

function getNextDateJob() {
  return cron.nextDate().toString();
}

process.on("exit", (code) => printOnExit(code));
process.on("SIGHUP", () => printOnExit("SIGHUP"));
process.on("SIGINT", () => printOnExit("SIGINT"));
process.on("SIGTERM", () => printOnExit("SIGTERM"));
process.on("SIGBREAK", () => printOnExit("SIGBREAK"));
process.on("uncaughtException", (error, origin) => printOnExit(origin, error));

// task();

// Deno.addSignalListener("SIGTERM", () => {
//   console.log(`${printTime()} Arrêt du programme...`);
//   Deno.exit(0);
// });
