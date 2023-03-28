import { equal as deepEqual } from "https://deno.land/std@0.152.0/testing/asserts.ts";

export type Term = {
  termType:
    | "Variable"
    | "NamedNode"
    | "BlankNode"
    | "DefaultGraph"
    | "Literal"
    | "Quad";
};

export type Variable = {
  termType: "Variable";
  value: string;
};

export type NamedNode = {
  termType: "NamedNode";
  value: string;
};

export type BlankNode = {
  termType: "BlankNode";
  value: string;
};

export type DefaultGraph = {
  termType: "DefaultGraph";
};

export type Literal = {
  termType: "Literal";
  value: string;
  datatype: NamedNode;
  language?: string;
};

export type QuadSubject = NamedNode | BlankNode | Variable | Quad;
export type QuadPredicate = NamedNode | Variable;
export type QuadObject = NamedNode | BlankNode | Variable | Literal;
export type QuadGraph = NamedNode | BlankNode | Variable | DefaultGraph;
export type Quad = {
  termType: "Quad";
  subject: QuadSubject;
  predicate: QuadPredicate;
  object: QuadObject;
  graph: QuadGraph;
};

export class DataFactory {
  #data: {
    blankNodeCounter: number;
  };
  constructor() {
    this.#data = {
      blankNodeCounter: 0,
    };
  }
  namedNode(value: string): NamedNode {
    return {
      termType: "NamedNode",
      value,
    };
  }
  blankNode(value?: string): BlankNode {
    return {
      termType: "BlankNode",
      value: value || ("b" + (++this.#data.blankNodeCounter)),
    };
  }
  literal(value: string, languageOrDatatype?: string | NamedNode): Literal {
    let datatype, language;
    if (typeof languageOrDatatype === "string" || !languageOrDatatype) {
      datatype = this.namedNode(
        "http://www.w3.org/2001/XMLSchema#string",
      );
      language = languageOrDatatype;
    } else {
      datatype = languageOrDatatype;
    }
    return {
      termType: "Literal",
      value,
      language,
      datatype,
    };
  }
  variable(value: string): Variable {
    return {
      termType: "Variable",
      value,
    };
  }
  defaultGraph(): DefaultGraph {
    return {
      termType: "DefaultGraph",
    };
  }
  quad(
    subject: QuadSubject,
    predicate: QuadPredicate,
    object: QuadObject,
    graph: QuadGraph = this.defaultGraph(),
  ): Quad {
    return {
      termType: "Quad",
      subject,
      predicate,
      object,
      graph,
    };
  }
}

export function equal(a: Term, b: Term): boolean {
  return deepEqual(a, b);
}
