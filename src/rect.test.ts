import { expect, test, vi } from "vitest"
import Rect from "./rect"
import Vector from "./vector"
import { DrawOrigin } from "./draw-origin"
import { getContextMock } from "./mocks/context.mock"

test("that default values are correct", () => {
  const rect = new Rect()
  expect(rect.pos.x).toBe(0)
  expect(rect.pos.y).toBe(0)
  expect(rect.width).toBe(0)
  expect(rect.height).toBe(0)
})

test("that argument order is logical", () => {
  const pos = new Vector()
  const width = 10
  const height = 20
  const rect = new Rect(pos, width, height)

  expect(rect.pos).toEqual(pos)
  expect(rect.width).toBe(width)
  expect(rect.height).toBe(height)
})

test("that bounds are correct", () => {
  const rect = new Rect(new Vector(10, 10), 10, 10)
  const bounds = rect.getBounds()
  expect(bounds.pos.x).toBe(rect.pos.x)
  expect(bounds.pos.y).toBe(rect.pos.y)
  expect(bounds.width).toBe(rect.width)
  expect(bounds.height).toBe(rect.height)
})

test("that position is correct when origin is applied", () => {
  const size = 10
  const rect = new Rect(new Vector(), size, size)

  const topLeft = rect.getPositionFromOrigin(DrawOrigin.TOP_LEFT)
  expect(topLeft.x).toBe(-size)
  expect(topLeft.y).toBe(-size)

  const top = rect.getPositionFromOrigin(DrawOrigin.TOP)
  expect(top.x).toBe(-size / 2)
  expect(top.y).toBe(-size)

  const topRight = rect.getPositionFromOrigin(DrawOrigin.TOP_RIGHT)
  expect(topRight.x).toBe(0)
  expect(topRight.y).toBe(-size)

  const centerLeft = rect.getPositionFromOrigin(DrawOrigin.CENTER_LEFT)
  expect(centerLeft.x).toBe(-size)
  expect(centerLeft.y).toBe(-size / 2)

  const center = rect.getPositionFromOrigin(DrawOrigin.CENTER)
  expect(center.x).toBe(-size / 2)
  expect(center.y).toBe(-size / 2)

  const centerRight = rect.getPositionFromOrigin(DrawOrigin.CENTER_RIGHT)
  expect(centerRight.x).toBe(0)
  expect(centerRight.y).toBe(-size / 2)

  const bottomLeft = rect.getPositionFromOrigin(DrawOrigin.BOTTOM_LEFT)
  expect(bottomLeft.x).toBe(-size)
  expect(bottomLeft.y).toBe(0)

  const bottom = rect.getPositionFromOrigin(DrawOrigin.BOTTOM)
  expect(bottom.x).toBe(-size / 2)
  expect(bottom.y).toBe(0)

  const bottomRight = rect.getPositionFromOrigin(DrawOrigin.BOTTOM_RIGHT)
  expect(bottomRight.x).toBe(0)
  expect(bottomRight.y).toBe(0)
})

test("that bounds are correct when origin is applied", () => {
  const size = 10
  const rect = new Rect(new Vector(), size, size)

  const topLeft = rect.getBoundsFromOrigin(DrawOrigin.TOP_LEFT)
  expect(topLeft.pos.x).toBe(-size)
  expect(topLeft.pos.y).toBe(-size)

  const top = rect.getBoundsFromOrigin(DrawOrigin.TOP)
  expect(top.pos.x).toBe(-size / 2)
  expect(top.pos.y).toBe(-size)

  const topRight = rect.getBoundsFromOrigin(DrawOrigin.TOP_RIGHT)
  expect(topRight.pos.x).toBe(0)
  expect(topRight.pos.y).toBe(-size)

  const centerLeft = rect.getBoundsFromOrigin(DrawOrigin.CENTER_LEFT)
  expect(centerLeft.pos.x).toBe(-size)
  expect(centerLeft.pos.y).toBe(-size / 2)

  const center = rect.getBoundsFromOrigin(DrawOrigin.CENTER)
  expect(center.pos.x).toBe(-size / 2)
  expect(center.pos.y).toBe(-size / 2)

  const centerRight = rect.getBoundsFromOrigin(DrawOrigin.CENTER_RIGHT)
  expect(centerRight.pos.x).toBe(0)
  expect(centerRight.pos.y).toBe(-size / 2)

  const bottomLeft = rect.getBoundsFromOrigin(DrawOrigin.BOTTOM_LEFT)
  expect(bottomLeft.pos.x).toBe(-size)
  expect(bottomLeft.pos.y).toBe(0)

  const bottom = rect.getBoundsFromOrigin(DrawOrigin.BOTTOM)
  expect(bottom.pos.x).toBe(-size / 2)
  expect(bottom.pos.y).toBe(0)

  const bottomRight = rect.getBoundsFromOrigin(DrawOrigin.BOTTOM_RIGHT)
  expect(bottomRight.pos.x).toBe(0)
  expect(bottomRight.pos.y).toBe(0)

  const bounds = [topLeft, top, topRight, centerLeft, center, centerRight, bottomLeft, bottom, bottomRight]
  for (const { width, height } of bounds) {
    expect(width).toBe(size)
    expect(height).toBe(size)
  }
})

test("that draw correctly handles origin when not default", () => {
  const size = 10
  const rect = new Rect(new Vector(), size, size)

  const contextMock = getContextMock()
  const contextSpy = vi.spyOn(contextMock, "translate")
  const rectSpy = vi.spyOn(rect, "getPositionFromOrigin")

  const origin = DrawOrigin.CENTER
  rect.draw(contextMock, { origin })

  expect(contextSpy).toHaveBeenCalledWith(-size / 2, -size / 2)
  expect(rectSpy).toHaveBeenCalledWith(origin)
})

test("that draw correctly handles origin when default", () => {
  const size = 10
  const rect = new Rect(new Vector(), size, size)

  const contextMock = getContextMock()
  const contextSpy = vi.spyOn(contextMock, "translate")
  const rectSpy = vi.spyOn(rect, "getPositionFromOrigin")

  const origin = DrawOrigin.BOTTOM_RIGHT
  rect.draw(contextMock, { origin })

  expect(contextSpy).toHaveBeenCalledWith(0, 0)
  expect(rectSpy).not.toHaveBeenCalledWith(origin)
})

test("that draw handles fill correctly", () => {
  const rect = new Rect()
  const contextMock = getContextMock()
  const contextSpy = vi.spyOn(contextMock, "fill")

  rect.draw(contextMock, { fill: "" })
  expect(contextSpy).not.toHaveBeenCalled()

  const fill = "#f00"
  rect.draw(contextMock, { fill })
  expect(contextMock.fillStyle).toBe(fill)
  expect(contextSpy).toHaveBeenCalled()
})

test("that draw handles stroke correctly", () => {
  const rect = new Rect()
  const contextMock = getContextMock()
  const contextSpy = vi.spyOn(contextMock, "stroke")

  rect.draw(contextMock)
  expect(contextSpy).not.toHaveBeenCalled()

  const stroke = "#f00"
  rect.draw(contextMock, { stroke })
  expect(contextMock.strokeStyle).toBe(stroke)
  expect(contextSpy).toHaveBeenCalled()
})
