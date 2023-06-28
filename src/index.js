import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import CounterHookComponent from "./components/CounterHookComponent";

function App() {
  return (
    <div className="app">
      <CounterHookComponent />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
