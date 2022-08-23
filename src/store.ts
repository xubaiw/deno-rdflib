import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Quad } from "./model.ts";
import parser from "./parsers/ntriples.ts";

/** Store is just a database of quads */
export class Store extends Database<Quad> {
  constructor(path?: string) {
    super(path);
  }
  async parse(path: string) {
    const text = await Deno.readTextFile(path);
    const parsed = parser({
      text,
      index: 0,
    });
    if (parsed.success) {
      await this.insertMany(parsed.value);
    }
  }
}
