import { JsonRpcProvider } from "@ethersproject/providers";
import { chain } from "wagmi";

export const INFURA_RPC_URLS: Record<number, string> = {
  [chain.mainnet.id]:
    "https://mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
  [chain.polygon.id]:
    "https://polygon-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
  [chain.optimism.id]:
    "https://optimism-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
  43114: "https://api.avax.network/ext/bc/C/rpc",
};

export const PROVIDERS = {
  [chain.mainnet.id]: new JsonRpcProvider(
    "https://mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e"
  ),
  [chain.polygon.id]: new JsonRpcProvider(
    "https://polygon-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e"
  ),
  [chain.optimism.id]: new JsonRpcProvider(
    "https://optimism-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e"
  ),
  43114: new JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"),
};
