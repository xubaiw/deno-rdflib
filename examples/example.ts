import { Store } from "../mod.ts";

const store = new Store();
const url = new URL("./example.nt", import.meta.url);
await store.parse(url.pathname);
console.log(await store.findMany());
