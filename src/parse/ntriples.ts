import {
  createLanguage,
  map,
  optional,
  Parser,
  Result,
  sepBy,
  seq,
  str,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import {  factory as F, parse } from "./utils.ts";
import { language as CM } from "./common.ts";
import {
  Quad,
} from "../model.ts";

/* The NTriples language type definition */
type Language = {
  ntriplesDoc: Parser<Quad[]>;
  triple: Parser<Quad>;
};

/** The NTriples language parsers */
export const language = createLanguage<Language>({
  ntriplesDoc: (L) =>
    map(
      seq(
        optional(CM.EOL),
        sepBy(
          seq(
            CM.WHITESPACES,
            optional(L.triple),
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
  triple: () =>
    map(
      seq(
        CM.subject,
        CM.WHITESPACES,
        CM.predicate,
        CM.WHITESPACES,
        CM.object,
        CM.WHITESPACES,
        str(`.`),
      ),
      ([s, , p, , o]) => F.quad(s, p, o, F.defaultGraph()),
    ),
});

export default function (text: string): Result<Quad[]> {
  return parse(language.ntriplesDoc, text);
}
