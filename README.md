# Roshni

Online store for Roshni unstitched fabrics. Built with Next.js (App Router). Orders are sent over WhatsApp and paid Cash on Delivery. There is no backend or database.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
npm run lint
```

## Environment setup

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Example | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `923001234567` | Where orders and chats are sent |
| `NEXT_PUBLIC_SITE_URL` | `https://roshni.pk` | Canonical links, Open Graph, Product JSON-LD |

Both values are read at **build time**, so rebuild (or restart `npm run dev`) after changing them.

## Changing the WhatsApp number

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`, or in your host's environment settings when you deploy. Use the international format with digits only: `92` + the number without its leading `0`. For example, `0300 1234567` becomes `923001234567`. Then rebuild.

## Adding a product

All products live in `lib/data.ts`. That file is the only place product data is stored.

1. Add your photos to `public/products/`. Use a 4:5 portrait ratio, around 1200×1500.
2. Add an entry to the `products` array:

```ts
{
  slug: "noor-lawn",                 // URL: /product/noor-lawn (must be unique)
  name: "Noor Lawn",
  collection: "summer-lawn",         // must match a slug in `collections`
  fabric: "Lawn",                    // one of the Fabric types
  lengths: [
    { label: "2.5m", price: 3200 },  // first option is the default and the "from" price
    { label: "3m", price: 3850 },
  ],
  images: ["/products/noor-1.jpg", "/products/noor-2.jpg"],
  description: "…",
  care: ["Hand wash cold", "Dry in shade"],
  inStock: true,
  addedAt: "2026-10-07",             // used for "Newest" sorting
},
```

3. Run `npm run build`. The product page, Open Graph image, JSON-LD, search, filters and related products all pick it up automatically.

To add a collection, add it to `collections` in the same file. To add a fabric type, extend the `Fabric` type and the `fabrics` array.

The current images are generated placeholder swatches (`scripts/make-swatches.mjs`). Replace them with real photos.

## Adding a payment gateway later

Every order goes through `placeOrder()` in `lib/checkout.ts`. To add a gateway:

1. Add a new value to the `payment` enum and to `paymentLabels`.
2. Add a branch in `placeOrder()` that creates the payment session and returns its `redirectUrl`.

The form, cart and success page do not need changes.
# Roshni
