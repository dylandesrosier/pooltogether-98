import { isAddress } from "@ethersproject/address";
import { PrizePoolNetwork } from "@pooltogether/v4-client-js";
import { mainnet } from "@pooltogether/v4-pool-data";
import { BigNumber } from "ethers";
import { useEffect, useState } from "preact/hooks";
import { useAccount } from "wagmi";
import { PROVIDERS } from "../../../constants/network";

const prizePoolNetwork = new PrizePoolNetwork(PROVIDERS, mainnet);

const Balance = () => {
  const [balanceData, setBalanceData] = useState<
    {
      balances: { ticket: BigNumber; token: BigNumber };
      chainId: number;
      address: string;
    }[]
  >();
  const { address } = useAccount();

  console.log({ balanceData, address });

  useEffect(() => {
    const fetchData = async () => {
      const r = await prizePoolNetwork.getUsersPrizePoolBalances(address);
      console.log(r);
      setBalanceData(r);
    };
    if (isAddress(address)) {
      fetchData();
    }
  }, [address]);

  return (
    <div>
      {balanceData?.map((balance) => balance.balances.ticket.toString())}
    </div>
  );
};

export default Balance;
