/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";
import * as aside from "https://opensource.liveg.tech/Adapt-UI/src/aside.js";
import * as $g from "https://opensource.liveg.tech/Adapt-UI/src/adaptui.js";

window.$g = $g;

astronaut.unpack();

astronaut.component("ContentsNode", function(props, children, inter) {
    inter.pages = [];

    var node = Container() (
        Object.keys(props.data).map(function(key) {
            var data = props.data[key];

            if (typeof(data) == "object") {
                var childNode = ContentsNode({data}) ();

                inter.pages.push(...childNode.inter.pages);

                return Accordion (
                    Text(key),
                    childNode
                );
            }

            var page = Page() (
                Section (
                    SkeletonLoader("Loading article...") (
                        Heading(1) (),
                        astronaut.repeat(3, Paragraph() ()),
                        astronaut.repeat(3, Container (
                            Heading(2) (),
                            astronaut.repeat(3, Paragraph() ())
                        ))
                    )
                )
            );

            var button = PageMenuButton({page}) (Text(key));

            inter.pages.push(page);

            return button;
        })
    );

    return node;
});

astronaut.component("DocViewScreen", function(props, children) {
    var menu = PageMenu() ();
    var menuButton = IconButton("menu") ();

    var screen = Screen(true) (
        Header (
            menuButton,
            Text(props.productName)
        ),
        menu
    );

    menuButton.on("click", function() {
        menu.asideOpen();
    });

    fetch("https://raw.githubusercontent.com/LiveGTech/Adapt-UI/main/docs/en/contents.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        var contents = ContentsNode({data}) ();

        contents.inter.pages.map((page) => screen.add(page));

        menu.clear().add(contents);

        aside.addPages(menu.get());
    });

    return screen;
});

astronaut.render(DocViewScreen({
    productName: "Adapt UI",
    contents: {
        "Hello, world!": "test"
    }
}) ());