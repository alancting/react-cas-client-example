import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes";

import { CasUserContextProvider } from "./context/casUserContext";

const grommetTheme = deepMerge(grommet, {
  global: {
    colors: {
      focus: "#00000000",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={grommetTheme} full>
      <CasUserContextProvider>
        <App />
      </CasUserContextProvider>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
