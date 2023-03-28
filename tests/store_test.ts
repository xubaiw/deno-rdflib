import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { DataFactory } from "../model.ts";
import { Store } from "../store.ts";

const store = new Store();
const factory = new DataFactory();

Deno.test("insert and find", async () => {
  const s = factory.namedNode("http://example.com/#s");
  const p = factory.namedNode("http://example.com/#p");
  const o = factory.namedNode("http://example.com/#o");
  const g = factory.namedNode("http://example.com");
  const q = factory.quad(s, p, o, g);

  await store.insertOne(q);

  const result = await store.findMany({
    subject: s,
  });

  assertEquals(result, [q]);
});
