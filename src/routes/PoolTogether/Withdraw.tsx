import { isAddress } from "@ethersproject/address";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from "wagmi";
import { h } from "preact";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { Token } from "../../hooks/useAllPrizePoolTokens";
import { NETWORKS, PRIZE_POOL_NETWORK } from "../../constants/network";
import classNames from "classnames";
import { User } from "@pooltogether/v4-client-js";
import { BlockExplorerLink } from "../../components/BlockExplorerLink";

const Withdraw = (props: {
  tokens: {
    prizePoolId: string;
    ticket: Token;
    token: Token;
  }[];
  balanceData: {
    balances: { ticket: BigNumber; token: BigNumber };
    chainId: number;
    address: string;
  }[];
  className?: string;
}) => {
  const { balanceData, tokens, className } = props;

  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [withdrawTx, setWithdrawTx] =
    useState<ethers.providers.TransactionResponse>();
  const [amount, setAmount] = useState<string>("0");

  const [prizePoolId, setPrizePoolId] = useState<string>(
    "0x79Bc8bD53244bC8a9C8c27509a2d573650A83373-10"
  );
  const [prizePoolChainId, setPrizePoolChainId] = useState<number>(10);
  const balanceForSelectedChain = balanceData.find(
    (b) => b.address + "-" + b.chainId === prizePoolId
  );
  const prizePool = PRIZE_POOL_NETWORK.prizePools.find(
    (pp) => pp.id() === prizePoolId
  );

  const withdraw = useCallback(async () => {
    if (!prizePool || !signer) {
      return null;
    }
    const user = new User(prizePool.prizePoolMetadata, signer, prizePool);
    const tx = await user.withdraw(ethers.utils.parseUnits(amount, 6));
    setWithdrawTx(tx);
  }, [prizePool, amount, signer]);

  const isWalletOnSelectedNetwork = chain?.id === prizePoolChainId;
  const isValidAmount =
    !!amount &&
    parseUnits(amount, 6).gt(0) &&
    parseUnits(amount, 6).lte(balanceForSelectedChain?.balances.ticket || 0);
  const disabled =
    !signer || !prizePoolId || !isWalletOnSelectedNetwork || !isValidAmount;

  return (
    <fieldset className={classNames(className)}>
      <legend>Withdraw</legend>
      <div class="field-row-stacked">
        <label for="withdraw-chain">Prize Pool</label>
        <select
          id="withdraw-chain"
          className="mb"
          onChange={(v) => {
            setPrizePoolId(v.currentTarget.value);
            setPrizePoolChainId(Number(v.currentTarget.value.split("-")[1]));
          }}
          value={prizePoolId}
        >
          {PRIZE_POOL_NETWORK.prizePools.map((pp, index) => (
            <option value={pp.id()}>{NETWORKS[pp.chainId]}</option>
          ))}
        </select>
      </div>
      <div class="field-row-stacked">
        <label for="withdraw-amount">Amount</label>
        <input
          id="withdraw-amount"
          type="number"
          value={amount}
          onChange={(v) => setAmount(v.currentTarget.value)}
          step="any"
          min="0"
        />
        <button
          className="ml-auto"
          type="button"
          style={{ maxWidth: "80px" }}
          disabled={balanceData.length === 0}
          onClick={() =>
            setAmount(
              formatUnits(
                balanceData.find(
                  (b) => b.address + "-" + b.chainId === prizePoolId
                )?.balances.ticket || ethers.constants.Zero,
                6
              )
            )
          }
        >
          Max
        </button>
      </div>
      <hr style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      {!isWalletOnSelectedNetwork && (
        <button
          style={{ width: "100%", marginTop: "0.5rem" }}
          type="button"
          onClick={() => switchNetworkAsync?.(prizePoolChainId)}
        >
          Switch to {NETWORKS[prizePoolChainId]}
        </button>
      )}
      <button
        style={{ width: "100%", marginTop: "0.5rem" }}
        type="button"
        disabled={disabled}
        onClick={() => withdraw()}
      >
        Withdraw
      </button>
      {withdrawTx && (
        <BlockExplorerLink
          className="mt"
          chainId={withdrawTx?.chainId}
          hash={withdrawTx?.hash}
        />
      )}
    </fieldset>
  );
};

export default Withdraw;
