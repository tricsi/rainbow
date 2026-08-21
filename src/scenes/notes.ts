import {
    BUTTON_DATA,
    LIGHT_CYAN,
    LIGHT_PURPLE,
    LIGHT_RED,
    COLOR_TRANSPARENT,
    LIGHT_YELLOW,
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
import { emit } from "../modules/event";
import { abs, max } from "../modules/math";
import { schedule, timer, unschedule } from "../modules/scheduler"

const notePrefab: TEntityProps = [
    ,
    {
        c: COLOR_TRANSPARENT
    },
    [
        ["btn", {
            t: [[16, 16]],
            s: ["btn", 32, 32, 0, 1]
        }],
        ["line", {
            t: [[1.5, 3],,[2, 30]],
            s: SPRITE_PTC
        }],
    ]
]
const container = () => getEntity("/sheet")!
const line = (entity: TEntity) => getEntity("line", entity)!

let context: AudioContext | undefined
let currentTime: number = 0

function getCurrentTime() {
    return currentTime - (context?.outputLatency ?? 0)
}

export function getCurrentData(threshold: number) {
    const currentTime = getCurrentTime()
    let idx = 0
    for (const [btn, len, time] of BUTTON_DATA) {
        const gap = abs(currentTime - time)
        if (gap <= threshold) {
            return [idx, btn, len, gap]
        }
        btn && idx++
    }
    return [0, 0, 0, 0]
}

function update(delta: number) {
    currentTime += delta
    const notes = getChildren(container())
    let i = 0
    for (const [btn, len, time] of BUTTON_DATA) {
        const y = (time - getCurrentTime()) * -160
        const length = max(len * 160 - 32, 0)
        const scale = length / 3
        if (i >= notes.length || y > length || y < -256) {
            continue
        }
        if (btn & 1 && notes[i]) {
            setScale(line(notes[i]), 2, scale)
            setColor(notes[i], LIGHT_RED)
            setPosition(notes[i++], 0, y)
        }
        if (btn & 2 && notes[i]) {
            setScale(line(notes[i]), 2, scale)
            setColor(notes[i], LIGHT_YELLOW)
            setPosition(notes[i++], 34, y)
        }
        if (btn & 4 && notes[i]) {
            setScale(line(notes[i]), 2, scale)
            setColor(notes[i], LIGHT_CYAN)
            setPosition(notes[i++], 68, y)
        }
        if (btn & 8 && notes[i]) {
            setScale(line(notes[i]), 2, scale)
            setColor(notes[i], LIGHT_PURPLE)
            setPosition(notes[i++], 102, y)
        }
    }
    for (let j = i; j < notes.length; j++) {
        setColor(notes[j], COLOR_TRANSPARENT)
    }
}

export function stopNotes() {
    unschedule(update)
    currentTime = 0
    emit("end")
}

export function playNotes() {
    mixer("music", 0.8)
    const music = play("theme", false, "music")
    context = music?.context as AudioContext | undefined;
    music?.addEventListener("ended", async () => {
        await timer(1)
        stopNotes()
    })
    schedule(update)
    update(0)
    emit("start")
}

export function initNotes() {
    for (let i = 0; i < 7; i++) {
        addEntity(createEntity(notePrefab), container())
    }
}
