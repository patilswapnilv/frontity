const assert = require("assert");

describe("Global", function () {
  it("should have a blue background, but not a red color", async function () {
    await driver.get(baseUrl + "/color-red?frontity_name=emotion");
    await driver.get(baseUrl + "/background-blue?frontity_name=emotion");
    assert.equal(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("body"))["backgroundColor"]'
      ),
      "rgb(0, 0, 255)"
    );
    assert.notEqual(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("body"))["color"]'
      ),
      "rgb(255, 0, 0)"
    );
  });

  it("should have a red color, but not a blue background", async function () {
    await driver.get(baseUrl + "/background-blue?frontity_name=emotion");
    await driver.get(baseUrl + "/color-red?frontity_name=emotion");
    assert.notEqual(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("body"))["backgroundColor"]'
      ),
      "rgb(0, 0, 255)"
    );
    assert.equal(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("body"))["color"]'
      ),
      "rgb(255, 0, 0)"
    );
  });
});

describe("styled", function () {
  it("should have a red color", async function () {
    await driver.get(baseUrl + "/styled-css?frontity_name=emotion");
    assert.equal(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("[data-test-id=\'styled-div\']"))["color"]'
      ),
      "rgb(255, 0, 0)"
    );
  });
});

describe("css", function () {
  it("should have a red color", async function () {
    await driver.get(baseUrl + "/styled-css?frontity_name=emotion");
    assert.equal(
      await driver.executeScript(
        'return window.getComputedStyle(document.querySelector("[data-test-id=\'css-div\']"))["color"]'
      ),
      "rgb(255, 0, 0)"
    );
  });
});
