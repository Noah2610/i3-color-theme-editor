import { setupColorPicker } from "./colorPicker";
import { setupContext } from "./context";
import { createUnsubs } from "./util";

function main() {
    const unsubs = createUnsubs();

    setupColorPicker();
    unsubs.add(setupContext());

    window.onbeforeunload = unsubs.unsubAll;
}

window.onload = main;
