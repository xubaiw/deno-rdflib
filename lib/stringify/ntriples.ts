import { Quad, Triple } from "../model.ts";
import { stringifyTerm } from "./nquads.ts";

/** Note: `Quad`s are also valid `Triple`s */
export const stringify = (triples: Iterable<Triple | Quad>) => {
  let str = "";
  for (const triple of triples) {
    const { subject, predicate, object } = triple;
    const [s, p, o] = [subject, predicate, object].map(stringifyTerm);
    str += `${s} ${p} ${o} .\n`;
  }
  return str;
};
