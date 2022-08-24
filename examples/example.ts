import { Store } from "../mod.ts";

const store = new Store();

// original
const url = new URL("./example.nt", import.meta.url);
const text = await Deno.readTextFile(url);
console.log(`=== Original ===`);
console.log(text);

// parsed
await store.parse(text);
console.log(`=== Parsed ===`);
console.log(await store.findMany());

// stringify
console.log(`=== Stringify ===`);
console.log(await store.stringify());
