import { TEvent } from "./../modules/event"
import { CENTER, FONT_REGULAR, ID_LOADING, ID_PRESS, THEME_MUSIC } from "../config"
import {
    addEntity,
    createEntity,
    getEntity,
    removeEntity,
    TEntityProps
} from "../modules/entity/entity"
import { off, on } from "../modules/event"
import { setText } from "../modules/entity/components/text"
import { audio, mixer, music, play, sound } from "../modules/audio"
import { DOC } from "../modules/utils"
import { initGame } from "./game"
import { timer } from "../modules/scheduler"

const prefab: TEntityProps = [
    "load",
    { t: [, CENTER] },
    [["text", { x: [FONT_REGULAR, ID_PRESS, 1, 1] }]]
]
const scene = () => getEntity("load")!
const text = () => getEntity("load/text")!

export function initLoad() {
    addEntity(createEntity(prefab))
    on("up", onClick)
}

async function initAudio() {
    await audio()
    on("visibilitychange", () => mixer("master", DOC.hidden ? 0 : 1), DOC)
    await sound("miss", ["custom", 0.2, [1, 0]], [800, 200])
    await music("theme", THEME_MUSIC)
    on("all", ([, id]: TEvent) => play(id))
}

async function onClick() {
    off("up", onClick)
    setText(text(), ID_LOADING)
    await initAudio()
    await timer(0.5)
    removeEntity(scene())
    initGame()
}
