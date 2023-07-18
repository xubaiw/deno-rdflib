import { language as CM } from "./common.ts";
import { testPositive } from "./utils.ts";
const r = String.raw;

Deno.test("test language", async (t) => {
  // COMMENT
  await t.step(`COMMENT #1`, testPositive(CM.COMMENT, "#"));
  await t.step(`COMMENT #2`, testPositive(CM.COMMENT, "# foo"));
  // white space
  await t.step(`WHITESPACE #1`, testPositive(CM.WHITESPACES, " "));
  await t.step(`WHITESPACE #2`, testPositive(CM.WHITESPACES, "\t"));
  // hex
  await t.step(`HEX #1`, testPositive(CM.HEX, "0", "0"));
  await t.step(`HEX #2`, testPositive(CM.HEX, "F", "F"));
  await t.step(`HEX #3`, testPositive(CM.HEX, "a", "a"));
  // prefixed name chars
  await t.step(`PN_CHARS_BASE`, testPositive(CM.PN_CHARS_BASE, "A"));
  await t.step(`PN_CHARS_U #1`, testPositive(CM.PN_CHARS_U, "A"));
  await t.step(`PN_CHARS_U #2`, testPositive(CM.PN_CHARS_U, "_"));
  await t.step(`PN_CHARS_U #3`, testPositive(CM.PN_CHARS_U, ":"));
  await t.step(`PN_CHARS #1`, testPositive(CM.PN_CHARS, "-"));
  await t.step(`PN_CHARS #2`, testPositive(CM.PN_CHARS, "\u00B7"));
  await t.step(`PN_CHARS #3`, testPositive(CM.PN_CHARS, "2"));
  // escape cahrs
  await t.step(`ECHAR #1`, testPositive(CM.ECHAR, r`\t`));
  await t.step(`ECHAR #2`, testPositive(CM.ECHAR, r`\b`));
  await t.step(`ECHAR #3`, testPositive(CM.ECHAR, r`\n`));
  await t.step(`ECHAR #4`, testPositive(CM.ECHAR, r`\r`));
  await t.step(`ECHAR #5`, testPositive(CM.ECHAR, r`\f`));
  await t.step(`ECHAR #6`, testPositive(CM.ECHAR, r`\"`));
  await t.step(`ECHAR #7`, testPositive(CM.ECHAR, r`\'`));
  await t.step(`ECHAR #8`, testPositive(CM.ECHAR, r`\\`));
  // unicode escape
  await t.step(`UCHAR #1`, testPositive(CM.UCHAR, r`\uabcd`));
  await t.step(`UCHAR #2`, testPositive(CM.UCHAR, r`\U1023ABCD`));
  // blank node label
  await t.step(`BLANK_NODE_LABEL #1`, testPositive(CM.BLANK_NODE_LABEL, `_:1`));
  await t.step(`BLANK_NODE_LABEL #2`, testPositive(CM.BLANK_NODE_LABEL, `_:a`));
  await t.step(
    `BLANK_NODE_LABEL #3`,
    testPositive(CM.BLANK_NODE_LABEL, `_:a.b`),
  );
  await t.step(
    `BLANK_NODE_LABEL #4`,
    testPositive(CM.BLANK_NODE_LABEL, `_:_a:2`),
  );
  // string literal quote
  await t.step(
    `STRING LITERAL QUOTE #1`,
    testPositive(CM.STRING_LITERAL_QUOTE, r`"2323//"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #2`,
    testPositive(CM.STRING_LITERAL_QUOTE, r`"\uabcd233"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #3`,
    testPositive(CM.STRING_LITERAL_QUOTE, r`"哈哈\U01230123"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #4`,
    testPositive(CM.STRING_LITERAL_QUOTE, r`"\t\t\t\n"`),
  );
  await t.step(
    `STRING LITERAL QUOTE #5`,
    testPositive(CM.STRING_LITERAL_QUOTE, r`"https://example.com"`),
  );
  // IRI ref
  await t.step(`IRIREF #1`, testPositive(CM.IRIREF, `<urn:foo#bar>`));
  await t.step(`IRIREF #2`, testPositive(CM.IRIREF, `<https://example.com>`));
  await t.step(
    `IRIREF #3`,
    testPositive(CM.IRIREF, `<https://example.com/#abc>`),
  );
  await t.step(`IRIREF #4`, testPositive(CM.IRIREF, `<foo:abc>`));
  await t.step(`IRIREF #5`, testPositive(CM.IRIREF, `<foo:./foo.ttl#abc>`));
  await t.step(`IRIREF #6`, testPositive(CM.IRIREF, `<foo:../..>`));
  // eol
  await t.step(`EOL #1`, testPositive(CM.EOL, `\u000D`));
  await t.step(`EOL #2`, testPositive(CM.EOL, `\r`));
  await t.step(`EOL #3`, testPositive(CM.EOL, `\n\r`));
  await t.step(`EOL #4`, testPositive(CM.EOL, `\r\n`));
  await t.step(`EOL #5`, testPositive(CM.EOL, `\n\n\r`));
  // lang tag
  await t.step(`LANGTAG #1`, testPositive(CM.LANGTAG, `@zh`));
  await t.step(`LANGTAG #2`, testPositive(CM.LANGTAG, `@zh-CN`));
  await t.step(`LANGTAG #3`, testPositive(CM.LANGTAG, `@zh-CN-UTF8`));
  // literal
  await t.step(`literal #1`, testPositive(CM.literal, `"foo"`));
  await t.step(`literal #2`, testPositive(CM.literal, `"bar"^^<foo:#abc>`));
  await t.step(`literal #3`, testPositive(CM.literal, `"baz"@zh`));
  // object
  await t.step(`object #1`, testPositive(CM.object, `"foo^^<foo:#abc>"`));
  await t.step(`object #2`, testPositive(CM.object, `<foo:#abc>`));
  await t.step(`object #3`, testPositive(CM.object, `_:xyz`));
  // predicate
  await t.step(`predicate #1`, testPositive(CM.predicate, `<foo:#abc>`));
  // subject
  await t.step(`subject #1`, testPositive(CM.subject, `_:foo`));
  await t.step(`subject #2`, testPositive(CM.subject, `<foo:#abc>`));
});
