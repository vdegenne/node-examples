# node-typescript-starter

A starter you can use to start a node project that uses typescript as the compilation environment.

## Installation

You can use the the classic `git clone`
```bash
$ git clone https://github.com/vdegenne/node-typescript-starter.git <project-name>
$ cd <project-name>
```

But it's not recommended because this will fetch the last state of the repo, hence it could be buggy if some changes occur. Instead download from the *release section* of github or use [github-fetch-starter](https://github.com/vdegenne/github-fetch-starter.git),

```bash
$ github-fetch-starter -n <project-name> node-typescript-starter
$ cd <project-name>
```

`github-fetch-starter` lets you download the last release. This ensures the state of the starter never contains bugs and omits the `.git` directory.


## Post-Installation

After the download. You have to install the dependencies (not included for making the release small).

```bash
$ yarn install
```

Now that the dependencies are installed, you can start to modify the tests (under `\src\test`) and the sources (under `\src`). Small chunks have been left intentionnally for you to have an idea how to write a test and start the code.

Once you are ready to try some tests, run `yarn test:watch` in a separate command line. This will respond to any further changes you make in the `src` directory, run `tsc` and `mocha` subsequently.

*Don't forget this readme is the readme of your project now so you have to remove all the content and replace with your application instructions*

## Additional notes

- Don't forget to change the `"typings"` json key in `package.json` if you change the main declaration file (originally `app.d.ts` from `app.ts`).

- you can remove `remove.this.file` in `custom_typings`, this file was added to force git to send the `custom_typings` which is handful when you have to add some styles from modules that doesn't provide declaration files of their APIs.
