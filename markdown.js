/*
    LiveG Docs

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

export function toHtml(contents) {
    return new showdown.Converter({
        tables: true
    }).makeHtml(contents);
}