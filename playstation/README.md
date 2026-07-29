# PlayStation Store for Microsoft Fabric

A PlayStation-inspired storefront built as a Rayfin app for Microsoft Fabric.
It recreates the PlayStation Store browsing experience with a responsive sale
hero, UAE game catalogue, search, filters, product details, wishlist, shopping
bag, and checkout flow.

## Live app

- Fabric workspace: `Testing-Fabric-Trial`
- Fabric app item: `playstation-store`
- Hosted app: <https://curly-birch-cf8d0d13e3-centralus.webapp.fabricapps.net>

## Features

- PlayStation-style responsive storefront and navigation
- Summer Sale hero and UAE game catalogue
- Game search and genre filters
- Product detail panels with pricing, platform, publisher, features, and rating
- Per-user wishlist and shopping bag
- Checkout and order creation
- Microsoft Fabric authentication
- Rayfin data persistence with user-scoped access policies

## Technology

- React 19 and TypeScript
- Vite
- Microsoft Rayfin
- Microsoft Fabric authentication and SQL data services
- Vitest and Testing Library

## Project structure

```text
playstation/
├── public/                  # Static artwork and social preview
├── rayfin/
│   ├── data/                # Product, cart, wishlist, and order entities
│   └── rayfin.yml           # Fabric service and hosting configuration
├── src/
│   ├── components/          # Authentication UI
│   ├── data/                # Store catalogue
│   ├── hooks/               # Authentication context
│   ├── pages/               # Storefront UI and interactions
│   ├── services/            # Rayfin auth and data integration
│   └── __tests__/           # Storefront and authentication tests
└── package.json
```

## Local development

Prerequisites:

- Node.js 20 or later
- Access to the configured Microsoft Fabric workspace
- Permission to use the `playstation-store` Fabric app item

```bash
npm install
npm run dev
```

The development server is available at <http://localhost:5173>.

## Build and test

```bash
npm run build
npm test
npm run lint
```

## Fabric deployment

Authenticate with Rayfin, apply the data schema when required, and deploy:

```bash
npx rayfin auth login
npm run rayfin:db
npx rayfin up staticapp deploy
```

The Fabric schema contains `Product`, `CartItem`, `WishlistItem`, and
`StoreOrder` entities. Cart, wishlist, and order records are scoped to the
signed-in user.

## Disclaimer

This is an independent demonstration project for Microsoft Fabric. It is not
affiliated with, endorsed by, or operated by Sony Interactive Entertainment.
PlayStation names and related marks belong to their respective owners.
