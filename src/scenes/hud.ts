import {
    FONT_REGULAR,
    ID_SCORE,
    ID_MULTI,
    COLOR_BLACK,
    LIGHT_CYAN,
    LIGHT_YELLOW,
    COLOR_RAINBOW,
    ID_COIN,
    ID_LOADING,
    ID_PRESS,
    COLOR_TRANSPARENT
} from "../config"
import { playAnim } from "../modules/entity/components/anim"
import { setAlpha, setVisible } from "../modules/entity/components/color"
import { setText } from "../modules/entity/components/text"
import { setPosition, setScale } from "../modules/entity/components/transform"
import { addEntity, createEntity, getEntity, TEntityProps } from "../modules/entity/entity"
import { emit, on, TEvent } from "../modules/event"
import { max, round } from "../modules/math"
import { kill, schedule, timer, TTimerToken, unschedule } from "../modules/scheduler"
import { getCurrentData } from "./notes"
import { saveScore, scorePrefab, updateScore } from "./score"

const levels = [0, 10000, 25000, 40000]
const idleToken: TTimerToken = [1]

let level = 0
let allBtn = 0
let activeIdx = 0
let scoreValue = 0
let streakMax = 0
let streakValue = 0
let multiValue = 1
let counter = -1
let counterStart = 0

const hudPrefab: TEntityProps = [
    "hud",
    ,
    [
        [
            "logo",
            { t: [[32, 20], [72, 120], 1.5], s: ["logo", 63, 39] },
            [
                ["l", { t: [, [-12, -8]], s: ["bg", 43, 52, 1] }],
                ["r", { t: [, [74, -8], [-1, 1]], s: ["bg", 43, 52, 1] }]
            ]
        ],
        [
            "uni",
            {
                t: [[55, 0], [144, 0]],
                s: ["uni", 55, 54],
                a: [[[0], [1], [2], [2, 3, 4, 3]], 10],
                c: COLOR_TRANSPARENT
            }
        ],
        ["streak", { x: [FONT_REGULAR, , 1, 0], t: [, [26, 57], 1], c: LIGHT_CYAN }],
        ["score", { x: [FONT_REGULAR, , 1, 0], t: [, [72, 57], 1], c: LIGHT_YELLOW }],
        ["multi", { x: [FONT_REGULAR, , 1, 0], t: [, [118, 57], 1], c: LIGHT_CYAN }],
        scorePrefab,
        ["tap", { x: [FONT_REGULAR, ID_PRESS, 1, 1], t: [, [72, 208], 1] }]
    ]
]

const streakText = () => getEntity("hud/streak")!
const scoreText = () => getEntity("hud/score")!
const multiText = () => getEntity("hud/multi")!
const tapText = () => getEntity("hud/tap")!
const unicorn = () => getEntity("hud/uni")!
const table = () => getEntity("hud/table")!
const logo = () => getEntity("hud/logo")!

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
    } else {
        streakValue = max(streakValue - 1, 0)
    }
    const multi = multiplier()
    if (multiValue !== multi) {
        multiValue = multi
        emit("multi", multiValue)
    }
    scoreValue += multiValue * 25
    streakMax = max(streakMax, streakValue)
    activeIdx = idx
}

function onMiss() {
    streakValue = 0
    multiValue = 1
    emit("multi", multiValue)
}

function onRelease() {
    counter = -1
}

function update(delta: number) {
    const [idx] = getCurrentData()
    if (idx - activeIdx > 1) {
        onMiss()
    }
    if (counter === activeIdx && performance.now() - counterStart > 200) {
        scoreValue += delta * multiValue * 5
    }
    setText(streakText(), String(round(streakValue)).padStart(3, "0"))
    setText(scoreText(), ID_SCORE + String(round(scoreValue)).padStart(5, "0"))
    setText(multiText(), ID_MULTI + multiValue)
    const newLevel = levels.reduce(
        (value, score, index) => (score > scoreValue ? value : index),
        level
    )
    if (level !== newLevel) {
        playAnim(unicorn(), [newLevel])
        level = newLevel
    }
}

function idle() {
    idleToken[1] = 0
    setText(tapText(), ID_COIN)
    timer(0.5, (_, i) => setVisible(tapText(), i % 2), Number.POSITIVE_INFINITY, idleToken)
}

function onStart() {
    allBtn = 0
    activeIdx = 0
    streakMax = 0
    scoreValue = 0
    onMiss()
    schedule(update)
    kill(idleToken)
    setVisible(tapText(), 0)
    timer(0.3, (t) => setAlpha(table(), 1 - t))
}

function onEnd() {
    unschedule(update)
    saveScore(streakMax, scoreValue)
    updateScore()
    timer(0.3, (t) => setAlpha(table(), t))
    idle()
}

export async function loadHud() {
    setText(tapText(), ID_LOADING)
}

export async function introHud() {
    await timer(0.5, (t) => {
        const tt = 1 - t ** 4
        setAlpha(tapText(), 1 - t)
        setAlpha(streakText(), t)
        setAlpha(scoreText(), t)
        setAlpha(multiText(), t)
        setAlpha(unicorn(), t)
        setAlpha(table(), t)
        setPosition(logo(), 46 + tt * 26, 30 + tt * 90)
        setScale(logo(), 1 + tt * 0.5)
    })
    on("start", onStart)
    on("end", onEnd)
    on("hit", onHit)
    on("miss", onMiss)
    on("release", onRelease)
    idle()
}

export function initHud() {
    addEntity(createEntity(hudPrefab))
    setAlpha(streakText(), 0)
    setAlpha(scoreText(), 0)
    setAlpha(multiText(), 0)
    updateScore()
    update(0)
}
