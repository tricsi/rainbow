import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, COLOR_BLACK, COLOR_DARK, FONT_REGULAR } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { initNotes, playNotes } from "./notes"
import { initHud } from "./hud";

const gamePrefab: TEntityProps = [
    "",
    { t: [, CENTER] },
    [
        ["btn", { t: [, [-51, 110]] }],
        ["mask", { p: [[-72, 110, 144, 18]], c: COLOR_DARK} ],
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
