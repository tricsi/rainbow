import { setAlpha, setVisible } from "./../modules/entity/components/color"
import {
    DARK_CYAN,
    DARK_GREY,
    COLOR_HIGH,
    DARK_PURPLE,
    DARK_RED,
    COLOR_WHITE,
    DARK_YELLOW,
    SPRITE_PTC
} from "../config"
import { setColor } from "../modules/entity/components/color"
import { isHover } from "../modules/entity/components/polygon"
import { setPosition, setRotate, setScale } from "../modules/entity/components/transform"
import {
    addEntity,
    createEntity,
    getChildren,
    getData,
    getEntity,
    getName,
    removeEntity,
    setData,
    TEntity
} from "../modules/entity/entity"
import { emit, on, TEvent } from "../modules/event"
import input from "../modules/input"
import { timer } from "../modules/scheduler"
import { pull } from "../modules/utils"
import { getCurrentData } from "./notes"
import { v2rotate } from "../modules/math/vec2"
import { rnd } from "../modules/math"
import { setSpeed } from "../modules/entity/components/body"

const container = () => getEntity("/btn")!
const buttons = () => getChildren(container())
const button = (i: number) => buttons()[i]
const pool: TEntity[][] = [[], [], [], []]

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
                    s: ["btn", 32, 32, 0, 1]
                }
            ],
            [
                "bg",
                {
                    t: [[16, 16]],
                    s: ["btn", 32, 32, 0, 0]
                }
            ],
            ["ptc"]
        ]
    ])
}

async function emitParticles(index: number) {
    const particles: TEntity[] = []
    for (let i = 0; i < 5; i++) {
        const particle = pull(pool[index], () => {
            const entity = createEntity([
                ,
                {
                    t: [[1.5, 1.5]],
                    b: [[0, 100]],
                    s: ["ptc", 3, 3, 1, 1],
                    c: COLOR_HIGH
                }
            ])
            addEntity(entity, getEntity("ptc", button(index))!)
            return entity
        })
        setScale(particle, 1)
        setPosition(particle, 0, -12)
        setSpeed(particle, ...v2rotate([0, -70 - rnd(50)], rnd() - 0.5), 3, rnd() - 0.5)
        setVisible(particle, true)
        particles.push(particle)
    }
    await timer(0.5, (t) => particles.forEach((entity) => setAlpha(entity, 1 - t * t)))
    particles.map((particle) => {
        setVisible(particle, false)
        pool[index].push(particle)
    })
}

async function setButton(index: number, down: boolean) {
    const entity = button(index)
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
            isHit && emitParticles(index)
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
            setButton(0, down)
            break
        case "KeyG":
        case "Digit2":
            setButton(1, down)
            break
        case "KeyH":
        case "Digit3":
            setButton(2, down)
            break
        case "KeyJ":
        case "Digit4":
            setButton(3, down)
            break
    }
}

function onPointer() {
    const entities = buttons()
    for (let i = 0; i < entities.length; i++) {
        setButton(i, !!input("Tap") && isHover(entities[i]))
    }
}

export function initButtons() {
    addEntity(createButton("1", DARK_RED, 0), container())
    addEntity(createButton("2", DARK_YELLOW, 34), container())
    addEntity(createButton("4", DARK_CYAN, 68), container())
    addEntity(createButton("8", DARK_PURPLE, 102), container())
    on("up,down", onUpDown)
    on("pointer", onPointer)
}
