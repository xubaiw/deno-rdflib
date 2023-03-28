/**
 * @file rdf vocabulary
 */

import { NamedNode } from "../types.ts";

export default function dc(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://purl.org/dc/elements/1.1/" + name,
  };
}

export const contributor = dc("contributor")
export const coverage = dc("coverage")
export const creator = dc("creator")
export const date = dc("date")
export const description = dc("description")
export const format = dc("format")
export const identifier = dc("identifier")
export const language = dc("language")
export const publisher = dc("publisher")
export const relation = dc("relation")
export const rights = dc("rights")
export const source = dc("source")
export const subject = dc("subject")
export const title = dc("title")
export const type = dc("type")
