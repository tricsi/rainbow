import { COLOR_RAINBOW } from "../config"
import { setSpeed } from "../modules/entity/components/body";
import { setAlpha } from "../modules/entity/components/color"
import {
    getPosition,
    getScaleX,
    setPivot,
    setPosition
} from "../modules/entity/components/transform"
import { addEntity, createEntity, getChildren, getEntity } from "../modules/entity/entity"
import { on } from "../modules/event"
import { floor, irnd, rnd } from "../modules/math"
import { schedule, timer } from "../modules/scheduler"

const bg = () => getEntity("/bg")!
const particles = () => getChildren(bg())

function update() {
    for (const child of particles()) {
        const [x, y] = getPosition(child)
        if (y > 220) {
            setPosition(child, x, y - 220)
        }
    }
}

function updateSpeed(t: number) {
    particles().forEach((c) => setSpeed(c, 0, getScaleX(c) * 100 * t))
}

async function onMiss() {
    const container = bg()
    await timer(0.2, () => setPivot(container, rnd(4) - 2, rnd(4) - 2))
    setPivot(container, 0, 0)
}

function onStart() {
    timer(1, (t) => updateSpeed(t))
}

function onEnding() {
    timer(1, (t) => updateSpeed(1 - t))
}

export function initBg() {
    rnd.seed = 5
    const container = bg()
    for (let i = 0; i < 33; i++) {
        const scale = rnd(0.6) + 0.4
        const x = irnd(144)
        const c = floor(x / (144 / COLOR_RAINBOW.length))
        const entity = createEntity([
            ,
            {
                t: [[4.5, 4.5], [x, irnd(256)], scale],
                s: ["ico", 9, 9, 0, irnd(8)],
                b: [],
                c: COLOR_RAINBOW[c]
            }
        ])
        setAlpha(entity, scale)
        addEntity(entity, container)
    }
    on("miss", onMiss)
    on("start", onStart)
    on("ending", onEnding)
    schedule(update)
}
