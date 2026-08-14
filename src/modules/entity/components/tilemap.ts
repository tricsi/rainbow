import { createTilemap, drawTilemap } from "../../2d/tilemap"
import { TEntity, FACTORIES } from "../entity"

FACTORIES._m = createTilemap

export const tilemapRender = ([, { _t, _c, _m }]: TEntity) => _m && _c[3] && drawTilemap(_m, _t, _c)
