import {
  createLanguage,
  either,
  failure,
  many,
  map,
  mapJoin,
  oneOf,
  optional,
  Parser,
  regex,
  repeat,
  Result,
  sepBy,
  seq,
  skip1,
  skipMany,
  skipMany1,
  str,
  success,
  surrounded,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import { charInRange, charNotInRange, parse } from "./utils.ts";
import {
  BlankNode,
  DataFactory,
  Literal,
  NamedNode,
  Quad,
  QuadObject,
  QuadPredicate,
  QuadSubject,
} from "../model.ts";

/** The data factory */
const F = new DataFactory();

/* The NTriples language type definition */
type NTriplesLanguage = {
  ntriplesDoc: Parser<Quad[]>;
  triple: Parser<Quad>;
  subject: Parser<QuadSubject>;
  predicate: Parser<QuadPredicate>;
  object: Parser<QuadObject>;
  literal: Parser<Literal>;
  LANGTAG: Parser<string>;
  EOL: Parser<null>;
  IRIREF: Parser<NamedNode>;
  STRING_LITERAL_QUOTE: Parser<string>;
  BLANK_NODE_LABEL: Parser<BlankNode>;
  UCHAR: Parser<string>;
  ECHAR: Parser<string>;
  PN_CHARS_BASE: Parser<string>;
  PN_CHARS_U: Parser<string>;
  PN_CHARS: Parser<string>;
  HEX: Parser<string>;
  WHITESPACES: Parser<null>;
  COMMENT: Parser<null>;
};

/** The NTriples language parsers */
export const ntripleLanguage = createLanguage<NTriplesLanguage>({
  ntriplesDoc: (S) =>
    map(
      seq(
        optional(S.EOL),
        sepBy(
          seq(
            S.WHITESPACES,
            optional(S.triple),
            S.WHITESPACES,
            optional(S.COMMENT),
            S.WHITESPACES,
          ),
          S.EOL,
        ),
        optional(S.EOL),
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
  triple: (S) =>
    map(
      seq(
        S.subject,
        S.WHITESPACES,
        S.predicate,
        S.WHITESPACES,
        S.object,
        S.WHITESPACES,
        str(`.`),
      ),
      ([s, , p, , o]) => F.quad(s, p, o, F.defaultGraph()),
    ),
  subject: (S) =>
    either(
      S.IRIREF,
      S.BLANK_NODE_LABEL,
    ),
  predicate: (S) => S.IRIREF,
  object: (S) =>
    either(
      S.IRIREF,
      either(
        S.BLANK_NODE_LABEL,
        S.literal,
      ),
    ),
  literal: (S) =>
    map(
      seq(
        S.STRING_LITERAL_QUOTE,
        optional(
          either(
            S.LANGTAG,
            map(seq(str(`^^`), S.IRIREF), ([, iri]) => iri),
          ),
        ),
      ),
      ([value, opt]) => {
        return F.literal(value, opt ?? undefined);
      },
    ),
  LANGTAG: () =>
    map(
      seq(
        str(`@`),
        regex(
          /[a-zA-Z]+(-[a-zA-Z0-9]+)*/,
          "expect [a-zA-Z]+ ('-' [a-zA-Z0-9]+)*",
        ),
      ),
      ([, x]) => x,
    ),
  EOL: () => skipMany1(charInRange(0xD, 0xA)),
  IRIREF: (S) => {
    return (ctx) => {
      const result = surrounded(
        str(`<`),
        mapJoin(
          many(
            either(
              charNotInRange(
                [0x0, 0x20],
                `<`,
                `>`,
                `"`,
                `{`,
                `}`,
                `|`,
                `^`,
                "`",
                `\\`,
              ),
              S.UCHAR,
            ),
          ),
        ),
        str(`>`),
      )(ctx);
      if (!result.success) return result;
      const iri = result.value;
      // HACK: better iri detection
      try {
        new URL(iri);
        return success(result.ctx, F.namedNode(iri));
      } catch {
        return failure(ctx, `"${iri}" is not a valid absolute iri`);
      }
    };
  },

  STRING_LITERAL_QUOTE: (S) =>
    surrounded(
      str(`"`),
      mapJoin(
        many(
          oneOf(
            charNotInRange(0x22, 0x5C, 0xA, 0xD),
            S.ECHAR,
            S.UCHAR,
          ),
        ),
      ),
      str(`"`),
    ),
  BLANK_NODE_LABEL: (S) => {
    return (ctx) => {
      const result = seq(
        str(`_:`),
        either(S.PN_CHARS_U, charInRange(["0", "9"])),
        optional(
          mapJoin(many(either(S.PN_CHARS, str(`.`)))),
        ),
      )(ctx);
      if (!result.success) return result;
      const [, fst, snd] = result.value;
      if (!snd) return success(result.ctx, F.blankNode(fst));
      if (snd.endsWith(".")) {
        return success({
          ...result.ctx,
          index: result.ctx.index - 1,
        }, F.blankNode(fst + snd.slice(0, -1)));
      } else {
        return success(result.ctx, F.blankNode(fst + snd));
      }
    };
  },
  UCHAR: (S) =>
    either(
      mapJoin(
        seq(
          str(`\\u`),
          mapJoin(repeat(4, S.HEX)),
        ),
      ),
      mapJoin(
        seq(
          str(`\\U`),
          mapJoin(repeat(8, S.HEX)),
        ),
      ),
    ),
  ECHAR: () =>
    mapJoin(
      seq(
        str(`\\`),
        charInRange(`t`, `b`, `n`, `r`, `f`, `"`, `'`, `\\`),
      ),
    ),
  PN_CHARS_BASE: () =>
    charInRange(
      ["a", "z"],
      ["A", "Z"],
      [0xC0, 0xD6],
      [0xD8, 0xF6],
      [0xF8, 0x02FF],
      [0x370, 0x37D],
      [0x37F, 0x1FFF],
      [0x200C, 0x200D],
      [0x2070, 0x218F],
      [0x2C00, 0x2FEF],
      [0x3001, 0xD7FF],
      [0xF900, 0xFDCF],
      [0xFDF0, 0xFFFD],
      [0x10000, 0xEFFFF],
    ),
  PN_CHARS_U: (S) =>
    oneOf(
      S.PN_CHARS_BASE,
      str(`_`),
      str(`:`),
    ),
  PN_CHARS: (S) =>
    oneOf(
      S.PN_CHARS_U,
      charInRange("-", ["0", "9"], 0xB7, [0x300, 0x36F], [0x203F, 0x2040]),
    ),
  HEX: () => charInRange(["0", "9"], ["A", "F"], ["a", "f"]),
  WHITESPACES: () => skipMany(charInRange(0x9, 0x20)),
  COMMENT: () => skip1(regex(/#.*/, `expect comment `)),
});

export default function (text: string): Result<Quad[]> {
  return parse(ntripleLanguage.ntriplesDoc, text);
}
