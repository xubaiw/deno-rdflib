import { Database } from 'aloe';
import { Quad } from "./model.ts";

/** Store is just a database of quads */
export const Store = Database<Quad>;
