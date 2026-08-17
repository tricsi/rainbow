import { createSprite } from "./modules/2d/context"
import { TChannelProps } from "./modules/audio";

function parseData(sheet: string, tempo: number): number[][] {
    let time = 0
    const config = sheet.split(',').map(cfg => {
        const len = parseInt(cfg[1]) * tempo
        const row = [parseInt(cfg[0]), len, time, ]
        time += len;
        return row
    })
    return config;
}

export const BUTTON_DATA: number[][] = parseData(
    "08,"+
    "11,01,21,01,11,01,21,21,"+ 
    "11,01,21,01,11,01,21,21,"+ 
    "11,01,21,01,11,01,21,21,"+ 
    "11,01,21,01,11,01,21,21,"+ 
    "11,01,21,01,11,01,21,21",
    0.2
);
export const THEME_MUSIC: TChannelProps[] = [
    [["custom", 0.2, [0.5, 0]], "8|1|" + "2,1e3,3,1e3,1e3|5", 0.2],
    [["sine", 0.2, [1, 0]], "8|1|" + "1e2,3,1e2,3|5", 0.2]
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

