import xsd from "./vocabs/xsd.ts";
import rdf from "./vocabs/rdf.ts";
import { equal as teq } from "https://deno.land/std@0.194.0/testing/asserts.ts";

export type Term =
  | NamedNode
  | BlankNode
  | Literal
  | Triple;

export type Subject =
  | NamedNode
  | BlankNode
  | Triple;

export type GraphName =
  | NamedNode
  | BlankNode
  | null;

export type NamedNode = {
  iri: string;
};

export type BlankNode = {
  id: string;
};

export type Literal = {
  lexical: string;
  datatype: NamedNode;
  language: string;
};

export type Triple = {
  subject: Subject;
  predicate: NamedNode;
  object: Term;
};

/** Use `null` for default graph */
export type Quad =
  & Triple
  & { graph: GraphName };

export const namedNode = (iri: string): NamedNode => ({ iri });

export const blankNode = (id: string): BlankNode => ({ id });

export const literal = (
  lexical: string,
  datatype?: NamedNode,
  language?: string,
): Literal => ({
  lexical,
  datatype: datatype ?? language ? rdf.langString : xsd.string,
  language: language ?? "",
});

export const triple = (
  subject: Subject,
  predicate: NamedNode,
  object: Term,
): Triple => ({ subject, predicate, object });

export const quad = (
  subject: Subject,
  predicate: NamedNode,
  object: Term,
  graph?: GraphName,
): Quad => ({ subject, predicate, object, graph: graph ?? null });

/** Check deep equal */
export const equal = (
  t1: Term | Quad | undefined | null,
  t2: Term | Quad | undefined | null,
) => teq(t1, t2);
