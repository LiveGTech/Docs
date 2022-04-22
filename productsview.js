/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";

export var ProductsViewScreen = astronaut.component("ProductsViewScreen", function(props, children) {
    // TODO: List all products and not just Adapt UI
    var auiButton = Button() ("See Adapt UI's docs");

    var screen = Screen (
        Page(true) (
            Section (
                Heading() (_("livegDocs")),
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

    auiButton.on("click", function() {
        screen.emit("opendoc", {product: "adaptui"})
    });

    return screen;
});