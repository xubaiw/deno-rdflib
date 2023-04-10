import xsd from "./vocabs/xsd.ts";

export type Triple = {
  tag: "triple";
  subject: Subject;
  predicate: NamedNode;
  object: Term;
};

export function triple(
  subject: Subject,
  predicate: NamedNode,
  object: Term,
): Triple {
  return { tag: "triple", subject, predicate, object };
}

export type BlankNode = {
  tag: "blank";
  id: string;
};

export function blankNode(id: string): BlankNode {
  return { tag: "blank", id };
}

export type NamedNode = {
  tag: "named";
  iri: string;
};

export function namedNode(iri: string): NamedNode {
  return { tag: "named", iri };
}

export type Quad = {
  tag: "quad";
  subject: Subject;
  predicate: NamedNode;
  object: Term;
  graph?: GraphName;
};

export function quad(
  subject: Subject,
  predicate: NamedNode,
  object: Term,
  graph?: GraphName,
): Quad {
  return { tag: "quad", subject, predicate, object, graph };
}

export type Literal = {
  tag: "literal";
  value: string;
  language?: string;
  datatype: NamedNode;
};

export function literal(
  value: string,
  datatype?: NamedNode,
  language?: string,
): Literal {
  return {
    tag: "literal",
    value: value.toString(),
    datatype: datatype ?? xsd.string,
    language,
  };
}

export type GraphName = NamedNode | BlankNode;

export type Subject = NamedNode | BlankNode | Triple;

export type Term = NamedNode | BlankNode | Literal | Triple;
