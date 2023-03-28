/**
 * @file rdf vocabulary
 */

import { NamedNode } from "../types.ts";

export default function rdf(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" + name,
  };
}

export const ALT = rdf("Alt");
export const BAG = rdf("Bag");
export const FIRST = rdf("first");
export const HTML = rdf("HTML");
export const LANG_STRING = rdf("langString");
export const LIST = rdf("List");
export const NIL = rdf("nil");
export const OBJECT = rdf("object");
export const PREDICATE = rdf("predicate");
export const PROPERTY = rdf("Property");
export const REST = rdf("rest");
export const SEQ = rdf("Seq");
export const STATEMENT = rdf("Statement");
export const SUBJECT = rdf("subject");
export const TYPE = rdf("type");
export const VALUE = rdf("value");
export const XML_LITERAL = rdf("XMLLiteral");
