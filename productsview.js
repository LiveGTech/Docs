/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://docs.liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

export var ProductsViewScreen = astronaut.component("ProductsViewScreen", function(props, children) {
    var screen = Screen (
        Page(true) (
            Section (
                Container({attributes: {"aui-justify": "middle"}}) (
                    Heading({level: 1, styles: {fontSize: "4rem"}}) (
                        BrandWordmark(_("livegDocs")) (
                            Text(_("livegDocs_wordmark"))
                        )
                    )
                ),
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
            )
        )
    );

    return screen;
});