import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { DataFactory, equal } from "../model.ts";

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
