/**
 * @file rdf vocabulary
 */

import { NamedNode } from "../model.ts";

function rdf(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#" + name,
  };
}

export default {
  "Alt": rdf("Alt"),
  "Bag": rdf("Bag"),
  "first": rdf("first"),
  "HTML": rdf("HTML"),
  "langString": rdf("langString"),
  "List": rdf("List"),
  "nil": rdf("nil"),
  "object": rdf("object"),
  "predicate": rdf("predicate"),
  "Property": rdf("Property"),
  "rest": rdf("rest"),
  "Seq": rdf("Seq"),
  "Statement": rdf("Statement"),
  "subject": rdf("subject"),
  "type": rdf("type"),
  "value": rdf("value"),
  "XMLLiteral": rdf("XMLLiteral"),
};
