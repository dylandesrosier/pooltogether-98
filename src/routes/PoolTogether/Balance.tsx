import { isAddress } from "@ethersproject/address";
import { BigNumber } from "ethers";
import { useEffect, useState } from "preact/hooks";
import { useAccount } from "wagmi";
import { PRIZE_POOL_NETWORK } from "../../constants/network";
import { h } from "preact";
import { Token } from "../../hooks/useAllPrizePoolTokens";
import { formatUnits } from "ethers/lib/utils.js";
import classNames from "classnames";

const Balance = (props: {
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
  const { tokens, balanceData, className } = props;

  return (
    <fieldset className={classNames(className)}>
      <legend>Balances</legend>
      {balanceData?.map((balance) => (
        <div className="field-row">
          <label>
            {
              tokens?.find(
                (t) => t.prizePoolId === balance.address + "-" + balance.chainId
              )?.ticket.name
            }
            :
          </label>
          <span className="ml-auto">
            {formatUnits(balance.balances.ticket, 6)}
          </span>
        </div>
      ))}
    </fieldset>
  );
};

export default Balance;
