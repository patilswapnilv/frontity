const { By } = require("selenium-webdriver");
const assert = require("assert");

describe("switch", function () {
  beforeEach(async function () {
    await driver.get(baseUrl + "/?frontity_name=switch");
  });

  it("should render last component when no matching component is found", async function () {
    assert.equal(
      await driver.findElement(By.id("default")).getText(),
      "Default"
    );
    assert(!(await driver.findElements(By.id("one"))).length);
    assert(!(await driver.findElements(By.id("two"))).length);
  });

  it("should render components with truthy condition", async function () {
    assert.equal(
      await driver.findElement(By.id("default")).getText(),
      "Default"
    );

    await driver.findElement(By.id("set-to-1")).click();
    assert.equal(await driver.findElement(By.id("one")).getText(), "One");
    assert(!(await driver.findElements(By.id("two"))).length);
    assert(!(await driver.findElements(By.id("default"))).length);

    await driver.findElement(By.id("set-to-2")).click();
    assert.equal(await driver.findElement(By.id("two")).getText(), "Two");
    assert(!(await driver.findElements(By.id("one"))).length);
    assert(!(await driver.findElements(By.id("default"))).length);
  });
});
