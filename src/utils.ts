export function rgbToHex(r: number, g: number, b: number) {
  if (r > 255 || g > 255 || b > 255) {
    throw new Error('Invalid color component')
  }

  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
}

