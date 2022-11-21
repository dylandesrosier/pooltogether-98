import { h } from "preact";
import WalletConnection from "../../components/WalletConnection";
import Balance from "./Balance";

const PoolTogether = () => (
  <div style={{ maxWidth: 500 }} className="window">
    <div className="title-bar">
      <div className="title-bar-text">PoolTogether</div>
      <div className="title-bar-controls">
        <button disabled={true} aria-label="Minimize" />
        <button disabled={true} aria-label="Maximize" />
        <button disabled={true} aria-label="Close" />
      </div>
    </div>
    <div class="window-body">
      <WalletConnection />
      <Balance />
    </div>
  </div>
);

export default PoolTogether;
