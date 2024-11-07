# District Wallet Popup

The District Wallet Popup is a popup app to communicate with the `universal-wallet-sdk` package.

## Getting Started

Setup the `env` variables by copying the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Database

Connect a PostgreSQL database by setting the `DATABASE_URL` environment variable.

```bash
# Example
DATABASE_URL="postgresql://localhost:5432/district-wallet-popup"
```

### Pimlico Bundler

Connect the Pimlico Bundler by setting the `NEXT_PUBLIC_PIMLICO_API_KEY` environment variable.

```bash
# Example
NEXT_PUBLIC_PIMLICO_API_KEY="YOUR_PIMLICO_API_KEY"
```

Setup account at https://www.pimlico.io/ and create a new project to get the API key.

## Developer

### Develop

To develop the app, run the following command:

```bash
pnpm dev
```

### Build

To build the app, run the following command:

```bash
pnpm build
```

## Core Contributors

- [Vitor Marthendal](https://x.com/VitorMarthendal) | [District Labs, Inc](https://www.districtlabs.com/)
- [Kames Geraghty](https://x.com/KamesGeraghty) | [District Labs, Inc](https://www.districtlabs.com/)

## License

This project is licensed under MIT. See the [LICENSE](./LICENSE) file for more details.