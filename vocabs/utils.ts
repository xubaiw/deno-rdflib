import { NamedNode, namedNode } from "../model.ts";
import { zipObj } from "npm:rambda";

export function vocab<const T extends string>(
  prefix: string,
  ...names: T[]
): { [key in T]: NamedNode } {
  return zipObj(
    names,
    names.map((n) => namedNode(prefix + n)),
  );
}
