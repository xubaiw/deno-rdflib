import { Quad } from "./model.ts";

export type Dataset = {
  quads: Quad[];
};

/** Create Instance of `Dataset` */
export const dataset = (quads: Iterable<Quad> = []) => ({ quads });
