import { assertEquals } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import * as T from "./turtle.ts";
import * as C from "https://deno.land/x/combine@v0.0.10/mod.ts";

const test = () => {
  testParser(T.p_PN_LOCAL_ESC, ["!"], ["a"]);
  testParser(T.p_HEX, ["2", "a", "F"], ["G"]);
  testParser(T.p_PERCENT, ["%12", "%AF"], ["12"]);
  testParser(T.p_PLX, ["%12"], ["12"]);
  testParser(T.p_PN_CHARS_BASE, ["Č"], ["!"]);
  testParser(T.p_PN_CHARS_U, ["Č", "_"], ["!"]);
  testParser(T.p_PN_PREFIX, ["A̧a.甲."], []);
};

const testParser = <T>(
  p: C.Parser<T>,
  success: string[],
  failure: string[],
) => {
  Deno.test(p.name, () => {
    const pe = C.seq(p, C.eof());
    for (const t of success) assertSuccess(pe, t, true);
    for (const t of failure) assertSuccess(pe, t, false);
  });
};

const assertSuccess = <T>(p: C.Parser<T>, text: string, success: boolean) =>
  assertEquals(p({ text, index: 0 }).success, success);

if (import.meta.main) test();
