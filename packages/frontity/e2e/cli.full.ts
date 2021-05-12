/* eslint-disable no-irregular-whitespace */
import execa from "execa";
import { readFile } from "fs-extra";
import { resolve as resolvePath } from "path";
import { testContainer } from "./utils";

// We need to set a high timeout because building the docker container and
// running `frontity create` takes a long time.
jest.setTimeout(180000);

beforeAll(async () => {
  if (process.env.CI) return;

  // Remove the built output
  await execa.command("rm -rf build", { stdio: "inherit" });

  // Compile the TS source to JS
  await execa.command("npm run build", { stdio: "inherit" });

  // Build the "base" docker image that contains our CLI
  await execa.command(`docker build -t frontity-cli .`, {
    stdio: "inherit",
  });
});

test.concurrent(
  "in container without git",
  testContainer(async ({ runCommand }) => {
    await runCommand(
      `node dist/src/cli/index.js create --no-prompt --theme @frontity/mars-theme test-frontity-app`
    );

    let output = await runCommand("ls -a test-frontity-app");
    expect(output).toMatchInlineSnapshot(`
        ".
        ..
        README.md
        favicon.ico
        frontity.settings.js
        node_modules
        package-lock.json
        package.json
        packages"
      `);

    output = await runCommand("tree test-frontity-app/packages/");
    expect(output).toMatchInlineSnapshot(`
      "test-frontity-app/packages/
      └── mars-theme
          ├── CHANGELOG.md
          ├── README.md
          ├── package.json
          ├── src
          │   ├── components
          │   │   ├── featured-media.js
          │   │   ├── header.js
          │   │   ├── index.js
          │   │   ├── link.js
          │   │   ├── list
          │   │   │   ├── index.js
          │   │   │   ├── list-item.js
          │   │   │   ├── list.js
          │   │   │   └── pagination.js
          │   │   ├── loading.js
          │   │   ├── menu-icon.js
          │   │   ├── menu-modal.js
          │   │   ├── menu.js
          │   │   ├── nav.js
          │   │   ├── page-error.js
          │   │   ├── post.js
          │   │   └── title.js
          │   └── index.js
          └── types.ts

      4 directories, 21 files"
    `);
  })
);

test.concurrent(
  "in container with git installed but git settings are missing",
  testContainer(async ({ runCommand }) => {
    await runCommand("apk add git");
    await runCommand(
      `node dist/src/cli/index.js create --no-prompt --theme @frontity/mars-theme test-frontity-app`,
      { stdio: "inherit" }
    );

    let output = await runCommand("ls -a test-frontity-app");

    // .git is missing because user needs to set author and email in git config
    expect(output).toMatchInlineSnapshot(`
      ".
      ..
      README.md
      favicon.ico
      frontity.settings.js
      node_modules
      package-lock.json
      package.json
      packages"
    `);

    output = await runCommand("tree test-frontity-app/packages/");
    expect(output).toMatchInlineSnapshot(`
      "test-frontity-app/packages/
      └── mars-theme
          ├── CHANGELOG.md
          ├── README.md
          ├── package.json
          ├── src
          │   ├── components
          │   │   ├── featured-media.js
          │   │   ├── header.js
          │   │   ├── index.js
          │   │   ├── link.js
          │   │   ├── list
          │   │   │   ├── index.js
          │   │   │   ├── list-item.js
          │   │   │   ├── list.js
          │   │   │   └── pagination.js
          │   │   ├── loading.js
          │   │   ├── menu-icon.js
          │   │   ├── menu-modal.js
          │   │   ├── menu.js
          │   │   ├── nav.js
          │   │   ├── page-error.js
          │   │   ├── post.js
          │   │   └── title.js
          │   └── index.js
          └── types.ts

      4 directories, 21 files"
    `);
  })
);

test.concurrent(
  "in a container with git installed and configured",
  testContainer(async ({ runCommand }) => {
    await runCommand("apk add git");
    await runCommand('git config --global user.email "user@frontity.com"');
    await runCommand('git config --global user.name "Test User"');

    await runCommand(
      `node dist/src/cli/index.js create --no-prompt --theme @frontity/mars-theme test-frontity-app`,
      { stdio: "inherit" }
    );

    let output = await runCommand("ls -a test-frontity-app");
    expect(output).toMatchInlineSnapshot(`
      ".
      ..
      .git
      .gitignore
      README.md
      favicon.ico
      frontity.settings.js
      node_modules
      package-lock.json
      package.json
      packages"
    `);

    output = await runCommand("tree test-frontity-app/packages/");
    expect(output).toMatchInlineSnapshot(`
      "test-frontity-app/packages/
      └── mars-theme
          ├── CHANGELOG.md
          ├── README.md
          ├── package.json
          ├── src
          │   ├── components
          │   │   ├── featured-media.js
          │   │   ├── header.js
          │   │   ├── index.js
          │   │   ├── link.js
          │   │   ├── list
          │   │   │   ├── index.js
          │   │   │   ├── list-item.js
          │   │   │   ├── list.js
          │   │   │   └── pagination.js
          │   │   ├── loading.js
          │   │   ├── menu-icon.js
          │   │   ├── menu-modal.js
          │   │   ├── menu.js
          │   │   ├── nav.js
          │   │   ├── page-error.js
          │   │   ├── post.js
          │   │   └── title.js
          │   └── index.js
          └── types.ts

      4 directories, 21 files"
    `);
  })
);

test.concurrent(
  "in a container with git installed and configured & when a git repo already exists",
  testContainer(async ({ runCommand }) => {
    await runCommand("apk add git");
    await runCommand('git config --global user.email "user@frontity.com"');
    await runCommand('git config --global user.name "Test User"');
    await runCommand("git init test-frontity-app");

    await runCommand(
      `node dist/src/cli/index.js create --no-prompt --theme @frontity/mars-theme test-frontity-app`,
      { stdio: "inherit" }
    );

    let output = await runCommand("ls -a test-frontity-app");
    expect(output).toMatchInlineSnapshot(`
      ".
      ..
      .git
      .gitignore
      README.md
      favicon.ico
      frontity.settings.js
      node_modules
      package-lock.json
      package.json
      packages"
    `);

    // The .gitignore should be the same as the template file
    const gitignore = await runCommand("cat test-frontity-app/.gitignore");
    expect(gitignore).toEqual(
      await readFile(
        resolvePath(__dirname, "../templates/gitignore-template"),
        {
          encoding: "utf8",
        }
      )
    );

    output = await runCommand("tree test-frontity-app/packages/");
    expect(output).toMatchInlineSnapshot(`
      "test-frontity-app/packages/
      └── mars-theme
          ├── CHANGELOG.md
          ├── README.md
          ├── package.json
          ├── src
          │   ├── components
          │   │   ├── featured-media.js
          │   │   ├── header.js
          │   │   ├── index.js
          │   │   ├── link.js
          │   │   ├── list
          │   │   │   ├── index.js
          │   │   │   ├── list-item.js
          │   │   │   ├── list.js
          │   │   │   └── pagination.js
          │   │   ├── loading.js
          │   │   ├── menu-icon.js
          │   │   ├── menu-modal.js
          │   │   ├── menu.js
          │   │   ├── nav.js
          │   │   ├── page-error.js
          │   │   ├── post.js
          │   │   └── title.js
          │   └── index.js
          └── types.ts

      4 directories, 21 files"
    `);
  })
);

test.concurrent(
  "in a container with git installed and configured & when a git repo and .gitignore already exist",
  testContainer(async ({ runCommand }) => {
    await runCommand("apk add git");
    await runCommand('git config --global user.email "user@frontity.com"');
    await runCommand('git config --global user.name "Test User"');
    await runCommand("git init test-frontity-app");

    // Create the .gitignore
    await runCommand('echo "test" > test-frontity-app/.gitignore');

    await runCommand(
      `node dist/src/cli/index.js create --no-prompt --theme @frontity/mars-theme test-frontity-app`,
      { stdio: "inherit" }
    );

    let output = await runCommand("ls -a test-frontity-app");
    expect(output).toMatchInlineSnapshot(`
      ".
      ..
      .git
      .gitignore
      README.md
      favicon.ico
      frontity.settings.js
      node_modules
      package-lock.json
      package.json
      packages"
    `);

    output = await runCommand("cat test-frontity-app/.gitignore");

    // The first line should be `test` because it was the "original" content of
    // the .gitignore file we created in the beginning of this test
    expect(output).toMatchInlineSnapshot(`
      "test
      node_modules
      build"
    `);

    output = await runCommand("tree test-frontity-app/packages/");
    expect(output).toMatchInlineSnapshot(`
      "test-frontity-app/packages/
      └── mars-theme
          ├── CHANGELOG.md
          ├── README.md
          ├── package.json
          ├── src
          │   ├── components
          │   │   ├── featured-media.js
          │   │   ├── header.js
          │   │   ├── index.js
          │   │   ├── link.js
          │   │   ├── list
          │   │   │   ├── index.js
          │   │   │   ├── list-item.js
          │   │   │   ├── list.js
          │   │   │   └── pagination.js
          │   │   ├── loading.js
          │   │   ├── menu-icon.js
          │   │   ├── menu-modal.js
          │   │   ├── menu.js
          │   │   ├── nav.js
          │   │   ├── page-error.js
          │   │   ├── post.js
          │   │   └── title.js
          │   └── index.js
          └── types.ts

      4 directories, 21 files"
    `);
  })
);
