import { Color, Colors, Theme } from "./theme";
import { expectEl, expectEls, merge, RecursivePartial, ValueOf } from "./util";

export function setupEditor(theme: Theme): () => void {
    const rootEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");
    const editableEls = rootEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs: (() => void)[] = Array.from(editableEls)
        .map((el) => {
            const dataTheme = el.getAttribute("data-theme");

            if (dataTheme === null) {
                return null;
            }

            const [themePartKey, themeKey] = dataTheme.split(".");

            if (!themePartKey || !themeKey) {
                return null;
            }

            return setupElListener(el, editorEl, theme, themePartKey, themeKey);
        })
        .filter((u) => !!u) as (() => void)[];

    return () => unsubs.forEach((unsub) => unsub());
}

function setupElListener(
    editableEl: HTMLElement,
    editorEl: HTMLElement,
    theme: Theme,
    themePartKey: string,
    themeKey: string,
): (() => void) | null {
    if (
        !themePartKey ||
        !themeKey ||
        !(themePartKey in theme) ||
        !(theme as any)[themePartKey] ||
        !(themeKey in (theme as any)[themePartKey]) ||
        !(theme as any)[themePartKey][themeKey]
    ) {
        return null;
    }

    const listener = (event: MouseEvent) => {
        event.stopPropagation();

        const themePart = theme[themePartKey as keyof Theme];

        const themeValue = (themePart as any)[themeKey] as
            | undefined
            | Color
            | Colors;

        if (themeValue === undefined) {
            return;
        }

        openEditor(editorEl, event);

        const editorBar = expectEl(".window-bar", editorEl);
        editorBar.innerText = `${themePartKey} ${themeKey}`;

        const setTheme = (newTheme: RecursivePartial<Theme>) =>
            merge(theme, newTheme);

        let targetDataEditor: "color" | "colors";

        switch (typeof themeValue) {
            case "string": {
                targetDataEditor = "color";
                break;
            }
            case "object": {
                targetDataEditor = "colors";
                break;
            }
        }

        const editorInputEls = expectEls(".editor-input", editorEl);
        for (const editorEl of editorInputEls) {
            const dataEditor = editorEl.getAttribute("data-editor");
            if (dataEditor === null) {
                continue;
            }
            if (dataEditor === targetDataEditor) {
                editorEl.classList.remove("--hidden");
            } else {
                editorEl.classList.add("--hidden");
            }
        }

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            const dataEditorColor =
                inputColorEl.getAttribute("data-editor-color");
            if (dataEditorColor === null) {
                continue;
            }
            switch (dataEditorColor) {
                case "color": {
                    if (typeof themeValue === "string") {
                        inputColorEl.value = themeValue;
                    }
                    break;
                }
                case "border":
                case "background":
                case "text": {
                    if (typeof themeValue !== "string") {
                        inputColorEl.value = themeValue[dataEditorColor];
                    }
                    break;
                }
            }
        }
    };

    editableEl.addEventListener("click", listener);

    return () => editableEl.removeEventListener("click", listener);
}

function openEditor(editorEl: HTMLElement, event: MouseEvent) {
    const mousePos = {
        x: event.pageX,
        y: event.pageY,
    };

    editorEl.style.left = `${mousePos.x}px`;
    editorEl.style.top = `${mousePos.y}px`;

    editorEl.classList.add("--open");
}

function closeEditor(editorEl: HTMLElement) {
    editorEl.classList.remove("--open");
}
