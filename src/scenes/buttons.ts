import { COLOR_BLUE, COLOR_PURPLE, COLOR_RED, COLOR_WHITE, COLOR_YELLOW } from "../config";
import { isHover } from "../modules/entity/components/polygon";
import { setScale } from "../modules/entity/components/transform";
import { addEntity, createEntity, getChildren, getData, getEntity, setData, TEntity } from "../modules/entity/entity";
import { on, TEvent } from "../modules/event";
import input from "../modules/input";

const container = () => getEntity("game/btn")!
const buttons = () => getChildren(container())
const button = (i: number) => buttons()[i]

function createButton(tint: number[] = COLOR_WHITE, x = 0, y = 0) {
    return createEntity([
        ,
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

function setButton(entity: TEntity, down: boolean) {
    const data = getData(entity, false)
    if (down !== data) {
        setData(entity, down)
        setScale(getEntity("up", entity)!, down ? 0.9 : 1)
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
    addEntity(createButton(COLOR_RED, 0), container())
    addEntity(createButton(COLOR_YELLOW, 34), container())
    addEntity(createButton(COLOR_BLUE, 68), container())
    addEntity(createButton(COLOR_PURPLE, 102), container())
    on("up,down", onUpDown)
    on("pointer", onPointer)
}
