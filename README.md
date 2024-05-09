# GitHub Planning Poker

♣️ Planning poker for agile projects with GitHub integration.

Live on [https://planning.lars-rickert.de](https://planning.lars-rickert.de).

Build using the [Nuxt template](https://github.com/larsrickert/template-nuxt).

## Development setup

### Prerequisites

- [Node.js](https://nodejs.org/en) version as specified in [.node-version](./.node-version) file
- [pnpm](https://pnpm.io/) version as specified in [`package.json`](./package.json) field `packageManager`

### Setup

Make sure to install the dependencies:

```bash
pnpm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

### Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

### Unit tests

Run unit tests using [Vitest](https://vitest.dev):

```bash
pnpm run test
```

### Playwright tests

Run component/integration/e2e tests using [Playwright](https://playwright.dev):

```bash
pnpm run build
pnpm run test:playwright
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
