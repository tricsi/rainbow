import { CENTER, FONT_REGULAR, ID_PRESS, ID_SCORE, ID_MULTI } from "../config"
import { setVisible } from "../modules/entity/components/color"
import { setText } from "../modules/entity/components/text"
import { addEntity, createEntity, getEntity, TEntityProps } from "../modules/entity/entity"
import { on, TEvent } from "../modules/event"
import { max, round } from "../modules/math";

let allBtn = 0
let prevIdx = 0
let scoreValue = 0
let streakValue = 0

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
    if (streakValue >= 20) return 8
    if (streakValue >= 10) return 5
    if (streakValue >= 5) return 3
    return max(streakValue, 1)
}

function onHit([data]: TEvent<number[]>) {
    const [idx, id, btn] = data
    const step = idx - prevIdx
    allBtn = !step ? allBtn | id : id
    streakValue = step <= 1 ? streakValue + 1 : 0
    if (allBtn === btn) {
        scoreValue += multiplier() * 25
    } else {
        streakValue = max(streakValue - 1, 0)
    }
    prevIdx = idx
    update()
}

function onMiss() {
    streakValue = 0
}

function update() {
    setText(streakText(), ID_MULTI + multiplier())
    setText(scoreText(), ID_SCORE + round(scoreValue))
}

function onStart() {
    allBtn = 0
    prevIdx = 0
    scoreValue = 0
    streakValue = 0
    update()
    setVisible(tapText(), 0)
}

function onEnd() {
    setVisible(tapText(), 1)
}

export function initHud() {
    addEntity(createEntity(hudPrefab))
    on("start", onStart)
    on("end", onEnd)
    on("hit", onHit)
    on("miss", onMiss)
    update()
}
