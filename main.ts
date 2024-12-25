import { TimerBasedCronScheduler as scheduler } from "jsr:@p4sca1/cron-schedule/schedulers/timer-based";
import { parseCronExpression } from "jsr:@p4sca1/cron-schedule";
import { RoutineNewWord } from "./src/Routine.ts";
import { login, post } from "./src/Bluesky.ts";
import { getWordUrl } from "./src/Dictionary.ts";

const cron = parseCronExpression("* * 8,12,20 * * *");

console.log("Login to bluesky...");

await login();

console.log("Logged in !");

console.log("Starting !");

scheduler.setInterval(cron, async () => {
  const newWords = await RoutineNewWord();

  newWords.forEach((word) => {
    post(`📖✒️ Nouveau mot intercalaire !\n\n${word.word} (${word.type})\n\n${getWordUrl(word.id)}`);
  });
});