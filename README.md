# Tact template project

This template comes pre-configured to kickstart your new Tact project. It includes the Tact compiler, TypeScript, Jest integrated with [Sandbox](https://github.com/ton-org/sandbox), and a sample demonstrating how to run tests.

## How to use

First, let's install all the dependencies:

```shell
yarn install
```

Now we're ready to build our contract:

```shell
yarn build
```

Once you've built our contract, you can deploy it:

```shell
yarn deploy
```

Let's look at some other useful commands.

To test your contract after changes, run:

```shell
yarn test
```

If you want to quickly check your changes for validity, run:

```shell
yarn lint
```

This check will run the Tact source code formatter in the style checking mode and the [misti](https://github.com/nowarp/misti) static analyzer to check for common issues.

If you'd like to format the Tact source code in the [sources](./sources) directory, run:

```shell
yarn fmt
```

## Deployment

To deploy a contract, follow these steps:

1. Define the [`contract.tact`](./sources/contract.tact) file that will be used as entry point of your contract.
2. Customize the [`contract.deploy.ts`](./sources/contract.deploy.ts) file based on your `contract.tact` to generate a deployment link. It is crucial to ensure the proper invocation of the `init()` function within the contract.

If you rename `contract.tact`, be sure to update [`tact.config.json`](./tact.config.json) accordingly. For a description of `tact.config.json`, see the [Configuration page in the Tact documentation](https://docs.tact-lang.org/book/config).

## Testing

You can find some examples of contract tests in [`contract.spec.ts`](./sources/contract.spec.ts). For more information about testing, see the [Debugging and testing page in the Tact Documentation](https://docs.tact-lang.org/book/debug).

To add new test files to your contracts, create `*.spec.ts` files similar to the template's one. They will be automatically picked up by the testing commands, such as `yarn test`.

## License

[MIT](./LICENSE)
