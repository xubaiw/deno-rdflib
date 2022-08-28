import { nquadsLanguage as NQ } from "./nquads.ts";
import { testNegative, testPositive } from "./utils.ts";

Deno.test("test language", async (t) => {
  // graph
  await t.step(`graph #1`, testPositive(NQ.graph, `<foo:#abc>`));
  await t.step(`graph #2`, testPositive(NQ.graph, ``));
  // quad
  await t.step(
    `quad #1`,
    testPositive(NQ.quad, `<foo:#foo> <foo:#bar> <foo:#baz>.`),
  );
  await t.step(
    `quad #2`,
    testPositive(NQ.quad, `<foo:#foo> <foo:#bar> <foo:#baz> <foo:graph> .`),
  );
  // NQuads doc
  await t.step(
    `nquadsDoc #1`,
    testPositive(NQ.nquadsDoc, `<foo:#foo>  <foo:#bar>   <foo:#baz>   .   `),
  );
  await t.step(
    `nquadsDoc #2`,
    testPositive(NQ.nquadsDoc, `<foo:#foo>  <foo:#bar>   <foo:#baz> <foo:graph>  .   `),
  );
});

Deno.test("test suite", async (t) => {
  const dir = new URL("./test-suites/nquads/", import.meta.url);

  for await (const entry of Deno.readDir(dir)) {
    if (
      entry.isFile && entry.name.endsWith(".nq")
    ) {
      const f = new URL(entry.name, dir);
      const text = await Deno.readTextFile(f);
      const testFn = entry.name.includes("bad") ? testNegative : testPositive;
      await t.step(f.pathname, testFn(NQ.nquadsDoc, text));
    }
  }
});
