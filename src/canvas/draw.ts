import { rgbToHex } from '../utils'


const GRID_UNIT = 12
const GRID_SIZE = 17

export const P_SIZE = GRID_SIZE * GRID_UNIT


function loadImg() {
  const img = new Image()
  img.src = 'beach.jpg'

  return img
}


export function drawMainCanvas({
  ctx,
  canvasWidth,
  canvasHeight,
}: {
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
}) {
  const img = loadImg()

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
  }
}


export function drawPickerCanvas({
  ctx,
  img,
  mouseX,
  mouseY,
  canvasWidth,
  canvasHeight,
}: {
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  mouseX: number,
  mouseY: number,
  canvasWidth: number,
  canvasHeight: number,
}) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.imageSmoothingEnabled = false

  const sx = Math.min(Math.max(0, mouseX), canvasWidth - GRID_UNIT)
  const sy = Math.min(Math.max(0, mouseY), canvasHeight - GRID_UNIT)

  ctx.drawImage(
    img,
    sx,
    sy,
    GRID_SIZE,
    GRID_SIZE,
    0,
    0,
    P_SIZE,
    P_SIZE,
  )

  // GRID
  ctx.strokeStyle = '#ccf'
  ctx.lineWidth = 1

  ctx.beginPath()

  for (let gy = GRID_UNIT; gy < P_SIZE; gy += GRID_UNIT) {
    ctx.moveTo(0, gy)
    ctx.lineTo(P_SIZE, gy)
  }

  for (let gx = GRID_UNIT; gx < P_SIZE; gx += GRID_UNIT) {
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, P_SIZE)
  }

  ctx.stroke()

  // CENTER SQUARE
  ctx.beginPath()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 1
  ctx.strokeRect(
    P_SIZE / 2 - GRID_UNIT / 2,
    P_SIZE / 2 - GRID_UNIT / 2,
    GRID_UNIT,
    GRID_UNIT,
  )
  ctx.stroke()

  // CENTER PIXEL COLOR
  const imgData = ctx.getImageData(P_SIZE / 2, P_SIZE / 2, 1, 1).data

  if (!imgData) {
    return
  }

  const color = rgbToHex(imgData[0], imgData[1], imgData[2])

  // COLOR TEXT
  ctx.fillStyle = '#888'

  ctx.roundRect(72, 120, 62, 20, 2)
  ctx.fill()

  ctx.fillStyle = '#fff'
  ctx.fillText(`#${color.toUpperCase()}`, 78, 134)


  // CIRCLE
  const LINE_WIDTH = 12
  const RADIUS = P_SIZE / 2 - LINE_WIDTH / 2

  ctx.strokeStyle = `#${color}`
  ctx.lineWidth = LINE_WIDTH

  ctx.beginPath()
  ctx.arc(P_SIZE / 2, P_SIZE / 2, RADIUS, 0, 2 * Math.PI)
  ctx.stroke()
}
