import { stripIndents } from "https://esm.sh/common-tags@1.8.2";
import { assertEquals } from "https://deno.land/std@0.194.0/testing/asserts.ts";
import { literal, namedNode, quad } from "../model.ts";
import { stringify } from "./nquads.ts";

Deno.test("nquads", () => {
  const actual = stringify([
    {
      subject: { id: "foo" },
      predicate: { iri: "https://example.org#bar" },
      object: { id: "baz" },
      graph: { iri: "https://example.com#blah" },
    },
    quad(
      namedNode("https://example.org#a"),
      namedNode("https://example.org#b"),
      literal("測試", "zh"),
    ),
  ]).trim();
  const expected = stripIndents`
    _:foo <https://example.org#bar> _:baz <https://example.com#blah> .
    <https://example.org#a> <https://example.org#b> "測試"@zh  .
  `;
  assertEquals(actual, expected);
});
