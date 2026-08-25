import { COLOR_RAINBOW } from "../config";
import { setAlpha } from "../modules/entity/components/color";
import { getPosition, setPosition } from "../modules/entity/components/transform";
import { addEntity, createEntity, getChildren, getEntity } from "../modules/entity/entity";
import { irnd, rnd } from "../modules/math";
import { schedule } from "../modules/scheduler";

const bg = () => getEntity("/bg")!

function update() {
    for (const child of getChildren(bg())) {
        const [x, y] = getPosition(child)
        if (y > 220) {
            setPosition(child, x, y - 220)
        }
    } 
}

export function initBg() {
    const container = bg()
    for (let i = 0; i < 30; i++) {
        const scale = rnd(0.6) + .4
        const entity = createEntity([, {
            t: [[4.5, 4.5], [irnd(144), irnd(256)], scale],
            s: ["ico", 9, 9, 0, irnd(8)],
            b: [,[0, 100 * scale]],
            c: COLOR_RAINBOW[irnd(COLOR_RAINBOW.length)]
        }])
        setAlpha(entity, scale)
        addEntity(entity, container)
    }
    schedule(update)
}
