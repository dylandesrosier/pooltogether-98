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

const Deposit = (props: {
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

  const [depositAllowance, setDepositAllowance] = useState<BigNumber>(
    ethers.constants.Zero
  );

  const [depositTx, setDepositTx] =
    useState<ethers.providers.TransactionResponse>();
  const [approveTx, setApproveTx] =
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

  useEffect(() => {
    if (!prizePool || !signer || !address) {
      setDepositAllowance(ethers.constants.Zero);
      return;
    }
    const approveAmount = async () => {
      console.log("Fetch deposit allowance", prizePool.id());
      const depositAllowance = await prizePool.getUsersDepositAllowance(
        address
      );
      setDepositAllowance(depositAllowance.allowanceUnformatted);
    };
    approveAmount();
    return;
  }, [prizePoolChainId, signer, address]);

  const deposit = useCallback(async () => {
    if (!prizePool || !signer) {
      return null;
    }
    const user = new User(prizePool.prizePoolMetadata, signer, prizePool);
    const tx = await user.deposit(ethers.utils.parseUnits(amount, 6));
    setDepositTx(tx);
  }, [prizePool, amount, signer]);

  const approveDeposit = useCallback(async () => {
    if (!prizePool || !signer) {
      return null;
    }
    const user = new User(prizePool.prizePoolMetadata, signer, prizePool);
    const tx = await user.approveDeposits();
    setApproveTx(tx);
  }, [prizePool, amount, signer]);

  const isWalletOnSelectedNetwork = chain?.id === prizePoolChainId;
  const isValidAmount =
    !!amount &&
    parseUnits(amount, 6).gt(4) &&
    parseUnits(amount, 6).lte(balanceForSelectedChain?.balances.token || 0);
  const showApprove =
    isValidAmount && depositAllowance.lt(parseUnits(amount, 6));
  const disabled =
    !signer ||
    !prizePoolId ||
    !isWalletOnSelectedNetwork ||
    !isValidAmount ||
    showApprove;

  console.log({ disabled, prizePoolId, cid: chain, prizePoolChainId });

  return (
    <fieldset className={classNames(className)}>
      <legend>Deposit</legend>
      <div class="field-row-stacked">
        <label for="deposit-chain">Prize Pool</label>
        <select
          id="deposit-chain"
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
        <label for="deposit-amount">Amount</label>
        <input
          id="deposit-amount"
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
                )?.balances.token || ethers.constants.Zero,
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
      {showApprove && (
        <button
          style={{ width: "100%", marginTop: "0.5rem" }}
          type="button"
          disabled={!!approveTx || !isWalletOnSelectedNetwork}
          onClick={() => approveDeposit()}
        >
          Approve Deposits
        </button>
      )}
      {approveTx && (
        <BlockExplorerLink
          className="mt"
          chainId={approveTx?.chainId}
          hash={approveTx?.hash}
        />
      )}
      <button
        style={{ width: "100%", marginTop: "0.5rem" }}
        type="button"
        disabled={disabled}
        onClick={() => deposit()}
      >
        Deposit
      </button>
      {depositTx && (
        <BlockExplorerLink
          className="mt"
          chainId={depositTx?.chainId}
          hash={depositTx?.hash}
        />
      )}
    </fieldset>
  );
};

export default Deposit;
