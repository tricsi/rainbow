import {
    COLOR_TRANSPARENT,
    COLOR_WHITE,
    FONT_REGULAR,
    ID_TABLE,
    LIGHT_CYAN,
    LIGHT_GREEN,
    LIGHT_YELLOW,
    SCORE_TABLE,
    THightScore
} from "../config"
import { setColor } from "../modules/entity/components/color"
import { setText } from "../modules/entity/components/text"
import { getChildren, getEntity, TEntityProps } from "../modules/entity/entity"
import { min, round } from "../modules/math"
import { storage } from "../modules/utils"

export const scorePrefab: TEntityProps = [
    "table",
    { x: [FONT_REGULAR, ID_TABLE, 1, 0], t: [, [72, 80]], c: COLOR_TRANSPARENT },
    SCORE_TABLE.map((_, y) => [
        "id",
        { t: [, [-20, y * 10 + 18]], x: [FONT_REGULAR, , 2] },
        [
            [
                "st",
                {
                    t: [, [20, 0]],
                    x: [FONT_REGULAR, , 1],
                    c: LIGHT_CYAN
                }
            ],
            [
                "sc",
                {
                    t: [, [70, 0]],
                    x: [FONT_REGULAR, , 2],
                    c: LIGHT_YELLOW
                }
            ]
        ]
    ])
]

const highScores: THightScore[] = storage("hi") ?? []

const table = () => getEntity("hud/table")!

export function saveScore(streak: number, score: number) {
    highScores.push(["YOU", streak, score])
    highScores.sort((a: THightScore, b: THightScore) => b[2] - a[2])
    highScores.length = min(SCORE_TABLE.length, highScores.length)
    storage("hi", highScores)
}

export function updateScore() {
    const score = [...SCORE_TABLE, ...highScores].sort(
        (a: THightScore, b: THightScore) => b[2] - a[2]
    )
    getChildren(table()).forEach((row, i) => {
        const [id, st, sc] = score[i]
        setText(row, `${i + 1}. ${id}`)
        setColor(row, id === "YOU" ? LIGHT_GREEN : COLOR_WHITE)
        setText(getEntity("st", row)!, String(st).padStart(3, "0"))
        setText(getEntity("sc", row)!, String(round(sc)).padStart(5, "0"))
    })
}
