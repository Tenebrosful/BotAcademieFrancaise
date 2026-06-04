import { HTMLElement } from "npm:node-html-parser";
import { findElement, property } from "./HtmlHelper.ts";

class Word implements Readonly<Record<string, unknown>> {
  id: string;
  letter: string;
  word?: string;
  type?: string;
  etymology?: string;
  definition?: string;
  added_at?: Date;

  constructor(id: string, letter: string, word?: string, type?: string, etymology?: string, definition?: string, added_at?: Date) {
    this.id = id;
    this.letter = letter;
    this.word = word;
    this.type = type;
    this.etymology = etymology;
    this.definition = definition;
    this.added_at = added_at;
  }
  readonly [x: string]: unknown;

  static FromHTML(html: HTMLElement, idwithletter: string): Word {
    const word = new Word(idwithletter, idwithletter[0] as string);
    word.word = findElement(html, property.word);
    word.type = findElement(html, property.type);
    word.etymology = findElement(html, property.etymology);
    word.definition = findElement(html, property.definition);
    return word;
  }

  toString(): string {
    return `${this.id} - ${this.word} (${this.type}) : ${this.definition}`;
  }
}

function idToIdStr(id: number): string {
  return id.toString().padStart(4, "0");
}

export { idToIdStr, Word };
