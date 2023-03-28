import { NamedNode } from "https://denopkg.com/xubaiw/deno-rdflib@main/mod.ts";
import { zipObj } from "npm:rambda";

export function vocab<const T extends string>(
  prefix: string,
  ...names: T[]
): { [key in T]: NamedNode } {
  return zipObj(
    names,
    names.map((n) => namedNode(prefix, n)),
  );
}

function namedNode(prefix: string, name: string): NamedNode {
  return {
    tag: "named",
    iri: prefix + name,
  };
}
