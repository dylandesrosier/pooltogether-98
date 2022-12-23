import { h } from "preact";
import { BLOCK_EXPLORER_URLS } from "../constants/network";

export const BlockExplorerLink = (props: {
  className?: string;
  chainId: number;
  hash: string;
}) => (
  <a
    className={props.className}
    href={`${BLOCK_EXPLORER_URLS[props.chainId]}/tx/${props.hash}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    Block Explorer
  </a>
);
