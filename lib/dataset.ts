import sha1 from "https://deno.land/x/object_hash@2.0.3.1/mod.ts";
import { equal, Quad } from "./model.ts";

export type Dataset = {
  quads: Record<string, Quad>;
};

/** Create Instance of `Dataset` */
export const dataset = (quads: Iterable<Quad> = []): Dataset => {
  const record: Record<string, Quad> = {};
  for (const quad of quads) record[sha1(quad)] = quad;
  return { quads: record };
};

export const size = (d: Dataset) => d.quads.size;

export const add = (d: Dataset, quad: Quad) => d.quads[sha1(quad)] = quad;

export const remove = (d: Dataset, quad: Quad) => delete d.quads[sha1(quad)];

export const has = (d: Dataset, quad: Quad) => sha1(quad) in d.quads;

/** 
 * XXX: Need better impl with indexing
 */
export const match = (d: Dataset, p: Partial<Quad>) => {
  const quads = [];
  qLoop:
  for (const q of Object.values(d.quads)) {
    for (const key of ["subject", "predicate", "object", "graph"] as const) {
      if (p[key] !== undefined && !equal(q[key], p[key])) continue qLoop;
    }
    quads.push(q);
  }
};

export const iterate = (d: Dataset) => Object.values(d.quads);
