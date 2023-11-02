import { DrawOrigin } from "./draw-origin"
import Rect from "./rect"
import Vector from "./vector"

const canvas = document.createElement("canvas")
const context = canvas.getContext("2d") as CanvasRenderingContext2D
const width = (canvas.width = 600)
const height = (canvas.height = 400)
document.body.appendChild(canvas)

const rect = new Rect(new Vector(canvas.width / 2, canvas.height / 2), 100, 100)
const container = new Rect(new Vector(canvas.width / 2, canvas.height / 2), 200, 200)

container.draw(context, { stroke: "#000", origin: DrawOrigin.CENTER })
rect.draw(context, { fill: "#F00", origin: DrawOrigin.BOTTOM_RIGHT })
