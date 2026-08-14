import { addEntity, createEntity, TEntityProps } from "../modules/entity/entity"
import { CENTER } from "../config"

const gamePrefab: TEntityProps = ["game", { t: [, CENTER] }, []]

export function initGame() {
    addEntity(createEntity(gamePrefab))
}
