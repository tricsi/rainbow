import { CENTER, FONT_REGULAR, ID_LOADING, ID_PRESS } from "../config"
import {
    addEntity,
    createEntity,
    getEntity,
    removeEntity,
    TEntity,
    TEntityProps
} from "../modules/entity/entity"
import { setAlpha } from "../modules/entity/components/color"
import { off, on, TEvent } from "../modules/event"
import { setText } from "../modules/entity/components/text"
import { audio, mixer, play, sound } from "../modules/audio"
import { DOC } from "../modules/utils"
import { timer } from "../modules/scheduler"
import { initGame } from "./game"

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
    await sound("shot", ["sine", 0.1, [1, 0]], [440, 220])
    await sound("kill", ["custom", 0.5, [1, 0.8, 0]], [440, 220, 55])
    await sound("hit", ["custom", 0.1, [1, 0]], 440)
    on("all", ([, name]: TEvent) => play(name))
}

async function onClick() {
    off("up", onClick)
    setText(text(), ID_LOADING)
    await initAudio()
    await timer(1, (t) => setAlpha(scene(), 1 - t))
    removeEntity(scene())
    initGame()
}
