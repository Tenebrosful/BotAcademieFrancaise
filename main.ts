import { TimerBasedCronScheduler as scheduler } from "jsr:@p4sca1/cron-schedule/schedulers/timer-based";
import { parseCronExpression } from "jsr:@p4sca1/cron-schedule";
import { RoutineNewWord } from "./src/Routine.ts";
import { login, post } from "./src/Bluesky.ts";
import { getWordUrl } from "./src/Dictionary.ts";
import { printTime } from "./src/Util.ts";

const cron = parseCronExpression("0 12 * * *");

console.log(`${printTime()} Login to Bluesky...`);

await login();

console.log(`${printTime()} Logged in !`);

console.log(`${printTime()} Starting !`);

const nextDates = cron.getNextDates(3);

console.log(`${printTime()} Next dates: ${nextDates[0]}, ${nextDates[1]}, ${nextDates[2]}`);

scheduler.setInterval(cron, async () => {
  console.log(`${printTime()} Routine...`);
  const newWords = await RoutineNewWord();

  newWords.forEach((word) => {
    console.log(`${printTime()} New Word : ${word.word} (${word.type})`);
    post(`📖✒️ Nouveau mot intercalaire !\n\n${word.word} (${word.type})\n\n${getWordUrl(word.id)}`);
  });

  console.log(`${printTime()} End routine, next date : ${cron.getNextDate()}`);
});

Deno.addSignalListener("SIGINT", () => {
  console.log(`${printTime()} Arrêt du programme...`);
  Deno.exit(0);
});

Deno.addSignalListener("SIGTERM", () => {
  console.log(`${printTime()} Arrêt du programme...`);
  Deno.exit(0);
});
