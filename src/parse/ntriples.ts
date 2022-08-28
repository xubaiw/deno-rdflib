import {
  charWhere,
  createLanguage,
  either,
  hex,
  many,
  map,
  mapJoin,
  oneOf,
  optional,
  Parser,
  regex,
  repeat,
  seq,
  str,
  surrounded,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
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
  EOL: Parser<string>;
  IRIREF: Parser<NamedNode>;
  STRING_LITERAL_QUOTE: Parser<string>;
  BLANK_NODE_LABEL: Parser<BlankNode>;
  UCHAR: Parser<string>;
  ECHAR: Parser<string>;
  PN_CHARS_BASE: Parser<string>;
  PN_CHARS_U: Parser<string>;
  PN_CHARS: Parser<string>;
  HEX: Parser<string>;
};

/** The NTriples language parsers */
const ntripleLanguage = createLanguage<NTriplesLanguage>({
  ntriplesDoc: S => map(
  seq(
    optional(S.triple),
    many(
      seq(
        S.EOL,
        S.triple,
      ),
    ),
    optional(S.EOL),
  ),
  ([a, b]) => {
    const result = [];
    if (a) {
      result.push(a);
    }
    for (const v of b) {
      result.push(v[1]);
    }
    return result;
  },
),
  triple: S => map(
  seq(
    many(str(" ")),
    S.subject,
    many(str(" ")),
    S.predicate,
    many(str(" ")),
    S.object,
    many(str(" ")),
    str(`.`),
  ),
  ([, s, , p, , o]) => F.quad(s, p, o, F.defaultGraph()),
),
  subject: S => either(
  S.IRIREF,
  S.BLANK_NODE_LABEL,
),
  predicate: S => S.IRIREF,
  object: S => either(
  S.IRIREF,
  either(
    S.BLANK_NODE_LABEL,
    S.literal,
  ),
),
  literal: S => map(
  seq(
    S.STRING_LITERAL_QUOTE,
    optional(
      either(
        map(seq(str(`^^`), S.IRIREF), ([, iri]) => iri),
        S.LANGTAG,
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
  EOL: () => regex(/[\u000D\u000A]+/, `expect eol`),
  IRIREF: (S) =>
    map(
      surrounded(
        str(`<`),
        mapJoin(
          many(
            either(
              regex(
                /[^\u0000-\u0020<>"{}|^`\\]/,
                'expect [^#x00-#x20<>"{}|^`\\]',
              ),
              S.UCHAR,
            ),
          ),
        ),
        str(`>`),
      ),
      (iri) => F.namedNode(iri),
    ),
  STRING_LITERAL_QUOTE: S =>
    surrounded(
      str(`"`),
      mapJoin(
        many(
          oneOf(
            regex(/[^\u0022\u005C\u000A\u000D]/, "expect [^#x22#x5c#xa#xd]"),
            S.ECHAR,
            S.UCHAR,
          ),
        ),
      ),
      str(`"`),
    ),
  BLANK_NODE_LABEL: S => map(
  seq(
    str(`_:`),
    either(S.PN_CHARS_U, regex(/[0-9]/, `expect [0-9]`)),
    optional(seq(
      mapJoin(many(either(S.PN_CHARS, str(`.`)))),
      S.PN_CHARS,
    )),
  ),
  ([, a, b]) => F.blankNode(a + b ?? ""),
),
  UCHAR: () =>
    either(
      mapJoin(
        seq(
          str(`\\u`),
          mapJoin(repeat(4, hex())),
        ),
      ),
      mapJoin(
        seq(
          str(`\\U`),
          mapJoin(repeat(8, hex())),
        ),
      ),
    ),
  ECHAR: () =>
    mapJoin(
      seq(
        str(`\\`),
        regex(/[tbnrf"'\\]/, `expect [tbnrf"'\\]`),
      ),
    ),
  PN_CHARS_BASE: () =>
    charWhere(
      (c) =>
        65 <= c && c <= 90 ||
        97 <= c && c <= 122 ||
        0xC0 <= c && c <= 0xD6 ||
        0xD8 <= c && c <= 0xF6 ||
        0xF8 <= c && c <= 0x02FF ||
        0x370 <= c && c <= 0x37D ||
        0x37F <= c && c <= 0x1FFF ||
        0x200C <= c && c <= 0x200D ||
        0x2070 <= c && c <= 0x218F ||
        0x2C00 <= c && c <= 0x2FEF ||
        0x3001 <= c && c <= 0xD7FF ||
        0xF900 <= c && c <= 0xFDCF ||
        0xFDF0 <= c && c <= 0xFFFD ||
        0x10000 <= c && c <= 0xEFFFF,
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
      str(`-`),
      regex(/[0-9]/, `expect [0-9]`),
      str(`\u00B7`),
      regex(/[\u0300-\u036F]/, `expect [#x0300-#x036F]`),
      regex(/[\u203F-\u2040]/, `expect [#x203F-#x2040]`),
    ),
  HEX: () => hex(),
});

export default ntripleLanguage.ntriplesDoc;
