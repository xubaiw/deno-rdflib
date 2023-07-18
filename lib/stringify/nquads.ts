import { equal, Quad, Term } from "../model.ts";
import xsd from "../vocabs/xsd.ts";

export const stringify = (quads: Iterable<Quad>): string => {
  let str = "";
  for (const quad of quads) {
    const { subject, predicate, object, graph } = quad;
    const [s, p, o, g] = [subject, predicate, object, graph].map(stringifyTerm);
    str += `${s} ${p} ${o} ${g} .\n`;
  }
  return str;
};

export const stringifyTerm = (term: Term | null): string => {
  // DefaultGraph
  if (term == null) return "";
  // NamedNode
  if ("iri" in term) return `<${term.iri}>`;
  // BlankNode
  if ("id" in term) return `_:${term.id}`;
  // Literal
  if ("lexical" in term) {
    const lexical = `"${term.lexical}"`;
    if (typeof term.langOrDatatype == "string") {
      return lexical + `@${term.langOrDatatype}`;
    } else if (equal(term.langOrDatatype, xsd.string)) return lexical;
    else return lexical + `^^${stringifyTerm(term.langOrDatatype)}`;
  }
  // Triple
  const { subject, predicate, object } = term;
  const [s, p, o] = [subject, predicate, object].map(stringifyTerm);
  return `<< ${s} ${p} ${o} >>`;
};

