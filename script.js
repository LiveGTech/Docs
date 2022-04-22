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

$g.waitForLoad().then(function() {
    return $g.l10n.selectLocaleFromResources({
        "en_GB": "locales/en_GB.json"
    });
}).then(function(locale) {
    window._ = function() {
        return locale.translate(...arguments);
    };

    fetch("products.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        var productId = $g.core.parameter("product");
        var startingPage = $g.core.parameter("page") || "index.md";
        var docViewContainer = Container() ();
        var docViewScreen = Screen() ();
        var productsViewScreen = productsView.ProductsViewScreen({products: data.products, locale: l10n.getSystemLocaleCode()}) ();
        var isOpeningDocView = false;

        function setDocViewScreen() {
            var currentProduct = data.products[productId] || null;
    
            docViewScreen = docView.DocViewScreen({
                productId,
                startingPage,
                product: currentProduct,
                locale: l10n.getSystemLocaleCode()
            }) ();

            docViewScreen.on("showproducts", function() {
                $g.sel("title").setText(_("livegDocs"));

                window.history.pushState({}, window.title, "/");

                productsViewScreen.screenBack();
            });

            docViewContainer.clear().add(docViewScreen);
        }

        docViewContainer.setStyle("position", "relative");

        productsViewScreen.on("opendoc", function(event) {
            if (isOpeningDocView) {
                return;
            }

            isOpeningDocView = true;
            productId = event.detail.product;
            startingPage = "index.md";

            setDocViewScreen();
            docViewScreen.screenForward().then(function() {
                isOpeningDocView = false;
            });
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