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
import { parse, factory as F } from "./utils.ts";
import { language as CM } from "./common.ts";
import { Quad, QuadGraph } from "../model.ts";

export type Language = {
  nquadsDoc: Parser<Quad[]>;
  quad: Parser<Quad>;
  graph: Parser<QuadGraph>;
};

export const language = createLanguage<Language>({
  nquadsDoc: (L) =>
    map(
      seq(
        optional(CM.EOL),
        sepBy(
          seq(
            CM.WHITESPACES,
            optional(L.quad),
            CM.WHITESPACES,
            optional(CM.COMMENT),
            CM.WHITESPACES,
          ),
          CM.EOL,
        ),
        optional(CM.EOL),
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
  quad: (L) =>
    map(
      seq(
        CM.subject,
        CM.WHITESPACES,
        CM.predicate,
        CM.WHITESPACES,
        CM.object,
        CM.WHITESPACES,
        L.graph,
        CM.WHITESPACES,
        str(`.`),
      ),
      ([s, , p, , o, , g]) => F.quad(s, p, o, g),
    ),
  graph: () =>
    map(
      optional(
        either(
          CM.IRIREF,
          CM.BLANK_NODE_LABEL,
        ),
      ),
      (iri) => {
        if (!iri) return F.defaultGraph();
        return iri;
      },
    ),
});

export default function (text: string): Result<Quad[]> {
  return parse(language.nquadsDoc, text);
}
