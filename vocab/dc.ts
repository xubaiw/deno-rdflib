/**
 * @file rdf vocabulary
 */

import { NamedNode } from "../model.ts";

function dc(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://purl.org/dc/elements/1.1/" + name,
  };
}

export default {
  "contributor": dc("contributor"),
  "coverage": dc("coverage"),
  "creator": dc("creator"),
  "date": dc("date"),
  "description": dc("description"),
  "format": dc("format"),
  "identifier": dc("identifier"),
  "language": dc("language"),
  "publisher": dc("publisher"),
  "relation": dc("relation"),
  "rights": dc("rights"),
  "source": dc("source"),
  "subject": dc("subject"),
  "title": dc("title"),
  "type": dc("type"),
};
