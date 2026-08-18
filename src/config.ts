import { createSprite } from "./modules/2d/context"
import { TChannelProps, wave } from "./modules/audio"

function parseData(sheet: string, tempo: number): number[][] {
    let time = 0
    const config = sheet.split(",").map((cfg) => {
        const len = parseInt(cfg[1]) * tempo
        const row = [parseInt(cfg[0], 16), len, time]
        time += len
        return row
    })
    return config
}

export const BUTTON_DATA: number[][] = parseData(
    "08," +
    "21,01,41,01,21,01,41,41," +
    "21,01,41,01,21,01,41,41," +
    "21,01,41,01,21,01,41,41," +
    "21,01,41,01,21,01,41,41," +
    "A7,01,67,01,57,01,37,01," +
    "A7,01,67,01,57,01,37,01",
    0.25
)
export const WAVE_BASS = [0, 1, 0.8, 0.2, 0.02]
export const WAVE_BRASS = [0, 0.4, 0.4, 1, 1, 1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8]
export const WAVE_CHIPTUNE = wave((n) => (4 / (n * Math.PI)) * Math.sin(Math.PI * n * 0.18))
export const WAVE_ORGAN = [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1]
export const WAVE_ORGAN2 = [0, 0.8, 0.6, 0.6, 0.7, 0.6, 0, 0.8, 0.3, 1]

export const THEME_MUSIC: TChannelProps[] = [
    [[WAVE_CHIPTUNE, 0.2, [0.3, 0.2]], 
        "8|9|"+
        "1c4,1,1c4,1g3,1c4,1,1e4,1," +
        "1d4,1,1d4,1c4,2b3,2," + 
        "1c4,1,1c4,1a3,1c4,1,1e4,1," +
        "4f3,2a3,2b3," +
        "1c4,1,1c4,1g3,1c4,1,1e4,1," +
        "1d4,1,1d4,1c4,2b3,2," + 
        "1c4,1,1c4,1a3,1c4,1,1e4,1," +
        "4f4,2e4,2d4|2", 0.25],
    [[WAVE_ORGAN2, 0.2, [0.2, 0.2]], "8|5|8c3e3g3,8g2b2d3,8a2c3e3,8f2a2c3|5", 0.25],
    [[WAVE_BASS, 0.2, [0.4, 0.1]], 
        "8|1|"+
        "1c2,1,1c2,1,1c2,1,1c2,1b1," + 
        "1g1,1,1g1,1,2g1,2," +
        "1a1,1,1a1,1,1a1,1,1a1,1g1," + 
        "2f1,2,2a1,2b1|6"
    , 0.25],
    [["custom", 0.2, [3, 0]], "8|1|1e1,1,1e3,1,1e1,1,1e3,1e3|24", 0.25],
    [["sine", 0.2, [1, 0]], "8|1|1e1,3,1e1,3|24", 0.25]
]

export const SPRITE_PTC = createSprite("ptc", 3, 3, 1)
export const FONT_REGULAR = createSprite("font", 5, 7)
export const FONT_TINY = createSprite("tiny", 3, 5)
export const CENTER = [72, 128]

export const COLOR_TRANSPARENT = [0, 0, 0, 0]
export const COLOR_BLACK = [0, 0, 0, 1]
export const COLOR_WHITE = [1, 1, 1, 1]
export const COLOR_HIGH = [2, 2, 2, 1]
export const COLOR_DARK = [0.3, 0.3, 0.3]
export const COLOR_LIGHT = [0.7, 0.7, 0.7]
export const COLOR_RED = [1, 0, 0, 1]
export const COLOR_YELLOW = [1, 1, 0, 1]
export const COLOR_BLUE = [0, 1, 1, 1]
export const COLOR_PURPLE = [1, 0, 1, 1]
export const COLOR_DEBUG = [0, 1, 1, 0.5]

export const ID_PRESS = "Press to continue"
export const ID_LOADING = "Loading..."
export const ID_MULTI = "X"
export const ID_SCORE = "Score:"
