import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { Quad } from "./model.ts";

/** Store is just a database of quads */
export function useStore(path?: string): Database<Quad> {
  return new Database(path);
}
