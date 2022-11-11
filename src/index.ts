import "./style/index.css";
import "./style/utils.css";
import App from "./components/App";
import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

export default App;
