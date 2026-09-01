import { ID_HISCORE } from './../config';
import {
    FONT_REGULAR,
    ID_SCORE,
    ID_MULTI,
    COLOR_BLACK,
    LIGHT_CYAN,
    LIGHT_YELLOW,
    COLOR_RAINBOW,
    ID_PRESS_START,
    ID_LOADING,
    ID_PRESS_LOAD,
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
import { storage } from "../modules/utils";
import { getCurrentData } from "./notes"

const levels = [0, 2500, 10000]
const idleToken: TTimerToken = [1]

let level = 0
let allBtn = 0
let activeIdx = 0
let scoreNew = 0
let scoreBest = storage("sc") ?? 0
let scoreValue = 0
let streakNew = 0
let streakMax = 0
let streakBest = storage("st") ?? 0
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
            { t: [, [72, 53], 2], x: [FONT_REGULAR, "Sleepy on\n\nRoad", 1] },
            "Rainbow"
                .split("")
                .map((c, i) => [
                    c,
                    { t: [, [i * 6 - 21, 8]], x: [FONT_REGULAR, c], c: COLOR_RAINBOW[i] }
                ])
        ],
        [
            "uni",
            {
                t: [
                    [55, 0],
                    [144, 1]
                ],
                s: ["uni", 55, 54],
                a: [[[0], [1], [2, 3, 4, 3]], 10],
                c: COLOR_TRANSPARENT
            }
        ],
        ["score", { x: [FONT_REGULAR, , 0, 0], t: [, [2, 44], 1], c: LIGHT_YELLOW }],
        ["multi", { x: [FONT_REGULAR, , 2, 0], t: [, [86, 44], 1], c: LIGHT_CYAN }],
        ["tap", { x: [FONT_REGULAR, ID_PRESS_LOAD, 1, 1], t: [, [72, 150], 1.2] }],
        ["bg", { p: [[0, 0, 144, 54]], c: COLOR_BLACK }]
    ]
]

const multiText = () => getEntity("hud/multi")!
const scoreText = () => getEntity("hud/score")!
const tapText = () => getEntity("hud/tap")!
const unicorn = () => getEntity("hud/uni")!
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
    if (scoreValue > scoreBest) {
        scoreBest = storage("sc", scoreValue)
        scoreNew = 1
    }
    streakMax = max(streakMax, streakValue)
    if (streakMax > streakBest) {
        streakBest = storage("st", streakMax)
        streakNew = 1
    }
    activeIdx = idx
}

function onMiss() {
    streakValue = 0
    multiValue = 1
    emit("multi", multiValue)
}

function onRelease([data]: TEvent<number[]>) {
    const [idx] = data
    if (idx === activeIdx) {
        counter = -1
    }
}

function update(delta: number) {
    const [idx] = getCurrentData()
    if (idx - activeIdx > 1) {
        onMiss()
    }
    if (counter === activeIdx && performance.now() - counterStart > 200) {
        scoreValue += delta * multiValue * 5
    }
    setText(multiText(), String(streakValue).padStart(3, "0") + ID_MULTI + multiValue)
    setText(scoreText(), (scoreNew ? ID_HISCORE : ID_SCORE) + String(round(scoreValue)).padStart(6, "0"))
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
    setText(tapText(), ID_PRESS_START)
    timer(0.5, (_, i) => setVisible(tapText(), i % 2), Number.POSITIVE_INFINITY, idleToken)
}

function onStart() {
    allBtn = 0
    activeIdx = 0
    streakMax = 0
    streakNew = 0
    scoreNew = 0
    scoreValue = 0
    onMiss()
    schedule(update)
    kill(idleToken)
    setVisible(tapText(), 0)
}

function onEnd() {
    unschedule(update)
    idle()
}

export async function loadHud() {
    setText(tapText(), ID_LOADING)
}

export async function introHud() {
    await timer(0.5, (t) => {
        const tt = 1 - t ** 4
        setAlpha(tapText(), 1 - t)
        setAlpha(multiText(), t)
        setAlpha(scoreText(), t)
        setAlpha(unicorn(), t)
        setPosition(logo(), 45 + tt * 27, 3 + tt * 50)
        setScale(logo(), 1.6 + tt * 0.4)
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
    setAlpha(multiText(), 0)
    setAlpha(scoreText(), 0)
    update(0)
}
