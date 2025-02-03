export type TrapFocusState = {
    trappedEl: HTMLElement;
    restoreEl: HTMLElement | null;
    untrap: () => void;
};

type TrapFocusOptions = {
    focusFirst?: boolean;
};

const DEFAULT_OPTIONS: Required<TrapFocusOptions> = {
    focusFirst: true,
};

export function untrapFocus(state: TrapFocusState) {
    state.untrap();
    state.restoreEl?.focus();
}

/* https://hidde.blog/using-javascript-to-trap-focus-in-an-element/#heading-5 */
export function trapFocus(
    element: HTMLElement,
    _options?: TrapFocusOptions,
): TrapFocusState | null {
    const options = { ...DEFAULT_OPTIONS, ..._options };

    const restoreEl = document.activeElement as HTMLElement | null;

    const focusableEls = element.querySelectorAll<HTMLElement>(
        `:not(.--hidden) > :not([disabled], .--hidden):is(
            [tabindex="0"],
            a[href],
            button,
            textarea,
            select,
            input,
            input:is(
                [type="text"],
                [type="radio"],
                [type="checkbox"],
                [type="color"]
            )
        )`,
    );
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    if (!firstFocusableEl || !lastFocusableEl) {
        console.error("[trapFocus] No focusable elements found");
        return null;
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.code !== "Tab") {
            return;
        }

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableEl) {
                lastFocusableEl.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableEl) {
                firstFocusableEl.focus();
                e.preventDefault();
            }
        }
    };

    if (options.focusFirst) {
        firstFocusableEl.focus();
    }

    element.addEventListener("keydown", onKeydown);

    return {
        trappedEl: element,
        restoreEl,
        untrap: () => element.removeEventListener("keydown", onKeydown),
    };
}
