import { TimerBasedCronScheduler as scheduler } from "jsr:@p4sca1/cron-schedule/schedulers/timer-based";
import { parseCronExpression } from "jsr:@p4sca1/cron-schedule";
import { RoutineNewWord } from "./src/Routine.ts";

const cron = parseCronExpression("* * 8,12,20 * * *");

console.log("Starting !");

scheduler.setInterval(cron, async () => {
  const newWords = await RoutineNewWord();

  newWords.forEach((word) => {
    console.log(`New word: ${word}`);
  });
});