import {
    BUTTON_DATA,
    COLOR_BLUE,
    COLOR_PURPLE,
    COLOR_RED,
    COLOR_TRANSPARENT,
    COLOR_YELLOW
} from "../config"
import { mixer, play } from "../modules/audio"
import { setColor } from "../modules/entity/components/color"
import { setPosition } from "../modules/entity/components/transform"
import {
    addEntity,
    createEntity,
    getChildren,
    getEntity,
    TEntityProps
} from "../modules/entity/entity"
import { emit } from "../modules/event";
import { abs } from "../modules/math";
import { schedule, timer, unschedule } from "../modules/scheduler"

const notePrefab: TEntityProps = [
    ,
    {
        t: [[16, 16]],
        s: ["btn", 32, 32, 0, 1]
    }
]
const container = () => getEntity("game/sheet")!

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
            return [btn, gap, idx]
        }
        btn && idx++
    }
    return [0, 0, 0]
}

function update(delta: number) {
    currentTime += delta
    const notes = getChildren(container())
    let i = 0
    for (const [btn, len, time] of BUTTON_DATA) {
        let y = (time - getCurrentTime()) * -160
        if (i >= notes.length || y > 0 || y < -256) {
            continue
        }
        if (btn & 1 && notes[i]) {
            setColor(notes[i], COLOR_RED)
            setPosition(notes[i++], 0, y)
        }
        if (btn & 2 && notes[i]) {
            setColor(notes[i], COLOR_YELLOW)
            setPosition(notes[i++], 34, y)
        }
        if (btn & 4 && notes[i]) {
            setColor(notes[i], COLOR_BLUE)
            setPosition(notes[i++], 68, y)
        }
        if (btn & 8 && notes[i]) {
            setColor(notes[i], COLOR_PURPLE)
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
