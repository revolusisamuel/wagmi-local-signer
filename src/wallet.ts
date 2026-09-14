import { digest, hex } from "./digest.ts";

export type Account = {
  index: number;
  label: string;
  address: string;
};

export type Vault = {
  id: string;
  name: string;
  coin: string;
  accounts: Account[];
};

export function seedFrom(mnemonic: string, pass: string): Buffer {
  return digest(`${mnemonic}|${pass}`);
}

export function derive(seed: Buffer, index: number, path: string): { priv: Buffer; pub: Buffer } {
  const priv = digest(Buffer.concat([seed, Buffer.from(path), Buffer.from([index])]));
  const pub = digest(Buffer.concat([priv, Buffer.from("pub")]));
  return { priv, pub };
}

export function address(prefix: string, pub: Buffer): string {
  return prefix + hex(digest(Buffer.concat([pub, Buffer.from(prefix)])));
}

export function createVault(name: string, pass: string): Vault {
  const seed = seedFrom(name, pass);
  const { pub } = derive(seed, 0, "m/44'/60'/0'");
  return {
    id: hex(digest(name), 16),
    name,
    coin: "ETH",
    accounts: [{ index: 0, label: "Primary", address: address("0x", pub) }],
  };
}

export function addAccount(vault: Vault, label: string): Account {
  const seed = seedFrom(vault.name, "demo");
  const { pub } = derive(seed, vault.accounts.length, "m/44'/60'/0'");
  const account = {
    index: vault.accounts.length,
    label,
    address: address("0x", pub),
  };
  vault.accounts.push(account);
  return account;
}
