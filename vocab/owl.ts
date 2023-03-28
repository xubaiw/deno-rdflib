/**
 * @file xsd vocabulary
 */

import { NamedNode } from "../types.ts";

export default function owl(name: string): NamedNode {
  return {
    tag: "named",
    iri: "http://www.w3.org/2002/07/owl#" + name,
  };
}

export const allValuesFrom = owl("allValuesFrom");
export const annotatedProperty = owl("annotatedProperty");
export const annotatedSource = owl("annotatedSource");
export const annotatedTarget = owl("annotatedTarget");
export const assertionProperty = owl("assertionProperty");
export const cardinality = owl("cardinality");
export const complementOf = owl("complementOf");
export const datatypeComplementOf = owl("datatypeComplementOf");
export const differentFrom = owl("differentFrom");
export const disjointUnionOf = owl("disjointUnionOf");
export const disjointWith = owl("disjointWith");
export const distinctMembers = owl("distinctMembers");
export const equivalentClass = owl("equivalentClass");
export const equivalentProperty = owl("equivalentProperty");
export const hasKey = owl("hasKey");
export const hasSelf = owl("hasSelf");
export const hasValue = owl("hasValue");
export const intersectionOf = owl("intersectionOf");
export const inverseOf = owl("inverseOf");
export const maxCardinality = owl("maxCardinality");
export const maxQualifiedCardinality = owl("maxQualifiedCardinality");
export const members = owl("members");
export const minCardinality = owl("minCardinality");
export const minQualifiedCardinality = owl("minQualifiedCardinality");
export const onClass = owl("onClass");
export const onDataRange = owl("onDataRange");
export const onDatatype = owl("onDatatype");
export const onProperties = owl("onProperties");
export const onProperty = owl("onProperty");
export const oneOf = owl("oneOf");
export const propertyChainAxiom = owl("propertyChainAxiom");
export const propertyDisjointWith = owl("propertyDisjointWith");
export const qualifiedCardinality = owl("qualifiedCardinality");
export const sameAs = owl("sameAs");
export const someValuesFrom = owl("someValuesFrom");
export const sourceIndividual = owl("sourceIndividual");
export const targetIndividual = owl("targetIndividual");
export const targetValue = owl("targetValue");
export const unionOf = owl("unionOf");
export const withRestrictions = owl("withRestrictions");
export const AllDifferent = owl("AllDifferent");
export const AllDisjointClasses = owl("AllDisjointClasses");
export const AllDisjointProperties = owl("AllDisjointProperties");
export const Annotation = owl("Annotation");
export const AnnotationProperty = owl("AnnotationProperty");
export const AsymmetricProperty = owl("AsymmetricProperty");
export const Axiom = owl("Axiom");
export const Class = owl("Class");
export const DataRange = owl("DataRange");
export const DatatypeProperty = owl("DatatypeProperty");
export const DeprecatedClass = owl("DeprecatedClass");
export const DeprecatedProperty = owl("DeprecatedProperty");
export const FunctionalProperty = owl("FunctionalProperty");
export const InverseFunctionalProperty = owl("InverseFunctionalProperty");
export const IrreflexiveProperty = owl("IrreflexiveProperty");
export const NamedIndividual = owl("NamedIndividual");
export const NegativePropertyAssertion = owl("NegativePropertyAssertion");
export const ObjectProperty = owl("ObjectProperty");
export const Ontology = owl("Ontology");
export const OntologyProperty = owl("OntologyProperty");
export const ReflexiveProperty = owl("ReflexiveProperty");
export const Restriction = owl("Restriction");
export const SymmetricProperty = owl("SymmetricProperty");
export const TransitiveProperty = owl("TransitiveProperty");
export const backwardCompatibleWith = owl("backwardCompatibleWith");
export const deprecated = owl("deprecated");
export const incompatibleWith = owl("incompatibleWith");
export const priorVersion = owl("priorVersion");
export const versionInfo = owl("versionInfo");
export const Nothing = owl("Nothing");
export const Thing = owl("Thing");
export const bottomDataProperty = owl("bottomDataProperty");
export const topDataProperty = owl("topDataProperty");
export const bottomObjectProperty = owl("bottomObjectProperty");
export const topObjectProperty = owl("topObjectProperty");
export const imports = owl("imports");
export const versionIRI = owl("versionIRI");
export const rational = owl("rational");
export const real = owl("real");
