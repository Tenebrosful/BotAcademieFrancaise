import console from "node:console";
import { setTimeout } from "node:timers";

function printTime() {
  return `[${new Date().toLocaleString("fr-FR")}]`;
}

function getLetterFromAlphabetIndex(position: number) {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ_"[position - 1]
}

// Source - https://stackoverflow.com/a/39914235
// Posted by Dan Dascalescu, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-04, License - CC BY-SA 4.0

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function printOnExit(code: number | string | null | undefined, error?: Error) {
  console.log(`${printTime()} === Exiting ${code} ===`);
  if (error) {
    console.error(error);
  }

  if (typeof (code) === "number") {
    process.exit(code);
  }

  process.exit(1);
}

export { printTime, getLetterFromAlphabetIndex, sleep };
