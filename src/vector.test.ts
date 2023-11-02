import { expect, test } from "vitest"
import Vector from "./vector"

test("that default values are correct", () => {
  const vector = new Vector()
  expect(vector.x).toBe(0)
  expect(vector.y).toBe(0)
  expect(vector.z).toBe(0)
})

test("that argument order is logical", () => {
  expect(new Vector(1).x).toBe(1)
  expect(new Vector(1, 2).y).toBe(2)
  expect(new Vector(1, 2, 3).z).toBe(3)
})

test("that a vector can be copied", () => {
  const vector = new Vector(1, 2, 3)
  const copy = vector.copy()
  expect(copy.x).toBe(vector.x)
  expect(copy.y).toBe(vector.y)
  expect(copy.z).toBe(vector.z)
})

test("that a copied vector does not mutate the original vector", () => {
  const vector = new Vector(1, 2, 3)
  const copy = vector.copy()
  copy.x = 99
  copy.y = 99
  copy.z = 99
  expect(copy.x).not.toBe(vector.x)
  expect(copy.y).not.toBe(vector.y)
  expect(copy.z).not.toBe(vector.z)
})
