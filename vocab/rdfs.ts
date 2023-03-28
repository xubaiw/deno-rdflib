/**
 * @file rdfs vocabulary
 */

import { NamedNode } from "../types.ts";

export default function rdfs(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/2000/01/rdf-schema#" + name,
  };
}

export const Class = rdfs("Class");
export const comment = rdfs("comment");
export const Container = rdfs("Container");
export const ContainerMembershipProperty = rdfs("ContainerMembershipProperty");
export const Datatype = rdfs("Datatype");
export const domain = rdfs("domain");
export const isDefinedBy = rdfs("isDefinedBy");
export const label = rdfs("label");
export const Literal = rdfs("Literal");
export const member = rdfs("member");
export const range = rdfs("range");
export const Resource = rdfs("Resource");
export const seeAlso = rdfs("seeAlso");
export const subClassOf = rdfs("subClassOf");
export const subPropertyOF = rdfs("subPropertyOF");
