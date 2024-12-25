class Word {

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

  ToCSV(): WordCSV {
    return {
      id: this.id,
      id_str: this.id_str,
      word: this.word || "",
      type: this.type || "",
      etymology: this.etymology || "",
      definition: this.definition || "",
      added_at: this.added_at?.toISOString() || "",
    };
  }
}

type WordCSV = {
  id: number;
  id_str: string;
  word: string;
  type: string;
  definition: string;
  etymology: string;
  added_at: string;
};

function idToIdStr(id: number): string {
  return id.toString().padStart(4, "0");
}

export { Word, idToIdStr };
export type { WordCSV };
