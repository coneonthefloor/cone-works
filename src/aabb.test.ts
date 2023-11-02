import { expect, test } from 'vitest'
import AABB from './aabb'
import Vector from './vector'

test('that default values are correct', () => {
    const aabb = new AABB()
    expect(aabb.pos.x).toBe(0)
    expect(aabb.pos.y).toBe(0)
    expect(aabb.width).toBe(0)
    expect(aabb.height).toBe(0)
})

test('that argument order is logical', () => {
    const pos = new Vector()
    const width = 10
    const height = 20
    const aabb = new AABB(pos, width, height)

    expect(aabb.pos).toEqual(pos)
    expect(aabb.width).toBe(width)
    expect(aabb.height).toBe(height)
})

test('that cartesian points are correct', () => {
    const pos = new Vector(100, 10)
    const width = 80
    const height = 90
    const aabb = new AABB(pos, width, height)

    expect(aabb.left).toBe(pos.x)
    expect(aabb.right).toBe(pos.x + width)
    expect(aabb.top).toBe(pos.y)
    expect(aabb.bottom).toBe(pos.y + height)
})