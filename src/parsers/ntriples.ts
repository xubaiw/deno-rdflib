import {
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
  charWhere,
} from "combine";
import { BlankNode, DataFactory, Literal, NamedNode, Quad } from "../model.ts";

const f = new DataFactory();

const uChar: Parser<string> = either(
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
);

const eChar: Parser<string> = mapJoin(
  seq(
    str(`\\`),
    regex(/[tbnrf"'\\]/, `expect [tbnrf"'\\]`),
  ),
);

const iriRef: Parser<NamedNode> = map(
  surrounded(
    str(`<`),
    mapJoin(
      many(
        either(
          regex(/[^\u0000-\u0020<>"{}|^`\\]/, 'expect [^#x00-#x20<>"{}|^`\\]'),
          uChar,
        ),
      ),
    ),
    str(`>`),
  ),
  (iri) => f.namedNode(iri)
);

const langTag: Parser<string> = map(
  seq(
    str(`@`),
    regex(/[a-zA-Z]+(-[a-zA-Z0-9]+)*/, "expect [a-zA-Z]+ ('-' [a-zA-Z0-9]+)*"),
  ),
  ([, x]) => x,
);

const eol: Parser<string> = regex(/[\u000D\u000A]+/, `expect eol`);

const stringLiteralQuote: Parser<string> = surrounded(
  str(`"`),
  mapJoin(
    many(
      oneOf(
        regex(/[^\u0022\u005C\u000A\u000D]/, "expect [^#x22#x5c#xa#xd]"),
        eChar,
        uChar,
      ),
    ),
  ),
  str(`"`),
);

const pnCharsBase: Parser<string> = charWhere(
  c => 
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
    0x10000 <= c && c <= 0xEFFFF
);

const pnCharsU: Parser<string> = oneOf(
  pnCharsBase,
  str(`_`),
  str(`:`),
);

const pnChars: Parser<string> = oneOf(
  pnCharsU,
  str(`-`),
  regex(/[0-9]/, `expect [0-9]`),
  str(`\u00B7`),
  regex(/[\u0300-\u036F]/, `expect [#x0300-#x036F]`),
  regex(/[\u203F-\u2040]/, `expect [#x203F-#x2040]`),
);

const blankNodeLabel: Parser<BlankNode> = map(
  seq(
    str(`_:`),
    either(pnCharsU, regex(/[0-9]/, `expect [0-9]`)),
    optional(seq(
      mapJoin(many(either(pnChars, str(`.`)))),
      pnChars,
    )),
  ),
  ([, a, b]) => f.blankNode(a + b ?? ""),
);

const literal: Parser<Literal> = map(
  seq(
    stringLiteralQuote,
    optional(
      either(
        map(seq(str(`^^`), iriRef), ([, iri]) => iri),
        langTag,
      ),
    ),
  ),
  ([value, opt]) => {
    return f.literal(value, opt ?? undefined);
  },
);

const subject: Parser<NamedNode | BlankNode> = either(
  iriRef,
  blankNodeLabel,
);

const predicate: Parser<NamedNode> = iriRef;

const object: Parser<NamedNode | Literal | BlankNode> = either(
  iriRef,
  either(
    blankNodeLabel,
    literal,
  ),
);

const triple: Parser<Quad> = map(
  seq(
    many(str(" ")),
    subject,
    many(str(" ")),
    predicate,
    many(str(" ")),
    object,
    many(str(" ")),
    str(`.`),
  ),
  ([,s,,p,,o,]) => f.quad(s, p, o, f.defaultGraph()),
);

const ntriplesDoc: Parser<Quad[]> = map(
  seq(
    optional(triple),
    many(
      seq(
        eol,
        triple,
      ),
    ),
    optional(eol),
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
);

export default ntriplesDoc;
