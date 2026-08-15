import input from "."
import { raycast } from "../2d/context"
import { emit, on } from "../event"
import { max } from "../math";
import { DOC, MOBILE } from "../utils"

const POINTER: number[][] = []

function update(e: MouseEvent | Touch | null, down?: number, index: number = 0) {
    e ? POINTER[index] = raycast([e.clientX, e.clientY]) : POINTER.splice(index, 1)
    if (down !== undefined) {
        const target = e instanceof MouseEvent ? `Mouse${e.button}` : `Touch${index}`
        if (input(target) !== down) {
            input(target, down)
            emit(down ? "down" : "up", target)
        }
    }
    emit("pointer", POINTER)
}

function updateTouches(touches: TouchList, down?: number) {
    for (let i = max(touches.length, POINTER.length) - 1; i >= 0; i--) {
        const item = touches.item(i)
        update(item, item ? down : 0, i)
    }
}

MOBILE()
    ? on("touchstart", (e: TouchEvent) => updateTouches(e.touches, 1), DOC)
        ("touchmove", (e: TouchEvent) => updateTouches(e.touches), DOC)
        ("touchend", (e: TouchEvent) => updateTouches(e.touches, 0), DOC)
    : on("contextmenu", (e: MouseEvent) => e.preventDefault(), DOC)
        ("mousemove", (e: MouseEvent) => update(e), DOC)
        ("mousedown", (e: MouseEvent) => update(e, 1), DOC)
        ("mouseup", (e: MouseEvent) => update(e, 0), DOC)

export default POINTER
