import { HTMLElement } from "npm:node-html-parser";
import { findElement, property } from "./HtmlHelper.ts";

class Word implements Readonly<Record<string, unknown>> {

  id: number;
  id_str: string;
  word?: string;
  type?: string;
  etymology?: string;
  definition?: string;
  added_at?: Date;

  constructor(id: number, id_str: string, word?: string, type?: string, etymology?: string, definition?: string, added_at?: Date) {
    this.id = id;
    this.id_str = id_str;
    this.word = word;
    this.type = type;
    this.etymology = etymology;
    this.definition = definition;
    this.added_at = added_at;
  }
  readonly [x: string]: unknown;

  static FromHTML(html: HTMLElement, id: number): Word {
    const word = new Word(id, idToIdStr(id));
    word.word = findElement(html, property.word);
    word.type = findElement(html, property.type);
    word.etymology = findElement(html, property.etymology);
    word.definition = findElement(html, property.definition);
    return word;
  }

  toString(): string {
    return `${this.id_str} - ${this.word} (${this.type}) : ${this.definition}`;
  }
}

function idToIdStr(id: number): string {
  return id.toString().padStart(4, "0");
}

export { Word, idToIdStr };