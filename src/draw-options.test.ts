import { expect, test } from "vitest"
import DrawOptions from "./draw-options"
import { DrawOrigin } from "./draw-origin"

test("that default values are logical", () => {
  const options = new DrawOptions()
  expect(options.fill).toBe("#000")
  expect(options.stroke).toBe("")
  expect(options.origin).toBe(DrawOrigin.BOTTOM_RIGHT)
})
