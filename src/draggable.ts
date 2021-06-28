import { expectEls, createUnsubs, expectEl } from "./util";

export function setupDraggable(): () => void {
    const draggableEls = expectEls(".draggable");

    const unsubs = createUnsubs();

    for (const draggableEl of draggableEls) {
        const handleEl = expectEl(".draggable__handle", draggableEl);
        unsubs.add(setupDraggableListeners(draggableEl, handleEl));
    }

    return unsubs.unsubAll;
}

function setupDraggableListeners(
    draggableEl: HTMLElement,
    handleEl: HTMLElement,
): () => void {
    const unsubs = createUnsubs();

    const state = {
        isDragging: false,
        mouseOffset: {
            x: 0,
            y: 0,
        },
    };

    const onMouseDown = (event: MouseEvent) => {
        state.isDragging = true;
        draggableEl.classList.add("--dragging");

        const draggablePos = {
            x: parseInt(draggableEl.style.left) ?? 0,
            y: parseInt(draggableEl.style.top) ?? 0,
        };
        const mousePos = {
            x: event.pageX,
            y: event.pageY,
        };
        state.mouseOffset = {
            x: draggablePos.x - mousePos.x,
            y: draggablePos.y - mousePos.y,
        };
    };

    const onMouseUp = (event: MouseEvent) => {
        state.isDragging = false;
        draggableEl.classList.remove("--dragging");
    };

    const onMouseMove = (event: MouseEvent) => {
        if (!state.isDragging) {
            return;
        }

        const mousePos = {
            x: event.pageX,
            y: event.pageY,
        };

        const pos = {
            x: mousePos.x + state.mouseOffset.x,
            y: mousePos.y + state.mouseOffset.y,
        };

        draggableEl.style.left = `${pos.x}px`;
        draggableEl.style.top = `${pos.y}px`;
    };

    handleEl.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    unsubs.add(() => handleEl.removeEventListener("mousedown", onMouseDown));
    unsubs.add(() => document.removeEventListener("mouseup", onMouseUp));
    unsubs.add(() => document.removeEventListener("mousemove", onMouseMove));

    return unsubs.unsubAll;
}
