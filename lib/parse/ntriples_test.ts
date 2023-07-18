import { language as NT } from "./ntriples.ts";
import { testNegative, testPositive } from "./utils.ts";

Deno.test("test language", async (t) => {
  // triple
  await t.step(
    `triple #1`,
    testPositive(NT.triple, `<foo:#foo> <foo:#bar> <foo:#baz>.`),
  );
  await t.step(
    `triple #2`,
    testPositive(NT.triple, `<foo:#foo> <foo:#bar> "baz"@zh.`),
  );
  await t.step(
    `triple #3`,
    testPositive(NT.triple, `<foo:#foo> <foo:#bar>\t<foo:#baz>\t.`),
  );
  // NTriples doc
  await t.step(
    `ntripleDoc #1`,
    testPositive(NT.ntriplesDoc, `<foo:#foo>  <foo:#bar>   <foo:#baz>   .   `),
  );
  await t.step(
    `ntripleDoc #2`,
    testPositive(
      NT.ntriplesDoc,
      `<foo:#foo> <foo:#bar> <foo:#baz> . # foo bar baz`,
    ),
  );
  await t.step(
    `ntripleDoc #3`,
    testPositive(
      NT.ntriplesDoc,
      `#123\n<foo:#foo> <foo:#bar> <foo:#baz> . #233 \n <foo:#a> <foo:#b> <foo:#c>.`,
    ),
  );
});

Deno.test("test suite", async (t) => {
  const dir = new URL("./test-suites/ntriples/", import.meta.url);

  for await (const entry of Deno.readDir(dir)) {
    if (
      entry.isFile && entry.name.endsWith(".nt")
    ) {
      const f = new URL(entry.name, dir);
      const text = await Deno.readTextFile(f);
      const testFn = entry.name.includes("bad") ? testNegative : testPositive;
      await t.step(f.pathname, testFn(NT.ntriplesDoc, text));
    }
  }
});
