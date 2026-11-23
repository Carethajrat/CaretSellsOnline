# Caretsellsonline

Front end for an e-commerce store, built with React 18, Vite and Bootstrap 5.
Product data currently comes from the public [DummyJSON](https://dummyjson.com) API, so no API key or backend is needed to run it.

> Work in progress. Home (trending products) and product detail pages are built. Search, categories, cart and checkout are next.

## Run it

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## What is built

- **Home:** a "Trending" section showing top-rated products, with loading, empty and error states and a retry button.
- **Product detail** (`/products/:slug`): image gallery, price and stock, quantity validation, add-to-cart form, specs list, and "not found" and error pages.
- **Shared layout:** skip link, header with search form and cart badge, responsive navigation, footer.

## How it is organised

```
src/
  api/          apiClient (the only place fetch is called), productService, productMapper
  config/       feed.js: feed URL and the "trending" rule
  hooks/        useTrendingProducts, useProduct: explicit loading | ready | empty | error states
  components/
    layout/     Layout, Header, Footer, SkipLink
    product/    ProductCard, ProductGallery, ProductPurchaseForm, ProductDetail, skeletons
    home/       TrendingProducts
  pages/        HomePage, ProductDetailPage, NotFoundPage
  utils/        formatPrice
```

Design choices worth a look:

- **One HTTP layer.** `apiClient.js` adds a rate cap, a short GET cache, request de-duplication and retry on 429. The third-party feed client never receives cookies or auth headers.
- **Data is mapped once.** `productMapper.js` converts the feed's shape into the app's own product shape (prices in minor units, stock status) and drops malformed items, so swapping in a real backend later changes one file.
- **Accessibility first.** Semantic landmarks, one `h1` per page, labelled form controls, error messages announced to screen readers, visible focus styles, 44px touch targets, text (not colour alone) for stock status, and reduced-motion support. Built with WCAG 2.1 AA in mind; not yet audited with a full tool pass.
- **BEM-style `cs-*` class names** on elements so CSS and JS hooks are easy to find.

## Roadmap

- Search with filters, sorting and pagination
- Category pages (Home & living, Electronics, Fashion, Sports & outdoors)
- Cart and checkout
- Express + Prisma backend replacing the DummyJSON feed

## Notes

- Prices show in USD because that is what the DummyJSON feed returns.
- Product images load from DummyJSON's CDN.

## Demonstration of the working of the app

## Homepage, Trending products

<img width="1346" height="712" alt="Screenshot 2026-11-23 092736" src="https://github.com/user-attachments/assets/b22b6bf9-4622-44f4-b77a-0b64a356941a" />
<img width="1351" height="563" alt="Screenshot 2026-11-23 092834" src="https://github.com/user-attachments/assets/3e1b4ca7-9e95-420b-aabd-ab2219cab1ac" />
<img width="1356" height="715" alt="Screenshot 2026-11-23 092806" src="https://github.com/user-attachments/assets/58eb95c0-8de0-4337-9527-9ad12a50ed62" />

## Product view

<img width="1356" height="713" alt="Screenshot 2026-11-23 092959" src="https://github.com/user-attachments/assets/87cfeae1-9440-4d7c-91f1-cd0838532a66" />
<img width="1354" height="712" alt="Screenshot 2026-11-23 092925" src="https://github.com/user-attachments/assets/598376a9-984a-4e6f-a52a-4295d4e14557" />
<img width="1350" height="706" alt="Screenshot 2026-11-23 092854" src="https://github.com/user-attachments/assets/7adbb78f-2d82-410f-bb7f-04f13e583e57" />

## Coming soon pages

<img width="1356" height="714" alt="Screenshot 2026-11-23 093229" src="https://github.com/user-attachments/assets/2158bca1-ff2a-48a4-8aa9-ba5c893c816d" />
<img width="1355" height="717" alt="Screenshot 2026-11-23 093214" src="https://github.com/user-attachments/assets/f0c58f19-abb5-428e-9213-46a15d5fdd04" />
<img width="1356" height="705" alt="Screenshot 2026-11-23 093108" src="https://github.com/user-attachments/assets/75d72d12-86ad-4520-93af-41818af0b05a" />
<img width="1352" height="710" alt="Screenshot 2026-11-23 093057" src="https://github.com/user-attachments/assets/1db85865-931a-4b7e-bab0-494f0a296a26" />
<img width="1356" height="711" alt="Screenshot 2026-11-23 093041" src="https://github.com/user-attachments/assets/2c2b355f-3d37-4fde-9dc0-fce747fe653e" />
