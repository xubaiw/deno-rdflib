import { assertEquals } from "std/testing/asserts.ts";
import { DataFactory, equal } from "../src/model.ts";

const f = new DataFactory();

Deno.test("model equal", () => {
  const a = f.quad(
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
  );
  const b = f.quad(
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
    f.namedNode("http://example.com"),
  );
  const c = f.namedNode("http://example.com");
  const d = f.namedNode("http://example.com/");

  assertEquals(true, equal(a, b));
  assertEquals(false, equal(a, c));
  assertEquals(false, equal(c, d));
});
