/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as $g from "https://opensource.liveg.tech/Adapt-UI/src/adaptui.js";
import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";
import * as l10n from "https://opensource.liveg.tech/Adapt-UI/src/l10n.js";

window.$g = $g;

astronaut.unpack();

import * as docView from "./docview.js";
import * as productsView from "./productsview.js";

astronaut.render(Screen(true) (
    Header() (),
    PageMenu() (),
    Page(true) ()
));

$g.waitForLoad().then(function() {
    fetch("products.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        var productId = $g.core.parameter("product");
        var startingPage = $g.core.parameter("page") || "index.md";
        var docViewContainer = Container() ();
        var docViewScreen = Screen() ();
        var productsViewScreen = productsView.ProductsViewScreen() ();

        function setDocViewScreen() {
            var currentProduct = data.products[productId] || null;
            var locale = l10n.getSystemLocaleCode();
    
            if (!currentProduct.name[locale]) {
                locale = currentProduct.fallbackLocale || "en_GB";
            }
    
            docViewScreen = docView.DocViewScreen({
                productId,
                startingPage,
                product: currentProduct,
                locale
            }) ();

            docViewScreen.on("showproducts", function() {
                productsViewScreen.screenBack();
            });

            docViewContainer.clear().add(docViewScreen);
        }

        console.log(docViewContainer);
        docViewContainer.setStyle("position", "relative");

        productsViewScreen.on("opendoc", function(event) {
            productId = event.detail.product;
            startingPage = "index.md";

            setDocViewScreen();
            docViewScreen.screenForward();
        });

        if (productId != null) {
            setDocViewScreen();

            docViewScreen.show();
        } else {
            productsViewScreen.show();
        }

        astronaut.render(Container() (
            productsViewScreen,
            docViewContainer
        ));
    });
});