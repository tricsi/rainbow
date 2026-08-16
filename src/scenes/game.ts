import { addEntity, createEntity, getEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER, FONT_REGULAR, ID_PRESS } from "../config"
import { initButtons } from "./buttons"
import { off, on } from "../modules/event"
import { setVisible } from "../modules/entity/components/color"
import { initNotes, playNotes } from "./notes"

const gamePrefab: TEntityProps = [
    "game",
    { t: [, CENTER] },
    [
        ["txt", { x: [FONT_REGULAR, ID_PRESS, 1, 1] }],
        ["btn", { t: [, [-51, 108]] }],
        ["sheet", { t: [, [-51, 108]] }]
    ]
]

const text = () => getEntity("game/txt")!

function onClick() {
    off("up", onClick)
    setVisible(text(), 0)
    playNotes()
}

export function initGame() {
    addEntity(createEntity(gamePrefab))
    initButtons()
    initNotes()
    on("up", onClick)
    on("end", () => {
        setVisible(text(), 1)
        on("up", onClick)
    })
}
