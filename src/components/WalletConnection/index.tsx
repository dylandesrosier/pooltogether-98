import { Fragment, h } from "preact";
import { useAccount, useConnect } from "wagmi";

const WalletConnection = () => {
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <fieldset>
      <div className="window-body" style={{ textAlign: "center" }}>
        {isConnected ? (
          <Fragment>
            <p>{address}</p>
            <button onClick={() => activeConnector?.disconnect()}>
              Disconnect
            </button>
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
