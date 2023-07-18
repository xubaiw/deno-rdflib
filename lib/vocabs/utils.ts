import { NamedNode, namedNode } from "../model.ts";

export function vocab<const T extends string>(
  prefix: string,
  ...names: T[]
): Record<T, NamedNode> {
  return Object.fromEntries(
    names.map((n) => [n, namedNode(prefix + n)]),
  ) as Record<T, NamedNode>;
}
