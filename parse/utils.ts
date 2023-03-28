import {
  anyChar,
  Context,
  eof,
  failure,
  map,
  Parser,
  Result,
  seq,
} from "https://deno.land/x/combine@v0.0.9/mod.ts";
import {
  assert,
  assertEquals,
  assertFalse,
} from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { DataFactory } from "../model.ts";

export type Range = (number | string | [number | string, number | string])[];
type CodeRange = (number | [number, number])[];

function charInCodeRange(c: number, range: CodeRange): boolean {
  for (const x of range) {
    if (typeof x == "number") {
      // single number => equal
      if (c === x) return true;
    } else {
      // two numbers => in range
      if (x[0] <= c && c <= x[1]) return true;
    }
  }
  return false;
}

function charToCode(c: number | string): number {
  return typeof c == "string" ? c.charCodeAt(0) : c;
}

function rangeToCodeRange(range: Range): CodeRange {
  return range.map((x) =>
    Array.isArray(x) ? [charToCode(x[0]), charToCode(x[1])] : charToCode(x)
  );
}

export const charInRange = (
  ...range: Range
): Parser<string> => {
  return (ctx) => {
    const codeRange = rangeToCodeRange(range);
    const c = anyChar()(ctx);
    if (!c.success) return c;
    if (charInCodeRange(c.value.charCodeAt(0), codeRange)) return c;
    return failure(c.ctx, `${c.value} not in range ${range}`);
  };
};

export const charNotInRange = (
  ...range: Range
): Parser<string> => {
  return (ctx) => {
    const codeRange = rangeToCodeRange(range);
    const c = anyChar()(ctx);
    if (!c.success) return c;
    if (!charInCodeRange(c.value.charCodeAt(0), codeRange)) return c;
    return failure(
      c.ctx,
      `${c.value} in range ${range}, but expected no in this range`,
    );
  };
};

export function parse<T>(parser: Parser<T>, text: string): Result<T> {
  return map(seq(parser, eof()), ([fst]) => fst)({
    text,
    index: 0,
  });
}

export function testPositive<T>(
  parser: Parser<T>,
  text: string,
  value?: T,
): (t: Deno.TestContext) => void {
  return () => {
    const result = parse(parser, text);
    if (!result.success) {
      console.log(result);
      pointOutError(result.ctx);
      console.log(result.ctx.text);
      console.log(`${"~".repeat(result.ctx.index)}^`);
    }
    assert(result.success);
    if (value !== undefined) {
      assertEquals(value, result.value);
    }
  };
}

export function testNegative<T>(
  parser: Parser<T>,
  text: string,
): (t: Deno.TestContext) => void {
  return () => {
    const result = parse(parser, text);
    if (result.success) {
      console.log(result);
    }
    assertFalse(result.success);
  };
}

function pointOutError(ctx: Context) {
  let countdown: number | null = ctx.index;
  const splits = ctx.text.split("\n");
  for (const line of splits) {
    console.log(line);
    if (countdown && countdown < line.length) {
      console.log(`${"~".repeat(countdown)}^`);
      countdown = null;
    } else {
      if (countdown) {
        countdown -= line.length;
      }
    }
  }
}

export const factory = new DataFactory();

export function isValidIRI(iri: string, base?: string): boolean {
  const i = iri + base ?? "";
  // HACK better IRI detection
  try {
    new URL(i);
    return true;
  } catch {
    return false;
  }
}
