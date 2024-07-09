/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://docs.liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";
import Fuse from "./lib/fuse.esm.js";

export var ProductsViewScreen = astronaut.component("ProductsViewScreen", function(props, children) {
    var searchInput = Input({type: "search", placeholder: _("productsView_search")}) ();

    var productsList = Section (
        Cards({mode: "grid"}) (
            ...Object.keys(props.products).map(function(productId) {
                var product = props.products[productId];
                var locale = product.name[props.locale] ? props.locale : product.fallbackLocale;

                var link = Link() (Text(product.name[locale]));

                var card = Card() (
                    Heading(2) (link),
                    Paragraph() (Text(product.description[locale]))
                );

                link.on("click", function(event) {
                    screen.emit("opendoc", {product: productId});
                });

                return card;
            })
        )
    );

    var searchResultsList = Section() ();

    searchResultsList.hide();

    var screen = Screen (
        Page(true) (
            Section (
                Container({attributes: {"aui-justify": "middle"}}) (
                    Heading({level: 1, styles: {fontSize: "4rem"}}) (
                        BrandWordmark(_("livegDocs")) (
                            Text(_("livegDocs_wordmark"))
                        )
                    ),
                    Paragraph() (_("productsView_tagline")),
                    searchInput
                )
            ),
            productsList,
            searchResultsList
        )
    );

    fetch("data/searchindex.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        var index = data.index.filter(function(entry) {
            return entry.locale == props.locale;
        }).map(function(entry) {
            var product = props.products[entry.productId];

            entry.productName = product.name[props.locale] || product.name[product.fallbackLocale];
            entry.url = `${product.docsRootUrl[props.locale] || product.docsRootUrl[product.fallbackLocale]}/${entry.page}`;

            return entry;
        });

        var searcher = new Fuse(index, {
            keys: ["pageName", "productName"]
        });

        searchInput.on("input", function() {
            var query = searchInput.getValue().trim();
            var results = searcher.search(query);
    
            if (query == "") {
                searchResultsList.hide();
                productsList.show();
    
                return;
            }

            if (results.length > 0) {
                searchResultsList.clear().add(
                    Cards() (
                        ...results.map(function(result) {
                            var data = result.item;

                            var link = Link() ();

                            link.setHTML(new showdown.Converter().makeHtml(data.pageName));
                            link.setHTML(link.find("p").getHTML());

                            var card = Card() (
                                Heading(2) (link),
                                Paragraph() (Text(data.productName))
                            );

                            link.on("click", function() {
                                screen.emit("opendoc", {product: data.productId, page: data.page});
                            });

                            return card;
                        })
                    )
                );
            } else {
                searchResultsList.clear().add(
                    Message() (
                        Icon("search", "dark embedded") (),
                        Heading(2) (_("productsView_noResults_title")),
                        Paragraph() (_("productsView_noResults_description"))
                    )
                );
            }
    
            productsList.hide();
            searchResultsList.show();
        });
    });

    return screen;
});