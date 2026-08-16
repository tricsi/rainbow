import input from "."
import { raycast } from "../2d/context"
import { emit, on } from "../event"
import { DOC } from "../utils"

const POINTER: Map<number, number[]> = new Map<number, number[]>()

function update(e: PointerEvent, down?: number) {
    const id = e.pointerId
    if (down !== 0) {
        POINTER.set(id, raycast([e.clientX, e.clientY]))
    } else {
        POINTER.delete(id)
    }
    if (down === POINTER.size) {
        const target = `Tap`
        input(target, down)
        emit(down ? "down" : "up", target)
    }
    emit("pointer", POINTER)
}

on("contextmenu", (e: MouseEvent) => e.preventDefault(), DOC)
    ("pointermove", (e: PointerEvent) => update(e), DOC)
    ("pointerdown", (e: PointerEvent) => update(e, 1), DOC)
    ("pointerup", (e: PointerEvent) => update(e, 0), DOC)

export default POINTER
