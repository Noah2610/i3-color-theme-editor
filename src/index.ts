import { applyTheme } from "./applyTheme";
import { createTheme } from "./createTheme";
import { merge } from "./util";

function main() {
    const theme = merge(createTheme(), {
        bar: {
            background: "lightgray",
            statusline: "rebeccapurple",
            separator: "green",

            focused_background: {
                background: "#21242b",
                text: "#ffffff",
                border: "#ff0000",
            },
        },
    });
    applyTheme(theme);

    console.log(theme);
}

window.onload = main;
