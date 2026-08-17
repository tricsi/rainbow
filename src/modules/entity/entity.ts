import { TSprite } from "../2d/context"
import { m3 } from "../math/mat3"
import { max } from "../math"
import { storage } from "../utils"

export type TComponentProps = {
    /** Anim [tracks, speed=0, loop=0, track=0, offset=0, now=0] */
    a?: [number[][] | number[], number?, number?, number?, number?, number?]
    /** Body [acceleration[x, y, s, r], speed[x, y, s, r], max speed[len, s, r]] */
    b?: [number[]?, number[]?, number[]?]
    /** Tint color [red, green, blue, alpha] */
    c?: number[]
    /** Data [custom, disabled=0] */
    d?: any[]
    /** Text [sprite, value, width, height] */
    m?: [TSprite, string, number, number]
    /** Polygon [[x1, y1, x2|w|r, y2|h, x3, y3 ...], layer, mask] */
    p?: [number[], number?, number?]
    /** Sprite [name, width?, height?, extrude=0, frame=0] */
    s?: [string, number?, number?, number?, number?]
    /** Transform [pivot=[0,0], position=[0,0], scale=1, rotate=0, zIndex=0] */
    t?: [number[]?, number[]?, (number[] | number)?, number?, number?]
    /** Text [font, value="", align=0, baseline=0, letterSpace=1, lineGap=1] */
    x?: [TSprite, string?, number?, number?, number?, number?]
    /** Custom properties */
    [type: string]: any
}

/** Instance [ID, Components, Children] */
export type TEntityProps = [string?, TComponentProps?, TEntityProps[]?]

export type TComponents = {
    _: TEntity
    _t: Float32Array
    _c: number[]
    c: number[]
    t: [number[], number[], number[], number, number]
    [type: string]: any
}

/** Instance [ID, Components, Children] */
export type TEntity = [string, TComponents, TEntity[]]

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const FACTORIES: { [type: string]: Function } = {
    c: (r = 1, g = 1, b = 1, a = 1) => [r, g, b, a],
    d: (data?: any, disabled = 0) => [data, !!disabled],
    t: (p = [0, 0], t = [0, 0], s = [1, 1], r = 0, z = 0) => [[...p], [...t], Array.isArray(s) ? [...s] : [s, s], r, z],
}

const DATA_NAME = "d"

export const WORLD = createEntity()
export const getName = (entity: TEntity): string => entity[0]
export const getComponents = (entity: TEntity) => entity[1]
export const getComponent = (entity: TEntity, type: string) => entity[1][type]
export const getChildren = (entity: TEntity) => entity[2]
export const getParent = (entity: TEntity) => getComponent(entity, "_")
export const getParam = (entity: TEntity, type: string, index: number) => type in entity[1] ? entity[1][type][index] : undefined
export const setParam = (entity: TEntity, type: string, index: number, value: any) => entity[1][type][index] = value
export const getData = <T=any>(entity: TEntity, value?: T) => getParam(entity, DATA_NAME, 0) || value
export const setData = <T=any>(entity: TEntity, value: T) => setParam(entity, DATA_NAME, 0, value)
export const isDisabled = (entity: TEntity) => getParam(entity, DATA_NAME, 1)
export const setDisabled = (entity: TEntity, value: any = 1) => setParam(entity, DATA_NAME, 1, !!value)

export function createEntity([name = "", { t = [] as any, c = [], d = [] as any, ...props } = {}, children = []]: TEntityProps = [], parent: TEntity | null = null): TEntity {
    const comps: any = {
        _: parent,
        _t: m3(),
        _c: FACTORIES.c(),
        c: FACTORIES.c(...c),
        d: FACTORIES.d(...d),
        t: FACTORIES.t(...t)
    }
    const inst: TEntity = [name, comps, []]
    for (const type in props) {
        const temp = '_' + type 
        const prop = props[type]
        comps[type] = FACTORIES[type] ? FACTORIES[type](...prop) : [...prop]
        if (FACTORIES[temp]) {
            comps[temp] = FACTORIES[temp](...prop)
        }
    }
    children.forEach(child => getChildren(inst).push(createEntity(child, inst)))
    return inst
}

export function getEntity(path: string | string[], parent: TEntity = WORLD): TEntity | null {
    path = typeof path === "string" ? path.split("/") : [...path]
    if (path.length) {
        const name = path.shift()
        for (const child of getChildren(parent)) {
            if (getName(child) !== name) {
                continue
            }
            return path.length ? getEntity(path, child) : child
        }
    }
    return null
}

export function removeEntity(entity: TEntity, parent: TEntity = getParent(entity)): number {
    let index = -1
    if (parent) {
        const children = getChildren(parent)
        index = children.indexOf(entity)
        if (index >= 0) {
            children.splice(index, 1)
        }
    }
    return index
}

export function addEntity(entity: TEntity, parent: TEntity = WORLD, index: number = parent[2].length): number {
    removeEntity(entity)
    getComponents(entity)._ = parent
    const children = getChildren(parent)
    if (index < 0) {
        index = max(children.length + index, 0)
    }
    if (index >= children.length) {
        index = children.length
        children.push(entity)
    } else {
        children.splice(index, 0, entity)
    }
    return index
}

export function traverse(before?: (entity: TEntity) => any, after?: (entity: TEntity) => void, entity: TEntity = WORLD) {
    if (isDisabled(entity)) {
        return
    }
    before?.(entity)
    const children = [...getChildren(entity)]
    children.sort((a, b) => b[1].t[4] - a[1].t[4])
    for (let i = children.length - 1; i >= 0; i--) {
        traverse(before, after, children[i])
    }
    after?.(entity)
}

export function stringify(entities: TEntity[]): string {
    return JSON.stringify(entities, ["a", "b", "c", "d", "m", "p", "s", "t", "x"])
}