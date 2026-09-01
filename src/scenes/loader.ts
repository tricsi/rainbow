import { on, once, TEvent } from "./../modules/event"
import { THEME_MUSIC } from "../config"
import { audio, mixer, music, play, sound } from "../modules/audio"
import { DOC } from "../modules/utils"
import { initGame } from "./game"
import { initHud, introHud, loadHud } from "./hud"

export function initLoad() {
    initHud()
    once("up", onClick)
}

async function initAudio() {
    await audio()
    on("visibilitychange", () => mixer("master", DOC.hidden ? 0 : 1), DOC)
    await sound("miss", ["custom", 0.2, [1, 0]], [800, 200])
    await music("theme", THEME_MUSIC)
    on("all", ([, id]: TEvent) => play(id))
}

async function onClick() {
    loadHud()
    await initAudio()
    await Promise.all([introHud(), initGame()])
}
