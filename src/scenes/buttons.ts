import { LIGHT_CYAN, DARK_GREY, COLOR_HIGH, LIGHT_PURPLE, LIGHT_RED, COLOR_WHITE, LIGHT_YELLOW } from "../config";
import { setColor } from "../modules/entity/components/color";
import { isHover } from "../modules/entity/components/polygon";
import { setScale } from "../modules/entity/components/transform";
import { addEntity, createEntity, getChildren, getData, getEntity, getName, setData, TEntity } from "../modules/entity/entity";
import { emit, on, TEvent } from "../modules/event";
import input from "../modules/input";
import { timer } from "../modules/scheduler";
import { getCurrentData } from "./notes";

const container = () => getEntity("/btn")!
const buttons = () => getChildren(container())
const button = (i: number) => buttons()[i]

function createButton(id: string, tint: number[], x: number) {
    return createEntity([
        id,
        {
            t: [, [x, 0]],
            p: [[0, 0, 16]],
            c: tint
        },
        [
            [
                "up",
                {
                    t: [[16, 16]],
                    s: ["btn", 32, 32, 0, 1],
                }
            ],
            [
                "bg",
                {
                    t: [[16, 16]],
                    s: ["btn", 32, 32, 0, 0],
                }
            ]
        ]
    ])
}

async function setButton(entity: TEntity, down: boolean) {
    const data = getData(entity, false)
    if (down !== data) {
        setData(entity, down)
        const id = parseInt(getName(entity))
        const up = getEntity("up", entity)!
        const bg = getEntity("bg", entity)!
        const [idx, btn, len, gap] = getCurrentData(0.12)
        setScale(up, down ? 0.9 : 1)
        if (down) {
            const isHit = id & btn
            emit(isHit ? "hit" : "miss", [idx, id, btn, gap])
            setColor(bg, isHit ? COLOR_HIGH : DARK_GREY)
            await timer(len)
        }
        emit("release", [idx, id, btn, gap])
        setColor(bg, COLOR_WHITE)
    }
}

function onUpDown([key, event]: TEvent<string>) {
    const down = event !== "up"
    switch (key) {
        case "KeyF":
        case "Digit1":
            setButton(button(0), down)
            break
        case "KeyG":
        case "Digit2":
            setButton(button(1), down)
            break
        case "KeyH":
        case "Digit3":
            setButton(button(2), down)
            break
        case "KeyJ":
        case "Digit4":
            setButton(button(3), down)
            break
    }
}

function onPointer() {
    for (const btn of buttons()) {
        setButton(btn, !!input("Tap") && isHover(btn))
    }
}

export function initButtons() {
    addEntity(createButton("1", LIGHT_RED, 0), container())
    addEntity(createButton("2", LIGHT_YELLOW, 34), container())
    addEntity(createButton("4", LIGHT_CYAN, 68), container())
    addEntity(createButton("8", LIGHT_PURPLE, 102), container())
    on("up,down", onUpDown)
    on("pointer", onPointer)
}
