import { ntripleLanguage as S } from "./ntriples.ts";
import { testNegative, testPositive } from "./utils.ts";
const r = String.raw;

Deno.test("test language", async (t) => {
  // COMMENT
  await t.step(`COMMENT #1`, testPositive(S.COMMENT, "#"));
  await t.step(`COMMENT #2`, testPositive(S.COMMENT, "# foo"));
  // white space
  await t.step(`WHITESPACE #1`, testPositive(S.WHITESPACES, " "));
  await t.step(`WHITESPACE #2`, testPositive(S.WHITESPACES, "\t"));
  // hex
  await t.step(`HEX #1`, testPositive(S.HEX, "0", "0"));
  await t.step(`HEX #2`, testPositive(S.HEX, "F", "F"));
  await t.step(`HEX #3`, testPositive(S.HEX, "a", "a"));
  // prefixed name chars
  await t.step(`PN_CHARS_BASE`, testPositive(S.PN_CHARS_BASE, "A"));
  await t.step(`PN_CHARS_U #1`, testPositive(S.PN_CHARS_U, "A"));
  await t.step(`PN_CHARS_U #2`, testPositive(S.PN_CHARS_U, "_"));
  await t.step(`PN_CHARS_U #3`, testPositive(S.PN_CHARS_U, ":"));
  await t.step(`PN_CHARS #1`, testPositive(S.PN_CHARS, "-"));
  await t.step(`PN_CHARS #2`, testPositive(S.PN_CHARS, "\u00B7"));
  await t.step(`PN_CHARS #3`, testPositive(S.PN_CHARS, "2"));
  // escape cahrs
  await t.step(`ECHAR #1`, testPositive(S.ECHAR, r`\t`));
  await t.step(`ECHAR #2`, testPositive(S.ECHAR, r`\b`));
  await t.step(`ECHAR #3`, testPositive(S.ECHAR, r`\n`));
  await t.step(`ECHAR #4`, testPositive(S.ECHAR, r`\r`));
  await t.step(`ECHAR #5`, testPositive(S.ECHAR, r`\f`));
  await t.step(`ECHAR #6`, testPositive(S.ECHAR, r`\"`));
  await t.step(`ECHAR #7`, testPositive(S.ECHAR, r`\'`));
  await t.step(`ECHAR #8`, testPositive(S.ECHAR, r`\\`));
  // unicode escape
  await t.step(`UCHAR #1`, testPositive(S.UCHAR, r`\uabcd`));
  await t.step(`UCHAR #2`, testPositive(S.UCHAR, r`\U1023ABCD`));
  // blank node label
  await t.step(`BLANK_NODE_LABEL #1`, testPositive(S.BLANK_NODE_LABEL, `_:1`));
  await t.step(`BLANK_NODE_LABEL #2`, testPositive(S.BLANK_NODE_LABEL, `_:a`));
  await t.step(
    `BLANK_NODE_LABEL #3`,
    testPositive(S.BLANK_NODE_LABEL, `_:a.b`),
  );
  await t.step(
    `BLANK_NODE_LABEL #4`,
    testPositive(S.BLANK_NODE_LABEL, `_:_a:2`),
  );
  // string literal quote
  await t.step(
    `STRING LITERAL QUOTE #1`,
    testPositive(S.STRING_LITERAL_QUOTE, r`"2323//"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #2`,
    testPositive(S.STRING_LITERAL_QUOTE, r`"\uabcd233"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #3`,
    testPositive(S.STRING_LITERAL_QUOTE, r`"哈哈\U01230123"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #4`,
    testPositive(S.STRING_LITERAL_QUOTE, r`"\t\t\t\n"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #5`,
    testPositive(S.STRING_LITERAL_QUOTE, r`"https://example.com"`),
  );
  // IRI ref
  await t.step(`IRIREF #1`, testPositive(S.IRIREF, `<urn:foo#bar>`));
  await t.step(`IRIREF #2`, testPositive(S.IRIREF, `<https://example.com>`));
  await t.step(
    `IRIREF #3`,
    testPositive(S.IRIREF, `<https://example.com/#abc>`),
  );
  await t.step(`IRIREF #4`, testPositive(S.IRIREF, `<foo:abc>`));
  await t.step(`IRIREF #5`, testPositive(S.IRIREF, `<foo:./foo.ttl#abc>`));
  await t.step(`IRIREF #6`, testPositive(S.IRIREF, `<foo:../..>`));
  // eol
  await t.step(`EOL #1`, testPositive(S.EOL, `\u000D`));
  await t.step(`EOL #2`, testPositive(S.EOL, `\r`));
  await t.step(`EOL #3`, testPositive(S.EOL, `\n\r`));
  await t.step(`EOL #4`, testPositive(S.EOL, `\r\n`));
  await t.step(`EOL #5`, testPositive(S.EOL, `\n\n\r`));
  // lang tag
  await t.step(`LANGTAG #1`, testPositive(S.LANGTAG, `@zh`));
  await t.step(`LANGTAG #2`, testPositive(S.LANGTAG, `@zh-CN`));
  await t.step(`LANGTAG #3`, testPositive(S.LANGTAG, `@zh-CN-UTF8`));
  // literal
  await t.step(`literal #1`, testPositive(S.literal, `"foo"`));
  await t.step(`literal #2`, testPositive(S.literal, `"bar"^^<foo:#abc>`));
  await t.step(`literal #3`, testPositive(S.literal, `"baz"@zh`));
  // object
  await t.step(`object #1`, testPositive(S.object, `"foo^^<foo:#abc>"`));
  await t.step(`object #2`, testPositive(S.object, `<foo:#abc>`));
  await t.step(`object #3`, testPositive(S.object, `_:xyz`));
  // predicate
  await t.step(`predicate #1`, testPositive(S.predicate, `<foo:#abc>`));
  // subject
  await t.step(`subject #1`, testPositive(S.subject, `_:foo`));
  await t.step(`subject #2`, testPositive(S.subject, `<foo:#abc>`));
  // triple
  await t.step(`triple #1`, testPositive(S.triple, `<foo:#foo> <foo:#bar> <foo:#baz>.`));
  await t.step(`triple #2`, testPositive(S.triple, `<foo:#foo> <foo:#bar> "baz"@zh.`));
  await t.step(`triple #3`, testPositive(S.triple, `<foo:#foo> <foo:#bar>\t<foo:#baz>\t.`));
  // NTriples doc
  await t.step(
    `ntripleDoc #1`,
    testPositive(S.ntriplesDoc, `<foo:#foo>  <foo:#bar>   <foo:#baz>   .   `),
  );
  await t.step(
    `ntripleDoc #2`,
    testPositive(S.ntriplesDoc, `<foo:#foo> <foo:#bar> <foo:#baz> . # foo bar baz`),
  );
  await t.step(
    `ntripleDoc #3`,
    testPositive(
      S.ntriplesDoc,
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
      await t.step(f.pathname, testFn(S.ntriplesDoc, text));
    }
  }
});
