import "./modules/input/gamepad"
import SPRITESHEET from "./asset/texture.json"
import { createContext, renderContext } from "./modules/2d/context"
import { animSystem } from "./modules/entity/components/anim"
import { bodySystem } from "./modules/entity/components/body"
import { colorSystem } from "./modules/entity/components/color"
import { clearCache, polygonRender, polygonSystem } from "./modules/entity/components/polygon"
import { spriteRender } from "./modules/entity/components/sprite"
import { textRender } from "./modules/entity/components/text"
import { tilemapRender } from "./modules/entity/components/tilemap"
import { transformSystem } from "./modules/entity/components/transform"
import { traverse, WORLD } from "./modules/entity/entity"
import { schedule, update } from "./modules/scheduler"
import { $ } from "./modules/utils"
import { initLoad } from "./scenes/loader"
import { initGame } from "./scenes/game";

schedule((delta) => {
    traverse(
        (entity) => {
            transformSystem(entity)
            polygonSystem(entity)
            colorSystem(entity)
        },
        (entity) => {
            polygonRender(entity)
            tilemapRender(entity)
            spriteRender(entity)
            textRender(entity)
            animSystem(entity, delta)
            bodySystem(entity, delta)
        }
    )
    renderContext()
    clearCache()
}, 9)

createContext($("canvas") as HTMLCanvasElement, SPRITESHEET, () => {
    initLoad()
    update()
})

DEBUG && new EventSource("/esbuild").addEventListener("change", () => location.reload())
DEBUG && ((window as any).ROOT = WORLD)
