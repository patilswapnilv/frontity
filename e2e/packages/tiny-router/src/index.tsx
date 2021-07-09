import * as React from "react";
import TinyRouterTests, { Packages } from "../types";
import { css, connect } from "frontity";
import { Connect } from "frontity/types";

/**
 * A React component that contains some routes and some buttons to toggle
 * between them.
 *
 * @param props - The store injected by `connect`.
 *
 * @returns React element.
 */
const Root: React.FC<Connect<Packages>> = ({ state, actions }) => {
  return (
    <>
      <button
        data-button-id="switch-to-home"
        onClick={() => {
          actions.router.set("/");
        }}
      >
        Home
      </button>

      <button
        data-button-id="switch-to-about"
        onClick={() => {
          actions.router.set("/about/");
        }}
      >
        About (with trailing slash)
      </button>

      <button
        data-button-id="switch-to-about-no-trailing"
        onClick={() => {
          actions.router.set("/about");
        }}
      >
        About (without trailing slash)
      </button>

      <button
        data-button-id="switch-using-push"
        onClick={() => {
          actions.router.set("/about", { method: "push" });
        }}
      >
        About (push)
      </button>

      <button
        data-button-id="switch-using-replace"
        onClick={() => {
          actions.router.set("/about", { method: "replace" });
        }}
      >
        About (replace)
      </button>

      <button
        data-button-id="switch-to-privacy-using-replace"
        onClick={() => {
          actions.router.set("/privacy", { method: "replace" });
        }}
      >
        Privacy (replace)
      </button>

      <button
        data-button-id="switch-using-state"
        onClick={() => {
          actions.router.set("/about", { state: { hasState: true } });
        }}
      >
        About (with state)
      </button>

      <a
        data-link-id="switch-using-relative-link"
        href="/about/?frontity_name=tiny-router"
      >
        Relative link for SSR
      </a>

      {state.router.link === "/" && <div data-test-id="content">Home</div>}

      {state.router.link === "/about/" && (
        <div data-test-id="content">About</div>
      )}

      {state.router.link === "/privacy/" && (
        <div data-test-id="content">Privacy</div>
      )}

      {state.router.state.hasState && (
        <div data-test-id="has-state">Router has state!</div>
      )}

      <a
        data-link-id="hash-link"
        href="#hash-element"
        css={css`
          display: block;
        `}
      >
        Visit #hash-element
      </a>

      <div
        id="hash-element"
        css={css`
          margin-top: 100vh;
        `}
      >
        This is #hash-element
      </div>
    </>
  );
};

const tinyRouterTests: TinyRouterTests = {
  name: "e2e-tiny-router",
  roots: {
    tinyRouterTests: connect(Root),
  },
};

export default tinyRouterTests;
