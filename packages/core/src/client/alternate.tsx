import React, { FunctionComponent } from "react";
import { hydrate } from "react-dom";
import App, { Props } from "../app";
import _ from "lodash";

_.add(1, 2);

const render = (Component: FunctionComponent<Props>): void => {
  hydrate(
    <Component bundle="alternate" />,
    window.document.getElementById("root")
  );
};

declare global {
  interface NodeModule {
    hot: {
      accept(dependency: string, callback: () => void): void;
    };
  }
}

if (process.env.NODE_ENV === "development" && module["hot"]) {
  module["hot"].accept("../app", () => {
    const App = require("../app").default;
    render(App);
  });
}

render(App);
