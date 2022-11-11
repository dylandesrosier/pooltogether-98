import { h } from "preact";
import { Link } from "preact-router/match";
import ConnectButton from "../WalletConnection";
import style from "./style.css";

const Header = () => (
  <header class={style.header}>
    <div>
      {/* <nav>
        <Link activeClassName={style.active} href="/">
          Home
        </Link>
        <Link activeClassName={style.active} href="/profile">
          Me
        </Link>
        <Link activeClassName={style.active} href="/profile/john">
          John
        </Link>
      </nav> */}
    </div>
  </header>
);

export default Header;
