import React, { useState, FunctionComponent } from "react";
import loadable from "@loadable/component";

const Dynamic = loadable(() => import("./dynamic"));

export interface Props {
  bundle: "alternate" | "other";
}

const App: FunctionComponent<Props> = ({ bundle }) => {
  const [counter, setCounter] = useState(0);
  return (
    <>
      <div>
        Hello World from React: {bundle} {counter}
      </div>
      <button onClick={() => setCounter(counter + 1)}>click</button>
      <Dynamic />
    </>
  );
};

export default App;
