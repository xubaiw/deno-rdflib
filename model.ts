export type Triple = {
  tag: "triple";
  subject: Subject;
  predicate: NamedNode;
  object: Term;
};

export type BlankNode = {
  tag: "blank";
  id: string;
};

export type NamedNode = {
  tag: "named";
  iri: string;
};

export type Quad = {
  tag: "quad";
  subject: Subject;
  predicate: NamedNode;
  object: Term;
  graph?: GraphName;
};

export type Literal = {
  tag: "literal";
  value: string;
  language?: string;
  datatype: string;
};

export type GraphName = NamedNode | BlankNode;

export type Subject = NamedNode | BlankNode | Triple;

export type Term = NamedNode | BlankNode | Literal | Triple;

