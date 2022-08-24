import {
  BlankNode,
  DataFactory,
  equal,
  Literal,
  NamedNode,
  Quad,
  QuadObject,
  QuadPredicate,
  QuadSubject,
} from "../model.ts";

const factory = new DataFactory();
const stringType = factory.namedNode("http://www.w3.org/2001/XMLSchema#string");

export default function serialize(quads: Quad[]): string {
  let result = "";
  for (const q of quads) {
    result += `${serializeSubject(q.subject)} ${
      serializePredicate(q.predicate)
    } ${serializeObject(q.object)} .\n`;
  }
  return result;
}

function serializeSubject(term: QuadSubject): string {
  if (term.termType == "BlankNode") {
    return serializeBlankNode(term);
  } else if (term.termType == "NamedNode") {
    return serializeNamedNode(term);
  } else {
    throw new Error("Cannot serialize `Variable` or `Quad`");
  }
}

function serializePredicate(term: QuadPredicate): string {
  if (term.termType == "NamedNode") {
    return serializeNamedNode(term);
  } else {
    throw new Error("Cannot serialize `Variable`");
  }
}

function serializeObject(term: QuadObject): string {
  if (term.termType == "BlankNode") {
    return serializeBlankNode(term);
  } else if (term.termType == "NamedNode") {
    return serializeNamedNode(term);
  } else if (term.termType == "Literal") {
    return serializeLiteral(term);
  } else {
    throw new Error("Cannot serialize `Variable`");
  }
}

function serializeBlankNode(term: BlankNode): string {
  return `_:${term.value}`;
}

function serializeNamedNode(term: NamedNode): string {
  return `<${term.value}>`;
}

function serializeLiteral(term: Literal): string {
  const suffix = term.language
    ? `@${term.language}`
    : equal(term.datatype, stringType)
    ? ""
    : `^^${serializeNamedNode(term.datatype)}`;
  return `"${term.value}"${suffix}`;
}
