import cn from 'classnames'
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { rgbToHex } from '../utils'

import Picker from './picker'

import {
  P_SIZE,
  drawMainCanvas,
  drawPickerCanvas,
} from './draw'

import styles from './style.module.css'


const C_WIDTH = 1280
const C_HEIGHT = 720


export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pickerCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickedColor, setPickedColor] = useState<string | null>(null)

  const [canvasScale, setCanvasScale] = useState(1)

  const canvasWidth = useMemo(() => C_WIDTH * canvasScale, [canvasScale])
  const canvasHeight = useMemo(() => C_HEIGHT * canvasScale, [canvasScale])


  useEffect(() => {
    if (!pickerOpen) {
      return
    }


    const follow = (e: globalThis.MouseEvent) => {
      if (!canvasRef.current || !pickerCanvasRef.current) {
        return
      }

      const canvas = canvasRef.current
      const pickerCanvas = pickerCanvasRef.current

      const rect = canvas.getBoundingClientRect()
      const pickCtx = pickerCanvas.getContext('2d')

      if (!pickCtx) {
        return
      }

      const left = rect?.left || 0 + window.scrollX
      const right = rect?.right || 0 + window.scrollX
      const top = rect?.top || 0 + window.scrollY
      const bottom = rect?.bottom || 0 + window.scrollY


      // if mouse is outside main canvas, hide picker canvas
      if (
        e.clientX < left
        || e.clientX > right
        || e.clientY < top
        || e.clientY > bottom
      ) {
        pickerCanvas.style.setProperty('display', 'none')

        return
      }

      if (pickerCanvas.style.getPropertyValue('display') === 'none') {
        pickerCanvas.style.setProperty('display', 'block')
      }

      pickerCanvas.style.setProperty('top', `${e.pageY - P_SIZE / 2}px`)
      pickerCanvas.style.setProperty('left', `${e.pageX - P_SIZE / 2}px`)

      const x = Math.floor(e.clientX - left)
      const y = Math.floor(e.clientY - top)

      drawPickerCanvas({
        ctx: pickCtx,
        img: canvas,
        mouseX: x,
        mouseY: y,
        canvasWidth,
        canvasHeight,
      })
    }


    window.addEventListener('mousemove', follow)

    return () => {
      window.removeEventListener('mousemove', follow)
    }
  }, [pickerOpen, canvasWidth, canvasHeight])


  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true })

    if (!ctx) {
      return
    }

    drawMainCanvas({
      ctx,
      canvasWidth,
      canvasHeight,
    })
  }, [canvasHeight, canvasWidth])


  const handleColorPick: MouseEventHandler<HTMLCanvasElement> = useCallback(() => {
    const ctx = pickerCanvasRef.current?.getContext('2d')

    if (!ctx) {
      return
    }

    // CENTER PIXEL COLOR
    const imgData = ctx.getImageData(P_SIZE / 2, P_SIZE / 2, 1, 1).data

    if (!imgData) {
      return
    }

    const color = rgbToHex(imgData[0], imgData[1], imgData[2])

    setPickedColor(`#${color.toUpperCase()}`)
  }, [])


  const handleCanvasScale = useCallback(() => {
    setCanvasScale((prev) => {
      if (prev === 1) {
        return 4
      }

      if (prev === 4) {
        return 16
      }

      return 1
    })
  }, [])

  const handleOpenColorPicker = useCallback(() => {
    setPickerOpen((prev) => !prev)
  }, [])


  return (
    <>
      <div className={styles.toolbar}>
        <button
          className={
            cn(
              styles.canvasScaleButton,
              { [styles.buttonSelected]: canvasScale !== 1 },
            )
          }
          onClick={handleCanvasScale}
        >
          {canvasScale}x canvas scale
        </button>

        <button
          className={
            cn(
              styles.colorPickerButton,
              { [styles.buttonSelected]: pickerOpen },
            )
          }
          onClick={handleOpenColorPicker}
        >
          <Picker />
        </button>

        <div
          className={styles.colorBox}
          style={{ backgroundColor: pickedColor || '#fff0' }}
        />
        <span>{pickedColor}</span>
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      >
        Main canvas
      </canvas>

      <canvas
        className={styles.pickerCanvas}
        ref={pickerCanvasRef}
        width={P_SIZE}
        height={P_SIZE}
        onMouseDown={handleColorPick}
      >
        Color picker canvas
      </canvas>
    </>
  )
}
