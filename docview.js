/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as $g from "https://opensource.liveg.tech/Adapt-UI/src/adaptui.js";
import * as astronaut from "https://opensource.liveg.tech/Adapt-UI/astronaut/astronaut.js";
import * as aside from "https://opensource.liveg.tech/Adapt-UI/src/aside.js";

export function getAllContentsPages(contents) {
    var pages = [];

    Object.keys(contents).forEach(function(key) {
        var data = contents[key];

        if (typeof(data) == "object") {
            pages.push(...getAllContentsPages(data));

            return;
        }

        pages.push(data);
    });

    return pages;
}

export var ContentsNode = astronaut.component("ContentsNode", function(props, children, inter) {
    inter.pages = [];

    var node = Container() (
        Object.keys(props.data).map(function(key) {
            var data = props.data[key];

            if (typeof(data) == "object") {
                var childNode = ContentsNode({
                    data,
                    productId: props.productId,
                    startingPage: props.startingPage,
                    root: props.root
                }) ();

                inter.pages.push(...childNode.inter.pages);

                return Accordion (
                    Text(key),
                    childNode
                );
            }

            var page = Page({showing: data == props.startingPage}) (
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

            page.inter.load = function() {
                $g.sel("title").setText(key);

                return fetch(`${props.root}/${data}`).then(function(response) {
                    return response.text();
                }).then(function(contents) {
                    var converter = new showdown.Converter();
                    var renderedContents = $g.create("section").setHTML(converter.makeHtml(contents));

                    renderedContents.find("a").getAll().forEach(function(link) {
                        var element = $g.sel(link);

                        if (element.getAttribute("href")?.match(/^([a-zA-Z-]+:)?\/\//)) {
                            element.setAttribute("target", "_blank");
                        } else {
                            element.setAttribute("href", `?product=${props.productId}&page=${element.getAttribute("href")}`);
                        }
                    });

                    renderedContents.find("img").getAll().forEach(function(link) {
                        var element = $g.sel(link);

                        if (!element.getAttribute("src")?.match(/^([a-zA-Z-]+:)?\/\//)) {
                            element.setAttribute("src", `${props.root}/${element.getAttribute("src")}`);
                        }
                    });

                    page.clear().add(renderedContents);

                    return Promise.resolve();
                });
            };

            if (data == props.startingPage) {
                page.inter.load();
            }

            inter.pages.push(page);

            if (key.startsWith("_")) {
                return null;
            }

            var button = PageMenuButton({page, selected: data == props.startingPage}) ();
            
            button.setHTML(new showdown.Converter().makeHtml(key));
            button.setHTML(button.find("p").getHTML());

            button.on("click", function() {
                page.inter.load();

                window.history.pushState({page: data}, window.title, `?product=${props.productId}&page=${data}`);
            });

            return button;
        }).filter((button) => button != null)
    );

    return node;
});

export var DocViewScreen = astronaut.component("DocViewScreen", function(props, children) {
    var menu = PageMenu() ();
    var menuButton = IconButton({icon: "menu", alt: "Show menu", attributes: {"aui-display": "mobile"}}) ();
    var productsButton = IconButton({icon: "products", alt: "Show products"}) ();

    var screen = Screen (
        Header (
            menuButton,
            Text(props.product.name[props.locale]),
            productsButton
        ),
        menu
    );

    menuButton.on("click", function() {
        menu.asideOpen();
    });

    productsButton.on("click", function() {
        screen.emit("showproducts");
    });
    
    fetch(`${props.product.docsRootUrl[props.locale]}/contents.json`).then(function(response) {
        return response.json();
    }).then(function(data) {
        if (!getAllContentsPages(data).includes(props.startingPage)) {
            data["_startingPage"] = props.startingPage;
        }

        var contents = ContentsNode({
            data,
            productId: props.productId,
            startingPage: props.startingPage,
            root: props.product.docsRootUrl[props.locale]
        }) ();

        contents.inter.pages.map((page) => screen.add(page));
        menu.clear().add(contents);

        aside.addPages(menu.get());

        menu.find("button[aui-selected]").ancestor("details").setAttribute("open", true);
    });

    return screen;
});