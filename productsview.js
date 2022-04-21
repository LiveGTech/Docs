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
                Heading() ("LiveG Docs"),
                Paragraph() ("Full product listing coming soon! In the mean time, take a look at Adapt UI's docs."),
                auiButton
            )
        )
    );

    auiButton.on("click", function() {
        screen.emit("opendoc", {product: "adaptui"})
    });

    return screen;
});