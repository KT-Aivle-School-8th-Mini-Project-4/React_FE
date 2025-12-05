import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// document.getElementById("root") 뒤에 있던 느낌표(!)를 제거했습니다.
createRoot(document.getElementById("root")).render(<App />);