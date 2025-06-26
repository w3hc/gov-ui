# Gov UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/5acc7402-345c-415d-8686-9adb00f7a030/deploy-status)](https://app.netlify.com/projects/gov-ui/deploys)

An interface for your DAO.

The goal is to provide an interface that's easy to deploy. Ideally 1 click for Gov Solidity contracts, 1 click for this interface.

Live at **[https://gov-ui.netlify.app/](https://gov-ui.netlify.app/)**

See also:

- [Gov Solidity contracts](https://github.com/w3hc/gov)
- [Documentation](https://w3hc.github.io/gov-docs/)
- [Gov Deployer](https://github.com/w3hc/gov-deployer)

## Install

```bash
pnpm install
```

## Run

Create a `.env` on the model of `.env.template`:

```sh
cp .env.template .env
```

Add your own keys in your `.env` file, then:

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Use as a template

You can use this repo as a template for your own DAO.

You can replace the `GOV_CONTRACT_ADDRESS` in the [`config.ts`](https://github.com/w3hc/gov-ui/blob/main/src/utils/config.ts) file. Also, make sure the network id is correct everywhere in the app (in [`index.ts`](https://github.com/w3hc/gov-ui/blob/main/src/pages/index.tsx#L51), but also in [`proposal/\[proposalId\].tsx`](https://github.com/w3hc/gov-ui/blob/main/src/pages/proposal/%5BproposalId%5D.tsx#L109)).

## Includes

- [Next.js](https://nextjs.org/docs)
- [Chakra UI](https://chakra-ui.com/)
- [Ethers v6](https://docs.ethers.org/v6/)
- [Web3Modal SDK from WalletConnect](https://docs.walletconnect.com/)
- [Subgraph](https://thegraph.com/docs/en/)
- [next-SEO](https://github.com/garmeeh/next-seo)
- [TypeScript](https://www.typescriptlang.org/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

## Support

You can contact me via [Element](https://matrix.to/#/@julienbrg:matrix.org), [Farcaster](https://warpcast.com/julien-), [Telegram](https://t.me/julienbrg), [Twitter](https://twitter.com/julienbrg), [Discord](https://discordapp.com/users/julienbrg), or [LinkedIn](https://www.linkedin.com/in/julienberanger/).
