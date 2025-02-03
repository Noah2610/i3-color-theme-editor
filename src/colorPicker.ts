import Coloris from "@melloware/coloris";
import { expectEls } from "./util";

const SELECTOR = ".input--color";

export function setupColorPicker() {
    Coloris.init();
    Coloris.coloris({
        el: SELECTOR,
        alpha: false,
        wrap: true,
        selectInput: true,
        themeMode: "auto",
    });
}

export function updateColorPickerInputs(editorEl: HTMLElement) {
    for (const inputEl of expectEls(SELECTOR, editorEl)) {
        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
}
