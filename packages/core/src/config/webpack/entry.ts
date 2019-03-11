import { resolve } from "path";
import { Configuration } from "webpack";
import { Target, Mode } from "../../types";

export default ({
  target,
  mode
}: {
  target: Target;
  mode: Mode;
}): Configuration["entry"] => {
  // Use /client for both es5 and modules and /server for node.
  const name: "server" | "client" = target === "server" ? "server" : "client";

  let config: Configuration["entry"];

  if (target === "server") {
    config = resolve(__dirname, "../../../src/server");
  } else {
    config = {
      alternate: [resolve(__dirname, `../../../src/client/alternate`)],
      other: [resolve(__dirname, `../../../src/client`)]
    };
  }

  // This is needed for HMR in the client but only when we are in development.
  if (target !== "server" && mode === "development") {
    Object.values(config).forEach(entry => {
      // @ts-ignore
      entry.unshift("webpack-hot-middleware/client");
    });
  }
  return config;
};
