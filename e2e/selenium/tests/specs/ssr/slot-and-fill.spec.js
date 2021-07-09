const { By } = require("selenium-webdriver");
const assert = require("assert");

describe("slot-and-fill", function () {
  beforeEach(async function () {
    await driver.get(baseUrl + "/?frontity_name=slot-and-fill");
  });

  it("should show empty slots and SSR", async function () {
    assert.equal(
      await driver.findElement(By.id("useFills-slot1-empty")).getText(),
      "useFills slot 1 empty"
    );
    assert.equal(
      await driver.findElement(By.id("useFills-slot2-empty")).getText(),
      "useFills slot 2 empty"
    );
    assert.equal(
      await driver.findElement(By.id("SSRFill")).getText(),
      "I am SSRFill"
    );
  });
});
