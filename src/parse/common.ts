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
  seq,
  skip1,
  skipMany,
  skipMany1,
  str,
  success,
  surrounded,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import {
  BlankNode,
  Literal,
  NamedNode,
  QuadObject,
  QuadPredicate,
  QuadSubject,
} from "../model.ts";
import {
  charInRange,
  charNotInRange,
  factory as F,
  isValidIRI,
} from "./utils.ts";

export type Language = {
  subject: Parser<QuadSubject>;
  predicate: Parser<QuadPredicate>;
  object: Parser<QuadObject>;
  literal: Parser<Literal>;
  COMMENT: Parser<null>;
  IRIREF: Parser<NamedNode>;
  LANGTAG: Parser<string>;
  STRING_LITERAL_QUOTE: Parser<string>;
  WHITESPACES: Parser<null>;
  HEX: Parser<string>;
  UCHAR: Parser<string>;
  ECHAR: Parser<string>;
  EOL: Parser<null>;
  BLANK_NODE_LABEL: Parser<BlankNode>;
  PN_CHARS_BASE: Parser<string>;
  PN_CHARS_U: Parser<string>;
  PN_CHARS: Parser<string>;
};

export const language = createLanguage<Language>({
  subject: (L) =>
    either(
      L.IRIREF,
      L.BLANK_NODE_LABEL,
    ),
  predicate: (L) => L.IRIREF,
  object: (S) =>
    either(
      S.IRIREF,
      either(
        S.BLANK_NODE_LABEL,
        S.literal,
      ),
    ),
  literal: (L) =>
    map(
      seq(
        L.STRING_LITERAL_QUOTE,
        optional(
          either(
            L.LANGTAG,
            map(seq(str(`^^`), L.IRIREF), ([, iri]) => iri),
          ),
        ),
      ),
      ([value, opt]) => {
        return F.literal(value, opt ?? undefined);
      },
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
  PN_CHARS_U: (L) =>
    oneOf(
      L.PN_CHARS_BASE,
      str(`_`),
      str(`:`),
    ),
  PN_CHARS: (L) =>
    oneOf(
      L.PN_CHARS_U,
      charInRange("-", ["0", "9"], 0xB7, [0x300, 0x36F], [0x203F, 0x2040]),
    ),
  BLANK_NODE_LABEL: (L) => {
    return (ctx) => {
      const result = seq(
        str(`_:`),
        either(L.PN_CHARS_U, charInRange(["0", "9"])),
        optional(
          mapJoin(many(either(L.PN_CHARS, str(`.`)))),
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
  HEX: () => charInRange(["0", "9"], ["A", "F"], ["a", "f"]),
  WHITESPACES: () => skipMany(charInRange(0x9, 0x20)),
  COMMENT: () => skip1(regex(/#.*/, `expect comment `)),
  EOL: () => skipMany1(charInRange(0xD, 0xA)),
  UCHAR: (L) =>
    either(
      mapJoin(
        seq(
          str(`\\u`),
          mapJoin(repeat(4, L.HEX)),
        ),
      ),
      mapJoin(
        seq(
          str(`\\U`),
          mapJoin(repeat(8, L.HEX)),
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
  STRING_LITERAL_QUOTE: (L) =>
    surrounded(
      str(`"`),
      mapJoin(
        many(
          oneOf(
            charNotInRange(0x22, 0x5C, 0xA, 0xD),
            L.ECHAR,
            L.UCHAR,
          ),
        ),
      ),
      str(`"`),
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
  IRIREF: (L) => {
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
              L.UCHAR,
            ),
          ),
        ),
        str(`>`),
      )(ctx);
      if (!result.success) return result;
      const iri = result.value;
      if (isValidIRI(iri)) {
        return success(result.ctx, F.namedNode(iri));
      } else {
        return failure(ctx, `"${iri}" is not a valid absolute iri`);
      }
    };
  },
});
