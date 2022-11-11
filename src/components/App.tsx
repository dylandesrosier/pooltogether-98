import { h } from "preact";
import { Route, Router } from "preact-router";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  WagmiConfig,
  createClient,
  configureChains,
  defaultChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import "98.css";

const { chains, provider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
});

// Code-splitting is automated for `routes` directory
import PoolTogether from "../routes/PoolTogether";

const App = () => (
  <div id="app">
    <WagmiConfig client={client}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Router>
          <Route path="/pt" component={PoolTogether} />
        </Router>
      </div>
    </WagmiConfig>
  </div>
);

export default App;
