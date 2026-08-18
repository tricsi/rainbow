import { CENTER, FONT_REGULAR, ID_PRESS, ID_SCORE, ID_MULTI } from "../config"
import { setVisible } from "../modules/entity/components/color"
import { setText } from "../modules/entity/components/text"
import { addEntity, createEntity, getEntity, TEntityProps } from "../modules/entity/entity"
import { on, TEvent } from "../modules/event"
import { max, round } from "../modules/math";
import { schedule, unschedule } from "../modules/scheduler";

let allBtn = 0
let activeIdx = 0
let scoreValue = 0
let streakValue = 0
let counter = -1
let counterStart = 0

const hudPrefab: TEntityProps = [
    "hud",
    {},
    [
        ["score", { x: [FONT_REGULAR, , 0, 0], t: [, [2, 2]] }],
        ["streak", { x: [FONT_REGULAR, , 2, 0], t: [, [142, 2]] }],
        ["tap", { x: [FONT_REGULAR, ID_PRESS, 1, 1], t:[, CENTER] }]
    ]
]

const streakText = () => getEntity("hud/streak")!
const scoreText = () => getEntity("hud/score")!
const tapText = () => getEntity("hud/tap")!

function multiplier() {
    if (streakValue >= 15) return 8
    if (streakValue >= 10) return 5
    if (streakValue >= 5) return 3
    return max(streakValue, 1)
}

function onHit([data]: TEvent<number[]>) {
    const [idx, id, btn] = data
    const step = idx - activeIdx
    allBtn = !step ? allBtn | id : id
    streakValue = step <= 1 ? streakValue + 1 : 0
    if (allBtn === btn) {
        counter = idx
        counterStart = performance.now()
        scoreValue += multiplier() * 25
    } else {
        streakValue = max(streakValue - 1, 0)
    }
    activeIdx = idx
}

function onMiss() {
    streakValue = 0
}

function onRelease([data]: TEvent<number[]>) {
    const [idx] = data
    if (idx === activeIdx) {
        counter = -1
    }
}

function update(delta: number) {
    if (counter === activeIdx && performance.now() - counterStart > 300) {
        scoreValue += delta * multiplier() * 5
    }
    setText(streakText(), ID_MULTI + multiplier())
    setText(scoreText(), ID_SCORE + round(scoreValue))
}

function onStart() {
    allBtn = 0
    activeIdx = 0
    scoreValue = 0
    streakValue = 0
    schedule(update)
    setVisible(tapText(), 0)
}

function onEnd() {
    unschedule(update)
    setVisible(tapText(), 1)
}

export function initHud() {
    addEntity(createEntity(hudPrefab))
    on("start", onStart)
    on("end", onEnd)
    on("hit", onHit)
    on("miss", onMiss)
    on("release", onRelease)
    update(0)
}
