import { COLOR_BLUE, COLOR_PURPLE, COLOR_RED, COLOR_WHITE, COLOR_YELLOW } from "../config";
import { getColor, setColor } from "../modules/entity/components/color";
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

function createButton(id: string, tint: number[] = COLOR_WHITE, x = 0, y = 0) {
    return createEntity([
        id,
        {
            t: [, [x, y]],
            p: [[0, 0, 16]]
        },
        [
            [
                "up",
                {
                    t: [[16, 16]],
                    s: ["btn", 32, 32, 0, 1],
                    c: tint
                }
            ],
            [
                "bg",
                {
                    t: [[16, 16]],
                    s: ["btn", 32, 32, 0, 0],
                    c: tint
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
        const [idx, btn, gap] = getCurrentData(0.1)
        setScale(up, down ? 0.9 : 1)
        if (down && id & btn) {
            emit("hit", [idx, id, btn, gap])
            const bg = getEntity("bg", entity)!
            setColor(bg, COLOR_WHITE)
            await timer(0.15)
            setColor(bg, getColor(up))
        }
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
    addEntity(createButton("1", COLOR_RED, 0), container())
    addEntity(createButton("2", COLOR_YELLOW, 34), container())
    addEntity(createButton("4", COLOR_BLUE, 68), container())
    addEntity(createButton("8", COLOR_PURPLE, 102), container())
    on("up,down", onUpDown)
    on("pointer", onPointer)
}
