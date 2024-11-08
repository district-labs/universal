# Delegations API

The Delegations API is a service that allows users to write and read offchain delegations.

## Getting Started

Setup the `env` variables by copying the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Database

Connect a PostgreSQL database by setting the `DELEGATIONS_DATABASE_URL` environment variable.

```bash
# Example
DELEGATIONS_DATABASE_URL="postgresql://localhost:5432/delegations-api"
```


## Developer

### Develop

To develop the app, run the following command:

```bash
pnpm dev
```

### Start

To start the app, run the following command:

```bash
pnpm start
```

## Core Contributors

- [Vitor Marthendal](https://x.com/VitorMarthendal) | [District Labs, Inc](https://www.districtlabs.com/)
- [Kames Geraghty](https://x.com/KamesGeraghty) | [District Labs, Inc](https://www.districtlabs.com/)

## License

This project is licensed under MIT. See the [LICENSE](./LICENSE) file for more details.