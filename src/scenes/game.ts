import { addEntity, createEntity, getChildren, getEntity, removeEntity, TEntity, TEntityProps } from "../modules/entity/entity"
import { BUTTON_DATA, CENTER, COLOR_BLUE, COLOR_PURPLE, COLOR_RED, COLOR_TRANSPARENT, COLOR_YELLOW, FONT_REGULAR, ID_PRESS } from "../config"
import { initButtons } from "./buttons";
import { off, on } from "../modules/event";
import { mixer, play } from "../modules/audio";
import { schedule } from "../modules/scheduler";
import { setColor, setVisible } from "../modules/entity/components/color";
import { pull } from "../modules/utils";
import { setPosition } from "../modules/entity/components/transform";

const gamePrefab: TEntityProps = [
    "game",
    { t: [, CENTER] },
    [
        ["txt", { x: [FONT_REGULAR, ID_PRESS, 1, 1] }],
        ["btn", { t: [, [-51, 108]] }],
        ["sheet", { t: [, [-51, 108]]}]
    ]
]

const text = () => getEntity("game/txt")!
const sheet = () => getEntity("game/sheet")!

let themeMusic: AudioBufferSourceNode
let themeStart: number = 0

function createNote() {
    return createEntity([, {
        t: [[16, 16]],
        s: ["btn", 32, 32, 0, 1]
    }])
}

function update() {
    const container = sheet()
    const currentTime = themeMusic.context.currentTime - themeStart;
    const notes = getChildren(container)
    let i = 0;
    for (const [btn, len, time] of BUTTON_DATA) {
        let y = (time - currentTime) * -160
        if (i >= notes.length || y > 0 || y < -200) {
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

function onClick() {
    off("up", onClick)
    setVisible(text(), 0)
    mixer("music", 0.5)
    themeMusic = play("theme", false, "music")!
    themeStart = themeMusic.context.currentTime
    schedule(update)
    update()
}

export function initGame() {
    addEntity(createEntity(gamePrefab))
    const container = sheet()
    for (let i=0; i<10; i++) {
        addEntity(createNote(), container)
    }
    initButtons()
    on("up", onClick)
}
