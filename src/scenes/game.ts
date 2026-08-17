import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, COLOR_BLACK, COLOR_RED } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { initNotes, playNotes } from "./notes"
import { initHud } from "./hud";

const gamePrefab: TEntityProps = [
    "",
    { t: [, CENTER] },
    [
        ["btn", { t: [, [-51, 108]] }],
        ["mask", { p: [[-72, 108, 144, 20]], c: COLOR_BLACK} ],
        ["sheet", { t: [, [-51, 108]] }]
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
