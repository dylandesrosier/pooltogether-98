import { Fragment, h } from "preact";
import { useAccount, useConnect, useNetwork } from "wagmi";
import classNames from "classnames";
import { NETWORKS } from "../../constants/network";

const WalletConnection = (props: { className?: string }) => {
  const { className } = props;
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { chain } = useNetwork();

  return (
    <fieldset className={classNames(className)}>
      <legend>Wallet</legend>
      <div className="window-body">
        {isConnected ? (
          <Fragment>
            <p>{address}</p>
            <div className="flex-row">
              <span className="my-auto">
                Network: {NETWORKS[chain?.id || 1] || "-"}
              </span>
              <button
                className="ml-auto"
                onClick={() => activeConnector?.disconnect()}
              >
                Disconnect
              </button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>Select a Wallet to connect with.</p>
            <p>
              <a href="https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/">
                What's a wallet?
              </a>
            </p>
            <div className="field-row" style={{ justifyContent: "center" }}>
              {connectors.map((connector) => (
                <button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({ connector })}
                >
                  {connector.name}
                  {isLoading &&
                    pendingConnector?.id === connector.id &&
                    " (connecting)"}
                </button>
              ))}
            </div>
          </Fragment>
        )}
        {error && <div>{error.message}</div>}
      </div>
    </fieldset>
  );
};

export default WalletConnection;
