# Anas Online Shop

Anas Online Shop is a responsive, Arabic right-to-left (RTL) storefront for browsing mobile phones, electronics, and home appliances. The catalog is built from the product data and product images included in this repository.

## Project Overview

The original project had an almost empty HTML page, empty CSS and JavaScript files, and an incorrect stylesheet path. As a result, the storefront, product catalog, and interactions were not available.

The project now includes a complete storefront interface, loads its catalog from `products.json`, uses the supplied images in `img/`, and provides client-side search, category filters, sorting, favorites, and a shopping cart. The stylesheet path has also been corrected.

## Languages and Technologies

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure, accessible controls, and Arabic RTL document layout. |
| CSS3 | Visual design, responsive layouts, animations, and mobile breakpoints. |
| Vanilla JavaScript (ES6+) | Fetching product data and implementing search, filters, sorting, favorites, cart, and newsletter interactions. No JavaScript framework is used. |
| JSON | Product catalog data, including names, image paths, categories, prices, and optional previous prices. |
| Google Fonts | IBM Plex Sans Arabic and DM Sans typography, loaded remotely with local font fallbacks. |

## Platform and Architecture

- **Application type:** Static, client-side website.
- **Development environment:** The project can be edited in any code editor; Visual Studio Code with the Live Server extension is one convenient option.
- **Runtime:** A modern web browser. A local HTTP server is required during development because the page fetches `products.json`.
- **Hosting:** GitHub Pages can host the project directly from the repository root. Any static web host can also serve it.
- **Backend and database:** None. There is no API server, database, build step, or package installation required.
- **Persistence:** Cart and favorite selections are stored in the browser's `localStorage` on the current device and browser.

## Repository Structure

```text
.
├── index.html             Storefront markup and page sections
├── products.json          Product catalog data
├── README.md              Project documentation
├── css/
│   └── style.css          Design system and responsive styles
├── javascript/
│   └── main.js            Catalog loading and client-side interactions
└── img/
    ├── product/           Product images referenced by products.json
    ├── logo.png           Original brand image asset
    ├── icon.png            Store icon used with the Anas wordmark
    └── ...                Banner, payment, and other supplied image assets
```

## Features

- Arabic RTL interface with layouts for desktop and mobile screens.
- Product cards generated from `products.json` and the supplied product images.
- Search by product name or category.
- Category filtering for phones, electronics, and home appliances, plus a deals filter.
- Sorting by price or product name.
- Favorites with saved state in browser storage.
- Shopping cart with quantity controls, item removal, and a calculated subtotal.
- “Load more” product browsing and an empty-results state.
- Newsletter form with an on-page confirmation message.

## Requirements

- A modern web browser.
- A local HTTP server for development. Python or Node.js can be used, or install the Live Server extension in Visual Studio Code.
- No dependencies need to be installed for the site itself.

Do not open `index.html` directly using a `file://` URL. Browsers commonly block the `fetch()` request for `products.json` when a page is opened this way.

## Run Locally

Open PowerShell or a terminal in the project directory and run one of these commands.

### Python

```powershell
python -m http.server 8000
```

### Node.js

```powershell
npx --yes http-server -p 8000
```

Then visit:

```text
http://localhost:8000/
```

Alternatively, open the project folder in Visual Studio Code and select **Go Live** if the Live Server extension is installed.

## Product Data

Products are maintained in `products.json`. Each item has an `id`, `img`, `name`, `price`, and category. Items on sale may also include `old_price`. The existing catalog uses the legacy property name `catetory`; the JavaScript supports that spelling and the correctly spelled `category` property for future entries.

Prices are displayed in Saudi riyals (SAR). Update the JSON data and image paths to change the catalog. Keep product image files in the repository so the relative paths continue to work after deployment.

## Current Limitations

- Checkout is a demonstration only. No payment gateway or order submission service is connected.
- Account controls are placeholders; there is no user registration or authentication system.
- Newsletter signup only displays a confirmation in the browser. It does not submit or store email addresses on a server.
- Cart and favorites are local to the browser and are not synchronized between devices.
- Google Fonts require an internet connection to load; fallback fonts are used when they are unavailable.

## Deploy with GitHub Pages

1. Push the project files to a GitHub repository.
2. Open the repository's **Settings → Pages** page.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/(root)` folder, then click **Save**.
5. Wait for the deployment to finish. GitHub Pages will show the published website URL in the Pages settings.

Because this is a static website, GitHub Pages can serve it without a separate backend. Relative asset paths and the root-level `index.html` work with the standard Pages deployment.

## Publish Changes

```powershell
git add README.md
git commit -m "Update English project documentation"
git push origin main
```
