import {
  attempt,
  Parser,
  ParthrocError,
} from "https://denopkg.com/xubaiw/parthroc@c691b03e46433904cf223e1b3466b2aff8425c6c/mod.ts";

type State = { base: string };
type P<T> = Parser<T, State>;

export const take =
  (length: number, pred?: (sub: string) => boolean): P<string> => (ctx) => {
    const start = ctx.index;
    const end = start + length;
    const sub = ctx.text.substring(start, end);
    if (pred && !pred(sub)) {
      throw new ParthrocError(`${sub} does not satisfy ${pred}`);
    }
    ctx.index += length;
    return sub;
  };

export const oneOf = (
  ...ps: (P<string> | string | [string] | [number, number])[]
): P<string> => {
  const psm = ps.map((p) => {
    if (typeof p == "string") return take(p.length, (sub) => sub == p);
    if (Array.isArray(p)) {
      if (p.length == 1) return take(1, (char) => p.includes(char));
      else {return take(1, (char) => {
          const cp = char.codePointAt(0) ?? -1;
          return p[0] <= cp && cp <= p[1];
        });}
    }
    return p;
  });
  return (ctx) => {
    const es = [];
    for (const p of Object.values(psm)) {
      try {
        return p(ctx);
      } catch (e) {
        es.push(e);
        continue;
      }
    }
    throw new ParthrocError("None of given parser matches", es);
  };
};

export const optional = <T>(p: P<T>): P<T | null> => (ctx) => {
  try {
    return attempt(p)(ctx);
  } catch {
    return null;
  }
};

export const manyS = (p: P<string>): P<string> => (ctx) => {
  let acc = "";
  while (true) {
    try {
      acc += p(ctx);
    } catch {
      return acc;
    }
  }
};

export const seqS = (...ps: P<string | null>[]): P<string> => (ctx) => {
  let acc = "";
  for (const p of ps) {
    try {
      acc += p(ctx) ?? "";
    } catch (e) {
      throw new ParthrocError("Seq error", [e]);
    }
  }
  return acc;
};

export const charIn = (...cs: string[]) =>
  take(1, (c) => cs.join("").includes(c));

export const p_PN_LOCAL_ESC: P<string> = charIn(
  "\\_~.-!$&'()*+,;=/?#@%",
);

export const p_HEX: P<string> = oneOf(["0-9A-Fa-f"]);

// export const p_PERCENT: P<string> = attempt((ctx) => {
//   const sign = regex(/%/)(ctx);
//   const h1 = p_HEX(ctx);
//   const h2 = p_HEX(ctx);
//   return sign + h1 + h2;
// });
//
// export const p_PLX: P<string> = oneOf(p_PERCENT, p_PN_LOCAL_ESC);
//
// export const p_PN_CHARS_BASE: P<string> = regex(
//   /A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}/u,
// );
//
// export const p_PN_CHARS_U: P<string> = oneOf(
//   p_PN_CHARS_BASE,
//   regex(/_/),
// );
//
// export const p_PN_CHARS: P<string> = oneOf(
//   p_PN_CHARS_U,
//   regex(/[-0-9\u00B7\u0030-\u036F\u203F-\u2040]/),
// );
//
// export const p_PN_PREFIX: P<string> = seqString(
//   p_PN_CHARS_BASE,
//   optional(seqString(
//     manyString(oneOf(
//       p_PN_CHARS,
//       regex(/\./),
//     )),
//     p_PN_CHARS,
//   )),
// );

const ctx = { text: "A", index: 0, state: { base: "" } };
const res = p_PN_LOCAL_ESC(ctx);
console.log({ res, ctx });
