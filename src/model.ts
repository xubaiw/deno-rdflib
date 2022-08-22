import { equal as deepEqual } from "std/testing/asserts.ts";

export type Term = {
  termType: "Variable" | "NamedNode" | "BlankNode" | "DefaultGraph" | "Literal" | "Quad" ;
}

export type Variable = {
  termType: "Variable";
  value: string;
}

export type NamedNode = {
  termType: "NamedNode";
  value: string;
}

export type BlankNode = {
  termType: "BlankNode";
  value: string;
}

export type DefaultGraph = {
  termType: "DefaultGraph";
}

export type Literal = {
  termType: "Literal";
  value: string;
  languageOrDatatype: string | NamedNode;
}

export type QuadSubject = NamedNode | BlankNode | Variable | Quad;
export type QuadPredicate = NamedNode |  Variable ;
export type QuadObject = NamedNode | BlankNode | Variable | Literal;
export type QuadGraph = NamedNode | BlankNode | Variable | DefaultGraph;
export type Quad = {
  termType: "Quad";
  subject: QuadSubject;
  predicate: QuadPredicate;
  object: QuadObject;
  graph: QuadGraph;
}

export class DataFactory {
  #data: {
    blankNodeCounter: number;
  }
  constructor() {
    this.#data = {
      blankNodeCounter: 0,
    };
  }
  namedNode(value: string): NamedNode {
    return {
      termType: "NamedNode",
      value
    };
  }
  blankNode(value: string): BlankNode {
    return {
      termType: "BlankNode",
      value: value || ('b' + (++this.#data.blankNodeCounter))
    };
  }
  literal(value: string, languageOrDatatype: string | NamedNode): Literal {
    return {
      termType: "Literal",
      value,
      languageOrDatatype
    };
  }
  variable(value: string): Variable {
    return {
      termType: "Variable",
      value
    }
  }
  defaultGraph(): DefaultGraph {
    return {
      termType: "DefaultGraph"
    };
  }
  quad(
    subject: QuadSubject,
    predicate: QuadPredicate,
    object: QuadObject,
    graph: QuadGraph = this.defaultGraph()
  ): Quad {
    return {
      termType: "Quad",
      subject,
      predicate,
      object,
      graph
    };
  }
}

export function equal(a: Term, b: Term): boolean {
  return deepEqual(a, b);
}
