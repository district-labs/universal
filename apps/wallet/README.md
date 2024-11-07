# Universal Wallet Dashboard

The Universal Wallet dashboard a playground for the Universal Wallet SDK. It is a simple web application that allows users to interact with the Universal Wallet SDK and test its functionalities.

## Getting Started

Setup the `env` variables by copying the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Delegations API

Connect a Delegations API by setting the `NEXT_PUBLIC_DELEGATIONS_API_URL` environment variable.

```bash
# Example
NEXT_PUBLIC_DELEGATIONS_API_URL="http://localhost:8787"
```

By default will connect to the `http://localhost:8787` Delegations API when started locally.

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