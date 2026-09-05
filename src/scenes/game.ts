import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, COLOR_BLACK, COLOR_TRANSPARENT, DARK_GREY, SPRITE_FRAME } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { initNotes, playNotes } from "./notes"
import { TSprite } from "../modules/2d/context"
import { initBg } from "./back"
import { timer } from "../modules/scheduler";
import { setAlpha } from "../modules/entity/components/color";

const map: [TSprite, string, number, number] = [
    SPRITE_FRAME,
    "a0b9|a0d0b9|d0" + Array(14).fill("c0 9|c0").join("") + "-a0-b9+a0",
    12,
    17
]

const gamePrefab: TEntityProps = [
    "",
    { t: [, CENTER], c: COLOR_TRANSPARENT },
    [
        ["btn", { t: [, [-51, 109]] }],
        ["frame", { t: [, [-72, -75]], m: map, c: DARK_GREY }],
        ["top", { p: [[-72, -128, 144, 65]], c: COLOR_BLACK }],
        ["bottom", { p: [[-72, 109, 144, 18]], c: COLOR_BLACK }],
        ["sheet", { t: [, [-51, 110]] }],
        ["bg", { t: [, [-72, -110]], c: [1, 1, 1, 0.3] }]
    ]
]

function onClick() {
    off("up", onClick)
    playNotes()
}

export async function initGame() {
    const game = createEntity(gamePrefab)
    addEntity(game)
    initButtons()
    initNotes()
    initBg()
    await timer(0.5, t => setAlpha(game, t))
    on("up", onClick)
    on("end", () => on("up", onClick))
}
