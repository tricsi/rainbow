import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, COLOR_BLACK, DARK_GREY, LIGHT_GREY, FONT_REGULAR, SPRITE_FRAME } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { initNotes, playNotes } from "./notes"
import { initHud } from "./hud"

const gamePrefab: TEntityProps = [
    "",
    { t: [, CENTER] },
    [
        ["btn", { t: [, [-51, 109]] }],
        [
            "frame",
            {
                m: [
                    SPRITE_FRAME,
                    "a0b9|a0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0c0 9|c0-a0-b9+a0",
                    12,
                    17
                ],
                t: [, [-72, -75]],
                c: DARK_GREY
            }
        ],
        ["mask", { p: [[-72, 109, 144, 19]], c: COLOR_BLACK }],
        ["sheet", { t: [, [-51, 110]] }]
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
    on("up", onClick)
    on("end", () => on("up", onClick))
}
