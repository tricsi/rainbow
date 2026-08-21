import { createSprite } from "./modules/2d/context"
import { TChannelProps, wave } from "./modules/audio"

function parseData(sheet: string, tempo: number): number[][] {
    let time = 0
    let config = sheet.split("|")
    return config
        .reduce(
            (p, n, i) =>
                p + (i % 2 ? ("," + config[i - 1]).repeat(parseInt(n) - 1) : (p ? "," : "") + n),
            ""
        )
        .split(",")
        .map((cfg) => {
            const len = parseInt(cfg[1]) * tempo
            const row = [parseInt(cfg[0], 16), len, time]
            time += len
            return row
        })
}

export const BUTTON_DATA: number[][] = parseData(
    "08|1|" + "21,01,41,01,21,01,41,41|4|" + "A7,01,67,01,57,01,37,01|2",
    0.25
)
export const WAVE_BASS = [0, 1, 0.8, 0.2, 0.02]
export const WAVE_BRASS = [0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]
export const WAVE_CHIPTUNE = wave((n) => (4 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.18))
export const WAVE_ORGAN = [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1]
export const WAVE_ORGAN2 = [0, 0.8, 0.6, 0.6, 0.7, 0.6, 0, 0.8, 0.3, 1]

export const THEME_MUSIC: TChannelProps[] = [
    [
        [WAVE_CHIPTUNE, 0.2, [0.3, 0.2]],
        "8|9|" +
            "1c4,1,1c4,1g3,1c4,1,1e4,1," +
            "1d4,1,1d4,1c4,2b3,2," +
            "1c4,1,1c4,1a3,1c4,1,1e4,1," +
            "4f3,2a3,2b3," +
            "1c4,1,1c4,1g3,1c4,1,1e4,1," +
            "1d4,1,1d4,1c4,2b3,2," +
            "1c4,1,1c4,1a3,1c4,1,1e4,1," +
            "4f4,2e4,2d4|1",
        0.25
    ],
    [[WAVE_ORGAN2, 0.2, [0.2, 0.2]], "8|5|8c3e3g3,8g2b2d3,8a2c3e3,8f2a2c3|5", 0.25],
    [
        [WAVE_BASS, 0.2, [0.4, 0.1]],
        "8|1|" +
            "1c2,1,1c2,1,1c2,1,1c2,1b1," +
            "1g1,1,1g1,1,2g1,2," +
            "1a1,1,1a1,1,1a1,1,1a1,1g1," +
            "2f1,2,2a1,2b1|6",
        0.25
    ],
    [["custom", 0.2, [3, 0]], "8|1|1e1,1,1e3,1,1e1,1,1e3,1e3|24", 0.25],
    [["sine", 0.2, [1, 0]], "8|1|1e1,3,1e1,3|24", 0.25]
]

export const SPRITE_PTC = createSprite("ptc", 3, 3, 1)
export const SPRITE_FRAME = createSprite("frame", 12, 12, 1)
export const FONT_REGULAR = createSprite("font", 5, 7)
export const CENTER = [72, 128]

export const COLOR_TRANSPARENT = [0, 0, 0, 0]
export const COLOR_BLACK = [0, 0, 0, 1]
export const COLOR_WHITE = [1, 1, 1, 1]
export const COLOR_HIGH = [1.33, 1.33, 1.33, 1]
export const LIGHT_GREY = [0.75, 0.75, 0.75]
export const DARK_GREY = [0.25, 0.25, 0.25]
export const LIGHT_RED = [1, 0, 0, 1]
export const DARK_RED = [0.75, 0, 0, 1]
export const LIGHT_GREEN = [0, 1, 0, 1]
export const DARK_GREEN = [0, 0.75, 0, 1]
export const LIGHT_BLUE = [0, 0, 1, 1]
export const DARK_BLUE = [0, 0, 0.75, 1]
export const LIGHT_CYAN = [0, 1, 1, 1]
export const DARK_CYAN = [0, 0.75, 0.75, 1]
export const LIGHT_YELLOW = [1, 1, 0, 1]
export const DARK_YELLOW = [0.75, 0.75, 0, 1]
export const LIGHT_PURPLE = [1, 0, 1, 1]
export const DARK_PURPLE = [0.75, 0, 0.75, 1]
export const COLOR_RAINBOW = [
    DARK_RED,
    LIGHT_RED,
    LIGHT_YELLOW,
    DARK_GREEN,
    DARK_CYAN,
    DARK_PURPLE,
    LIGHT_PURPLE
]

export const ID_COIN = "Insert coin"
export const ID_PRESS = "Press to start"
export const ID_LOADING = "Loading..."
export const ID_MULTI = "X"
export const ID_SCORE = "SC:"
export const ID_HISCORE = "HI:"
