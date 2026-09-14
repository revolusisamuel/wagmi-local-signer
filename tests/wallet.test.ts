import assert from "node:assert/strict";
import { test } from "node:test";
import { addAccount, createVault, seedFrom } from "../src/wallet.ts";
import { digest } from "../src/digest.ts";

test("digest stable", () => {
  assert.deepEqual(digest("a"), digest("a"));
});

test("create vault", () => {
  const v = createVault("test", "pw");
  assert.equal(v.name, "test");
  assert.equal(v.accounts.length, 1);
  assert.ok(v.accounts[0].address.length > 4);
});

test("unique accounts", () => {
  const v = createVault("test", "pw");
  addAccount(v, "A");
  addAccount(v, "B");
  const set = new Set(v.accounts.map((a) => a.address));
  assert.equal(set.size, 3);
});

test("seed passphrase", () => {
  assert.notDeepEqual(seedFrom("m", "a"), seedFrom("m", "b"));
});
