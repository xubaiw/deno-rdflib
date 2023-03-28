/**
 * @file rdfs vocabulary
 */

import { NamedNode } from "../model.ts";

function rdfs(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/2000/01/rdf-schema#" + name,
  };
}

export default {
  "Class": rdfs("Class"),
  "comment": rdfs("comment"),
  "Container": rdfs("Container"),
  "ContainerMembershipProperty": rdfs("ContainerMembershipProperty"),
  "Datatype": rdfs("Datatype"),
  "domain": rdfs("domain"),
  "isDefinedBy": rdfs("isDefinedBy"),
  "label": rdfs("label"),
  "Literal": rdfs("Literal"),
  "member": rdfs("member"),
  "range": rdfs("range"),
  "Resource": rdfs("Resource"),
  "seeAlso": rdfs("seeAlso"),
  "subClassOf": rdfs("subClassOf"),
  "subPropertyOF": rdfs("subPropertyOF"),
};
