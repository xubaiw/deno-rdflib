import {
  Context,
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
  sepBy1,
  seq,
  skip1,
  str,
  success,
  surrounded,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import { charInRange, charNotInRange, factory as F, parse } from "./utils.ts";
import { language as CM } from "./common.ts";
import {
  BlankNode,
  Literal,
  NamedNode,
  Quad,
  QuadObject,
  QuadPredicate,
  QuadSubject,
} from "../model.ts";

type BaseDef = {
  baseIRI: string;
};
type PrefixDef = {
  prefixName: string;
  prefixIRI: string;
};
type PredicateObjects = {
  predicate: QuadPredicate;
  objects: TTLObject[];
};
type BlankNodePropertyList = {
  blankNode: BlankNode;
  propertyList: TTLTriple[];
};
type PrefixedName = {
  prefix: string;
  local: string;
};
type TTLCollection = TTLObject[];
type TTLIRI = NamedNode | PrefixedName;
type TTLSubject = TTLIRI | BlankNode | TTLCollection;
type TTLObject =
  | TTLIRI
  | BlankNode
  | TTLCollection
  | Literal
  | BlankNodePropertyList;
type TTLTriple = {
  subject: TTLSubject;
  predicate: QuadPredicate;
  object: TTLObject;
};
type TTLDirective = PrefixDef | BaseDef;
type TTLStatement = TTLDirective | TTLTriple[];

export type Language = {
  turtleDoc: Parser<Quad[]>;
  statement: Parser<TTLStatement>;
  directive: Parser<TTLDirective>;
  prefixID: Parser<PrefixDef>;
  base: Parser<BaseDef>;
  sparqlBase: Parser<BaseDef>;
  sparqlPrefix: Parser<PrefixDef>;
  triples: Parser<TTLTriple[]>;
  predicateObjectList: Parser<PredicateObjects[]>;
  objectList: Parser<TTLObject[]>;
  verb: Parser<QuadPredicate>;
  subject: Parser<TTLSubject>;
  predicate: Parser<QuadPredicate>;
  object: Parser<TTLObject>;
  literal: Parser<Literal>;
  blankNodePropertyList: Parser<BlankNodePropertyList>;
  collection: Parser<TTLCollection>;
  NumericLiteral: Parser<Literal>;
  RDFLiteral: Parser<Literal>;
  BooleanLiteral: Parser<Literal>;
  String: Parser<string>;
  iri: Parser<NamedNode | PrefixedName>;
  PrefixedName: Parser<PrefixedName>;
  BlankNode: Parser<BlankNode>;
  PNAME_NS: Parser<string>;
  PNAME_LN: Parser<[string, string]>;
  INTEGER: Parser<Literal>;
  DECIMAL: Parser<Literal>;
  DOUBLE: Parser<Literal>;
  EXPONENT: Parser<string>;
  STRING_LITERAL_SINGLE_QUOTE: Parser<string>;
  STRING_LITERAL_LONG_SINGLE_QUOTE: Parser<string>;
  STRING_LITERAL_LONG_QUOTE: Parser<string>;
  WS: Parser<null>;
  ANON: Parser<BlankNode>;
  PN_PREFIX: Parser<string>;
  PN_LOCAL: Parser<string>;
  PLX: Parser<string>;
  PERCENT: Parser<string>;
  PN_LOCAL_ESC: Parser<string>;
};

function triplesToQuads(
  triples: TTLTriple[],
  prefixes: Map<string, string>,
  _base: string | null,
  ctx: Context,
  newCtx: Context,
): Result<Quad[]> {
  const quads: Quad[] = [];
  for (const t of triples) {
    const result = extendTriple(t);
    if (typeof result == "string") return failure(ctx, result);
  }
  return success(newCtx, quads);
  function extendTriple(t: TTLTriple): void | string {
    const { subject, predicate, object } = t;
    const s = extendSubject(subject);
    const o = extendObject(object);
    if (typeof s == "string") return s;
    if (typeof o == "string") return o;
    quads.push(F.quad(
      s,
      predicate,
      o,
      F.defaultGraph(),
    ));
  }
  function extendCollection(c: TTLCollection): BlankNode | string {
    if (c.length == 0) return F.blankNode();
    const blanks = c.map(() => F.blankNode());
    for (let i = 0; i < c.length; i++) {
      const o = extendObject(c[i]);
      if (typeof o == "string") return o;
      // TODO: add collection
      quads.push(F.quad(
        blanks[i],
        F.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#first"),
        o,
        F.defaultGraph(),
      ));
      quads.push(F.quad(
        blanks[i],
        F.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"),
        i == c.length - 1
          ? F.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#nil")
          : blanks[i + 1],
        F.defaultGraph(),
      ));
    }
    return blanks[0];
  }
  function extendObject(o: TTLObject): QuadObject | string {
    if (Array.isArray(o)) return extendCollection(o);
    if ("prefix" in o) return extendPrefixedName(o);
    if ('propertyList' in o) {
      o.propertyList.forEach(t => extendTriple(t));
      return o.blankNode;
    }
    return o;
  }
  function extendSubject(s: TTLSubject): QuadSubject | string {
    if (Array.isArray(s)) return extendCollection(s);
    if ("prefix" in s) return extendPrefixedName(s);
    return s;
  }
  function extendPrefixedName(s: PrefixedName): NamedNode | string {
    const ns = prefixes.get(s.prefix);
    if (!ns) return `prefix ${s.prefix} not found`;
    return F.namedNode(ns + s.local);
  }
}

export const language = (_providedBase?: string) => {
  return createLanguage<Language>({
    turtleDoc: (L) => {
      return (ctx) => {
        const result = many(L.statement)(ctx);
        if (!result.success) return result;
        const ss = result.value;
        const triples: TTLTriple[] = [];
        const prefixMap = new Map<string, string>();
        let base = null;
        for (const s of ss) {
          if ("baseIRI" in s) {
            if (base) {
              return failure(ctx, "there can be only one base definition");
            }
            base = s.baseIRI;
          } else if ("prefixIRI" in s) {
            if (prefixMap.has(s.prefixName)) {
              return failure(ctx, `duplicate prefix name ${s.prefixName}`);
            }
          } else {
            s.forEach((x) => triples.push(x));
          }
        }
        return triplesToQuads(triples, prefixMap, base, ctx, result.ctx);
      };
    },
    statement: (L) =>
      map(
        either(
          L.directive,
          seq(L.triples, str(".")),
        ),
        (x) => Array.isArray(x) ? x[0] : x,
      ),
    directive: (L) =>
      either(
        L.prefixID,
        either(
          L.base,
          either(
            L.sparqlPrefix,
            L.sparqlBase,
          ),
        ),
      ),
    prefixID: (L) =>
      map(
        seq(
          str("PREFIX"),
          L.PNAME_NS,
          CM.IRIREF,
          str("."),
        ),
        ([, ns, iri]) => {
          return { prefixName: ns, prefixIRI: iri.value };
        },
      ),
    base: () =>
      map(
        seq(
          str("@base"),
          CM.IRIREF,
          str("."),
        ),
        ([, iri]) => {
          return { baseIRI: iri.value };
        },
      ),
    sparqlBase: () =>
      map(
        seq(
          str("BASE"),
          CM.IRIREF,
        ),
        ([, iri]) => {
          return { baseIRI: iri.value };
        },
      ),
    sparqlPrefix: (L) =>
      map(
        seq(
          str("PREFIX"),
          L.PNAME_NS,
          CM.IRIREF,
        ),
        ([, ns, iri]) => {
          return { prefixName: ns, prefixIRI: iri.value };
        },
      ),
    triples: (L) =>
      map(
        either(
          seq(L.subject, L.predicateObjectList),
          seq(
            L.blankNodePropertyList,
            optional(L.predicateObjectList),
          ),
        ),
        ([s, posl]) => {
          const triples = [];
          const subject = "propertyList" in s ? s.blankNode : s;
          const pl = "propertyList" in s ? s.propertyList : null;
          if (posl) {
            for (const pos of posl) {
              for (const o of pos.objects) {
                triples.push({
                  subject,
                  predicate: pos.predicate,
                  object: o,
                });
              }
            }
          }
          if (pl) {
            pl.forEach((t) => triples.push(t));
          }
          return triples;
        },
      ),
    predicateObjectList: (L) =>
      map(
        sepBy1(
          seq(
            L.verb,
            L.objectList,
          ),
          str(";"),
        ),
        (l) => {
          const res = [];
          for (const po of l) {
            if (typeof po == "string") continue;
            res.push({
              predicate: po[0],
              objects: po[1],
            });
          }
          return res;
        },
      ),
    objectList: (L) =>
      map(
        sepBy1(
          L.object,
          str(","),
        ),
        (l) => {
          const res = [];
          for (const o of l) {
            if (typeof o == "string") continue;
            res.push(o);
          }
          return res;
        },
      ),
    verb: (L) =>
      map(
        either(L.predicate, str("a")),
        (v) =>
          typeof v == "string"
            ? F.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
            : v,
      ),
    subject: (L) =>
      either(
        L.iri,
        either(
          L.BlankNode,
          L.collection,
        ),
      ),
    predicate: () => CM.predicate,
    object: (L) =>
      either(
        L.iri,
        either(
          L.BlankNode,
          either(
            L.collection,
            either(
              L.blankNodePropertyList,
              L.literal,
            ),
          ),
        ),
      ),
    literal: (L) =>
      oneOf(
        L.RDFLiteral,
        L.BooleanLiteral,
        L.NumericLiteral,
      ),
    blankNodePropertyList: (L) =>
      map(
        surrounded(
          str("["),
          L.predicateObjectList,
          str("]"),
        ),
        (pol) => {
          const blank = F.blankNode();
          const triples = [];
          for (const po of pol) {
            for (const o of po.objects) {
              triples.push({
                subject: blank,
                predicate: po.predicate,
                object: o,
              });
            }
          }
          return {
            blankNode: blank,
            propertyList: triples,
          };
        },
      ),
    collection: (L) =>
      surrounded(
        str("("),
        many(L.object),
        str(")"),
      ),
    NumericLiteral: (L) =>
      oneOf(
        L.INTEGER,
        L.DECIMAL,
        L.DOUBLE,
      ),
    RDFLiteral: () => CM.literal,
    BooleanLiteral: () =>
      map(
        either(str("true"), str("false")),
        (s) =>
          F.literal(s, F.namedNode("http://www.w3.org/2001/XMLSchema#boolean")),
      ),
    String: (L) =>
      oneOf(
        L.STRING_LITERAL_LONG_QUOTE,
        L.STRING_LITERAL_LONG_SINGLE_QUOTE,
        L.STRING_LITERAL_SINGLE_QUOTE,
        CM.STRING_LITERAL_QUOTE,
      ),
    iri: (L) =>
      either(
        CM.IRIREF,
        L.PrefixedName,
      ),
    PrefixedName: (L) =>
      map(
        either(
          L.PNAME_LN,
          L.PNAME_NS,
        ),
        (v) =>
          typeof v == "string"
            ? { prefix: v, local: "" }
            : { prefix: v[0], local: v[1] },
      ),
    BlankNode: (L) =>
      either(
        CM.BLANK_NODE_LABEL,
        L.ANON,
      ),
    PNAME_NS: (L) =>
      map(
        seq(
          optional(L.PNAME_NS),
          str(":"),
        ),
        ([s]) => s ?? "",
      ),
    PNAME_LN: (L) =>
      seq(
        L.PNAME_NS,
        L.PN_LOCAL,
      ),
    INTEGER: () =>
      map(
        regex(/[+-]?[0-9]+/, "expect /[+-]?[0-9]+/"),
        (s) =>
          F.literal(s, F.namedNode("http://www.w3.org/2001/XMLSchema#integer")),
      ),
    DECIMAL: () =>
      map(
        regex(/[+-]?[0-9]*\.[0-9]+/, "expect /[+-]?[0-9]*.[0-9]+/"),
        (s) =>
          F.literal(s, F.namedNode("http://www.w3.org/2001/XMLSchema#decimal")),
      ),
    DOUBLE: (L) =>
      map(
        mapJoin(seq(
          regex(/[+-]?/, "expect /[+-]?/"),
          oneOf(
            mapJoin(seq(
              regex(/[0-9]+\.[0-9]*/, "expect /[0-9]+.[0-9]*/"),
              L.EXPONENT,
            )),
            mapJoin(seq(
              regex(/\.[0-9]+/, "expect /.[0-9]+/"),
              L.EXPONENT,
            )),
            mapJoin(seq(
              regex(/[0-9]+/, "expect /[0-9]+/"),
              L.EXPONENT,
            )),
          ),
        )),
        (s) =>
          F.literal(s, F.namedNode("http://www.w3.org/2001/XMLSchema#double")),
      ),
    EXPONENT: () => regex(/[eE][+-]?[0-9]+/, "expect /[eE][+-]?[0-9]+/"),
    STRING_LITERAL_SINGLE_QUOTE: () =>
      surrounded(
        str(`'`),
        mapJoin(
          many(
            oneOf(
              charNotInRange(0x22, 0x5C, 0xA, 0xD),
              CM.ECHAR,
              CM.UCHAR,
            ),
          ),
        ),
        str(`'`),
      ),
    STRING_LITERAL_LONG_SINGLE_QUOTE: () =>
      surrounded(
        str(`'''`),
        mapJoin(
          many(
            map(
              seq(
                optional(charInRange(`'`, `''`)),
                oneOf(
                  charNotInRange(`'`, `\\`),
                  CM.ECHAR,
                  CM.UCHAR,
                ),
              ),
              ([fst, snd]) => fst ?? "" + snd,
            ),
          ),
        ),
        str(`'''`),
      ),
    STRING_LITERAL_LONG_QUOTE: () =>
      surrounded(
        str(`"""`),
        mapJoin(
          many(
            map(
              seq(
                optional(charInRange(`"`, `""`)),
                oneOf(
                  charNotInRange(`'`, `\\`),
                  CM.ECHAR,
                  CM.UCHAR,
                ),
              ),
              ([fst, snd]) => fst ?? "" + snd,
            ),
          ),
        ),
        str(`"""`),
      ),
    WS: () => skip1(charInRange(0x20, 0x9, 0xD, 0xA)),
    ANON: (L) =>
      map(
        surrounded(str("["), many(L.ANON), str("]")),
        () => F.blankNode(),
      ),
    PLX: (L) => either(L.PERCENT, L.PN_LOCAL_ESC),
    PN_PREFIX: () => {
      return (ctx) => {
        const result = seq(
          CM.PN_CHARS_BASE,
          optional(
            mapJoin(many(either(CM.PN_CHARS, str(".")))),
          ),
        )(ctx);
        if (!result.success) return result;
        const [fst, snd] = result.value;
        if (!snd) return success(result.ctx, fst);
        if (snd.endsWith(".")) {
          return success({
            ...result.ctx,
            index: result.ctx.index - 1,
          }, fst + snd.slice(0, -1));
        } else {
          return success(result.ctx, fst + snd);
        }
      };
    },
    PN_LOCAL: (L) => {
      return (ctx) => {
        const result = seq(
          oneOf(CM.PN_CHARS_U, charInRange(":", ["0", "9"]), L.PLX),
          optional(
            mapJoin(many(oneOf(CM.PN_CHARS, charInRange(".", ":"), L.PLX))),
          ),
        )(ctx);
        if (!result.success) return result;
        const [fst, snd] = result.value;
        if (!snd) return success(result.ctx, fst);
        if (snd.endsWith(".")) {
          return success({
            ...result.ctx,
            index: result.ctx.index - 1,
          }, fst + snd.slice(0, -1));
        } else {
          return success(result.ctx, fst + snd);
        }
      };
    },
    PERCENT: () =>
      mapJoin(
        seq(
          str(`%`),
          mapJoin(repeat(2, CM.HEX)),
        ),
      ),
    PN_LOCAL_ESC: () =>
      mapJoin(
        seq(
          str("\\"),
          charInRange(
            "_",
            "~",
            ".",
            "-",
            "!",
            "$",
            "'",
            "(",
            ")",
            "*",
            "+",
            ",",
            ";",
            "=",
            "/",
            "?",
            "#",
            "@",
            "%",
          ),
        ),
      ),
  });
};

export default function (base?: string): (text: string) => Result<Quad[]> {
  const p = language(base);
  return text => parse(p.turtleDoc, text);
}
