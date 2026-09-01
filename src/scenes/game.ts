import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, COLOR_BLACK, DARK_GREY, SPRITE_FRAME } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { initNotes, playNotes } from "./notes"
import { initHud } from "./hud"
import { TSprite } from "../modules/2d/context"
import { initBg } from "./back";

const map: [TSprite, string, number, number] = [
    SPRITE_FRAME,
    "a0b9|a0" + Array(15).fill("c0 9|c0").join("") + "-a0-b9+a0",
    12,
    17
]

const gamePrefab: TEntityProps = [
    "",
    { t: [, CENTER] },
    [
        ["btn", { t: [, [-51, 109]] }],
        ["frame", { t: [, [-72, -75]], m: map, c: DARK_GREY }],
        ["mask", { p: [[-72, 109, 144, 18]], c: COLOR_BLACK }],
        ["sheet", { t: [, [-51, 110]] }],
        ["bg", { t:[, [-72, -110]], c: [1, 1, 1, 0.2]}],
    ]
]

function onClick() {
    off("up", onClick)
    playNotes()
}

export function initGame() {
    initHud()
    addEntity(createEntity(gamePrefab))
    initButtons()
    initNotes()
    initBg()
    on("up", onClick)
    on("end", () => on("up", onClick))
}
