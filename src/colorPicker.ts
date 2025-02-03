import Coloris from "@melloware/coloris";

export function setupColorPicker() {
    Coloris.init();
    Coloris.coloris({
        el: ".input--color",
        alpha: false,
        wrap: true,
        selectInput: true,
        themeMode: "auto",
    });
}
