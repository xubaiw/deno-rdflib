import {
  createLanguage,
  either,
  map,
  optional,
  Parser,
  Result,
  sepBy,
  seq,
  str,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import { parse } from "./utils.ts";
import { ntripleLanguage as NT } from "./ntriples.ts";
import {
  DataFactory,
  Quad,
  QuadGraph,
} from "../model.ts";

/** The data factory */
const F = new DataFactory();

type NQuadsLanguage = {
  nquadsDoc: Parser<Quad[]>;
  quad: Parser<Quad>;
  graph: Parser<QuadGraph>;
};

export const nquadsLanguage = createLanguage<NQuadsLanguage>({
  nquadsDoc: (NQ) =>
    map(
      seq(
        optional(NT.EOL),
        sepBy(
          seq(
            NT.WHITESPACES,
            optional(NQ.quad),
            NT.WHITESPACES,
            optional(NT.COMMENT),
            NT.WHITESPACES,
          ),
          NT.EOL,
        ),
        optional(NT.EOL),
      ),
      ([, arr]) => {
        const quads = [];
        for (const x of arr) {
          if (!x) continue;
          if (!x[1]) continue;
          quads.push(x[1]);
        }
        return [];
      },
    ),
  quad: (NQ) =>
    map(
      seq(
        NT.subject,
        NT.WHITESPACES,
        NT.predicate,
        NT.WHITESPACES,
        NT.object,
        NT.WHITESPACES,
        NQ.graph,
        NT.WHITESPACES,
        str(`.`),
      ),
      ([s, , p, , o, , g]) => F.quad(s, p, o, g),
    ),
  graph: () =>
    map(
      optional(
        either(
          NT.IRIREF,
          NT.BLANK_NODE_LABEL
        )
      ),
      (iri) => {
        if (!iri) return F.defaultGraph();
        return iri;
      },
    ),
});


export default function (text: string): Result<Quad[]> {
  return parse(nquadsLanguage.nquadsDoc, text);
}
