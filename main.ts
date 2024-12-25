import { TimerBasedCronScheduler as scheduler } from "jsr:@p4sca1/cron-schedule/schedulers/timer-based";
import { parseCronExpression } from "jsr:@p4sca1/cron-schedule";
import { RoutineNewWord } from "./src/Routine.ts";
import { login, post } from "./src/Bluesky.ts";
import { getWordUrl } from "./src/Dictionary.ts";
import { printTime } from "./src/Util.ts";

const cron = parseCronExpression("* * 8,12,20 * * *");

console.log(`${printTime()} Login to Bluesky...`);

await login();

console.log(`${printTime()} Logged in !`);

console.log(`${printTime()} Starting !`);

scheduler.setInterval(cron, async () => {
  console.log(`${printTime()} Routine...`);
  const newWords = await RoutineNewWord();

  newWords.forEach((word) => {
    console.log(`${printTime()} New Word : ${word.word} (${word.type})`);
    post(`📖✒️ Nouveau mot intercalaire !\n\n${word.word} (${word.type})\n\n${getWordUrl(word.id)}`);
  });
});

Deno.addSignalListener("SIGINT", () => {
  console.log(`${printTime()} Arrêt du programme...`);
  Deno.exit(0);
});

Deno.addSignalListener("SIGINT", () => {
  console.log(`${printTime()} Arrêt du programme...`);
  Deno.exit(0);
});