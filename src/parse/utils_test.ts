import { charInRange, charNotInRange, testPositive } from "./utils.ts";

Deno.test("single char", async (t) => {
  const abc = charInRange("a", "b", "c");
  const nabc = charNotInRange("a", "b", "c");
  await t.step("a", testPositive(abc, "a", "a"));
  await t.step("b", testPositive(abc, "b", "b"));
  await t.step("c", testPositive(abc, "c", "c"));
  await t.step("z", testPositive(nabc, "z", "z"));
});

Deno.test("char range", async (t) => {
  const a2c = charInRange(["a", "c"]);
  const na2c = charNotInRange(["a", "c"]);
  await t.step("a", testPositive(a2c, "a", "a"));
  await t.step("b", testPositive(a2c, "b", "b"));
  await t.step("c", testPositive(a2c, "c", "c"));
  testPositive(na2c, "z", "z");
});

Deno.test("escape", async (t) => {
  const ton = charInRange(0xD, 0xA);
  await t.step("t", testPositive(ton, "\r", "\r"));
  await t.step("n", testPositive(ton, "\n", "\n"));
});

Deno.test("common ranges", async (t) => {
  const pa2z = charInRange(["a", "z"]);
  for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(pa2z, char, char));
  }
  const pA2Z = charInRange(["A", "Z"]);
  for (let c = "A".charCodeAt(0); c <= "Z".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(pA2Z, char, char));
  }
  const p0t9 = charInRange(["0", "9"]);
  for (let c = "0".charCodeAt(0); c <= "9".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(p0t9, char, char));
  }
});

Deno.test("multiple ranges", async (t) => {
  const p = charInRange(["a", "z"], ["A", "Z"], ["0", "9"]);
  for (let c = "a".charCodeAt(0); c <= "z".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(p, char, char));
  }
  for (let c = "A".charCodeAt(0); c <= "Z".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(p, char, char));
  }
  for (let c = "0".charCodeAt(0); c <= "9".charCodeAt(0); c++) {
    const char = String.fromCharCode(c);
    await t.step(`${char}`, testPositive(p, char, char));
  }
});
