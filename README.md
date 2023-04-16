# LiveG Docs
The LiveG Docs website and web app, providing documentation on LiveG's products and services.

Licensed by the [LiveG Open-Source Licence](LICENCE.md).

## Products database
Product information is stored in `data/products.json`, and contains various details for each product in each locale, such as product names, descriptions, docs URLs and more.

`data/searchindex.json` contains an index of searchable pages in LiveG Docs. This file is automatically updated by [@LiveGBot](https://github.com/LiveGBot) every day after reading `data/products.json`.
