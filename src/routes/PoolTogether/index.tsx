import { Fragment, h } from "preact";
import WalletConnection from "../../components/WalletConnection";
import Balance from "./Balance";
import { useAccount } from "wagmi";
import { useAllPrizePoolTokens } from "../../hooks/useAllPrizePoolTokens";
import Deposit from "./Deposit";
import { useEffect, useState } from "preact/hooks";
import { BigNumber } from "ethers";
import { PRIZE_POOL_NETWORK } from "../../constants/network";
import { isAddress } from "ethers/lib/utils.js";
import Withdraw from "./Withdraw";

const PoolTogether = () => {
  const { isConnected } = useAccount();
  const tokens = useAllPrizePoolTokens();

  const [balanceData, setBalanceData] = useState<
    {
      balances: { ticket: BigNumber; token: BigNumber };
      chainId: number;
      address: string;
    }[]
  >([]);
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async (address: string) => {
      const r = await PRIZE_POOL_NETWORK.getUsersPrizePoolBalances(address);
      console.log(r);
      setBalanceData(r);
    };
    if (address !== undefined && isAddress(address)) {
      fetchData(address);
    }
  }, [address]);

  return (
    <div style={{ maxWidth: 500 }} className="window">
      <div className="title-bar">
        <div className="title-bar-text">PoolTogether98</div>
        <div className="title-bar-controls">
          <button disabled={true} aria-label="Minimize" />
          <button disabled={true} aria-label="Maximize" />
          <button disabled={true} aria-label="Close" />
        </div>
      </div>
      <div class="window-body">
        <WalletConnection className="mb" />
        {isConnected && (
          <Fragment>
            <Balance className="mb" tokens={tokens} balanceData={balanceData} />
            <Deposit className="mb" tokens={tokens} balanceData={balanceData} />
            <Withdraw
              className="mb"
              tokens={tokens}
              balanceData={balanceData}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default PoolTogether;
