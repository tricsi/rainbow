import { CENTER, FONT_REGULAR, ID_PRESS, ID_SCORE, ID_STREAK } from "../config"
import { setVisible } from "../modules/entity/components/color"
import { setText } from "../modules/entity/components/text"
import { addEntity, createEntity, getEntity, TEntityProps } from "../modules/entity/entity"
import { on, TEvent } from "../modules/event"

let prevIdx = 0
let scoreValue = 0
let streakValue = 0

const hudPrefab: TEntityProps = [
    "hud",
    {},
    [
        ["score", { x: [FONT_REGULAR, , 0, 0], t: [, [2, 2]] }],
        ["streak", { x: [FONT_REGULAR, , 0, 0], t: [, [2, 11]] }],
        ["tap", { x: [FONT_REGULAR, ID_PRESS, 1, 1], t:[, CENTER] }]
    ]
]

const container = () => getEntity("hud")!
const streakText = () => getEntity("hud/streak")!
const scoreText = () => getEntity("hud/score")!
const tapText = () => getEntity("hud/tap")!

function onHit([data]: TEvent<number[]>) {
    const [idx] = data
    scoreValue += 100
    if (idx - prevIdx <= 1) {
        streakValue += 1
    } else {
        streakValue = 0
    }
    prevIdx = idx
    update()
}

function update() {
    setText(streakText(), ID_STREAK + streakValue)
    setText(scoreText(), ID_SCORE + scoreValue)
}

function onStart() {
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
    update()
}
