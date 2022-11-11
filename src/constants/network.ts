import { chain } from "wagmi";

export const INFURA_RPC_URLS: Record<number, string> = {
  [chain.mainnet.id]:
    "https://mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
  [chain.polygon.id]:
    "https://polygon-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
  [chain.optimism.id]:
    "https://optimism-mainnet.infura.io/v3/64cc01ebc6be4b23864ddffa7a41c42e",
};
