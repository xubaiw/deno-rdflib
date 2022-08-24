import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Quad } from "./model.ts";
import parse from "./parse/ntriples.ts";
import stringify from "./serialize/ntriples.ts";

/** Store is just a database of quads */
export class Store extends Database<Quad> {
  constructor(path?: string) {
    super(path);
  }
  async parse(text: string) {
    const parsed = parse({
      text,
      index: 0,
    });
    if (parsed.success) {
      await this.insertMany(parsed.value);
    }
  }
  async stringify(): Promise<string> {
    const quads = await this.findMany();
    return stringify(quads);
  }
}
