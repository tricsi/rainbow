import {
    BUTTON_DATA,
    DARK_CYAN,
    DARK_PURPLE,
    DARK_RED,
    COLOR_TRANSPARENT,
    DARK_YELLOW,
    SPRITE_PTC
} from "../config"
import { mixer, play } from "../modules/audio"
import { setColor } from "../modules/entity/components/color"
import { setPosition, setScale } from "../modules/entity/components/transform"
import {
    addEntity,
    createEntity,
    getChildren,
    getEntity,
    TEntity,
    TEntityProps
} from "../modules/entity/entity"
import { emit, on } from "../modules/event"
import { abs, max } from "../modules/math"
import { schedule, timer } from "../modules/scheduler"
import { DOC } from "../modules/utils"

const notePrefab: TEntityProps = [
    ,
    {
        c: COLOR_TRANSPARENT
    },
    [
        [
            "btn",
            {
                t: [[16, 16]],
                s: ["btn", 32, 32, 0, 1]
            }
        ],
        [
            "line",
            {
                t: [[1.5, 3], , [2, 30]],
                s: SPRITE_PTC
            }
        ]
    ]
]

let currentTime: number = 0
let music: AudioBufferSourceNode | null = null

const container = () => getEntity("/sheet")!
const line = (entity: TEntity) => getEntity("line", entity)!

function getCurrentTime() {
    return currentTime - ((music?.context as AudioContext)?.outputLatency ?? 0)
}

export function getCurrentData(threshold: number = 0.12) {
    const currentTime = getCurrentTime()
    let idx = 0
    for (const [btn, len, time] of BUTTON_DATA) {
        const gap = abs(currentTime - time)
        if (gap <= threshold || time - threshold > currentTime) {
            return [idx, btn, len, gap]
        }
        btn && idx++
    }
    return [idx, 0, 0, 0]
}

function update(delta: number) {
    const notes = getChildren(container())
    let i = 0
    if (music) {
        currentTime += delta
        for (const [btn, len, time] of BUTTON_DATA) {
            const y = (time - getCurrentTime()) * -160
            const length = max(len * 160 - 32, 0)
            const scale = length / 3
            if (i >= notes.length || y > length || y < -256) {
                continue
            }
            if (btn & 1 && notes[i]) {
                setScale(line(notes[i]), 2, scale)
                setColor(notes[i], DARK_RED)
                setPosition(notes[i++], 0, y)
            }
            if (btn & 2 && notes[i]) {
                setScale(line(notes[i]), 2, scale)
                setColor(notes[i], DARK_YELLOW)
                setPosition(notes[i++], 34, y)
            }
            if (btn & 4 && notes[i]) {
                setScale(line(notes[i]), 2, scale)
                setColor(notes[i], DARK_CYAN)
                setPosition(notes[i++], 68, y)
            }
            if (btn & 8 && notes[i]) {
                setScale(line(notes[i]), 2, scale)
                setColor(notes[i], DARK_PURPLE)
                setPosition(notes[i++], 102, y)
            }
        }
    }
    for (let j = i; j < notes.length; j++) {
        setColor(notes[j], COLOR_TRANSPARENT)
    }
}

export function playNotes(restart: boolean = false) {
    mixer("music", 1)
    music = play("theme", false, "music", currentTime)
    music?.addEventListener("ended", () => stopNotes())
    emit(restart ? "restart" : "start")
}

export async function stopNotes(pause: boolean = false) {
    if (music) {
        const copy = music
        music = null
        if (!pause) {
            emit("ending")
            await timer(1, (t) => mixer("music", 1 - t))
            emit("end")
            currentTime = 0
        }
        copy?.stop()
    }
}

function onVisibilityChange() {
    DOC.hidden ? stopNotes(true) : playNotes(true)
}

export function initNotes() {
    for (let i = 0; i < 7; i++) {
        addEntity(createEntity(notePrefab), container())
    }
    on("visibilitychange", onVisibilityChange, DOC)
    schedule(update)
}
