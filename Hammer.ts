export { Hammer }
export { toHumanReadable }
export { fromHumanReadable }
export { fromHumanReadableAxis }
export type { IlloElement }
export type { Colors }
export type { Perspective }
export type { PerspectiveUserControlable }

import * as Zdog from 'zdog'
import { colorsDefault } from './editor/presets'
const { TAU } = Zdog

/*****************************/
/********** PARAMS ***********/
/*****************************/

const headLength = 28.3
const sideLength = 8
const lightningBoltSize = 0.135
const lightningBoltOffset = 0.3

const slopeSize_ = 1.4
const slopeSizeEnhanced_ = 2
const handleExtraLength_ = 10

const handleBottomLength1 = 3.2
const handleBottomExtraWidth = 1.4
//*/
const handleBottomLength2 = null
/*/
const handleBottomLength2 = 0.5
//*/

//*/
const legacyHandle = false
/*/
const legacyHandle = true
//*/

const STROKE = 0

/*******************************/
/********** DEFAULTS ***********/
/*******************************/

const handleDiameterDefault = 8.6
const handleLengthDefault = 16.7

// perspectiveDefault is meant to be overriden by setting hammer.perspective = /* ... */
const perspectiveDefault: Perspective = {
  rotate: fromHumanReadable({ x: 0, y: 0, z: 0 }),
  translate: { x: 0, y: 0, z: 0 },
}

/******************************/
/*********** LOGIC ************/
/******************************/

// default to flat, filled shapes
;[Zdog.Shape, Zdog.Rect, Zdog.Ellipse].forEach(function (ItemClass) {
  //@ts-ignore
  ItemClass.defaults.fill = true
  //@ts-ignore
  ItemClass.defaults.stroke = false
})

type IlloElement = SVGSVGElement | HTMLCanvasElement

type Perspective = {
  rotate: {
    x: number
    y: number
    z: number
  }
  translate: {
    x: number
    y: number
    z: number
  }
}
type PerspectiveUserControlable = {
  x: number
  y: number
  z: number
}

type ColorValue = string | [string, string]

type Colors = {
  metalCorner: ColorValue
  metalSlope: ColorValue
  metalFace: ColorValue
  metalTop: ColorValue
  metalBottom2: ColorValue
  metalBottom: ColorValue
  wood: ColorValue
  lightningBolt: ColorValue
  colorSlopeTop?: ColorValue
  colorSlopeLeft?: ColorValue
  colorSlopeRight?: ColorValue
  colorSlopeTopRight?: ColorValue
  colorSlopeBottom?: ColorValue
  colorFaceRight?: ColorValue
  colorFaceUpper?: ColorValue
  colorFaceFront?: ColorValue
  colorCornerTopLeft?: ColorValue
  colorCornerTopRight?: ColorValue
  colorCornerBottomRight?: ColorValue
  colorCornerBottomLeft?: ColorValue
}

class Hammer {
  constructor(outerElem: HTMLElement) {
    if (!outerElem) throw new Error('Missing `outerElem` argument')
    const illoElem = renderOuterHtml(outerElem)
    this.illoElem = illoElem
    this.colors = colorsDefault
    this.perspective = perspectiveDefault
    this.handleDiameterDefault = handleDiameterDefault
    this.handleDiameter = handleDiameterDefault
    this.handleLength = handleLengthDefault
    this.handleLengthDefault = handleLengthDefault
    this.hideBackLightningBolt = false
    this.isForScreenshot = true
  }
  illo: Zdog.Illustration | undefined = undefined
  illoElem: IlloElement
  perspective: Perspective
  dragRotate: boolean = false
  onDragStart: (() => void) | undefined = undefined
  handleDiameter: number
  handleDiameterDefault: number
  handleLength: number
  handleLengthDefault: number
  hideBackLightningBolt: boolean
  darken: boolean = false
  hideHandle: boolean = false
  isForScreenshot: boolean = true
  reset() {
    this.init()
  }
  updatePerspective() {
    if (this.illo) {
      Object.assign(this.illo.rotate, this.perspective.rotate)
      Object.assign(this.illo.translate, this.perspective.translate)
      this.illo.updateRenderGraph()
    }
  }
  colors: Colors
  init() {
    this.illo = render(this)
    this.illo.updateRenderGraph()
  }
  getColors(): Colors {
    let { colors } = this
    if (this.darken) colors = darkenColors(this.colors)
    return colors
  }
  update() {
    if (this.illo) {
      this.illo.updateRenderGraph()
    }
  }
}

let gradientCounter = 0

function darkenColors(colors: Colors): Colors {
  const darkened: any = {}
  for (const key in colors) {
    const value = colors[key as keyof Colors]
    if (key === 'lightningBolt') {
      darkened[key] = value
    } else if (Array.isArray(value)) {
      darkened[key] = [darkenColor(value[0]), darkenColor(value[1])]
    } else {
      darkened[key] = darkenColor(value as string)
    }
  }
  return darkened
}
function darkenColor(color: string, amount: number = 0.9): string {
  if (color === 'red') return color
  if (color.startsWith('#')) {
    const hex = color.substring(1)
    const num = parseInt(hex, 16)
    const r = Math.floor(((num >> 16) & 0xff) * amount)
    const g = Math.floor(((num >> 8) & 0xff) * amount)
    const b = Math.floor((num & 0xff) * amount)
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')
  }
  return color
}

function createGradient(color1: string, color2: string): string {
  const gradientId = `gradient-dynamic-${gradientCounter++}`
  const defs = document.querySelector('svg.gradient-container defs') || createGradientContainer()

  const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  linearGradient.setAttribute('id', gradientId)
  linearGradient.setAttribute('gradientUnits', 'objectBoundingBox')
  linearGradient.setAttribute('x1', '0')
  linearGradient.setAttribute('y1', '0')
  linearGradient.setAttribute('x2', '1')
  linearGradient.setAttribute('y2', '1')

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '22%')
  stop1.setAttribute('stop-color', color1)

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '72%')
  stop2.setAttribute('stop-color', color2)

  linearGradient.appendChild(stop1)
  linearGradient.appendChild(stop2)
  defs.appendChild(linearGradient)

  return `url("#${gradientId}")`
}

function createGradientContainer(): SVGDefsElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'gradient-container')
  svg.style.display = 'none'

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  svg.appendChild(defs)
  document.body.appendChild(svg)

  return defs
}

function normalizeColor(color: ColorValue): string {
  if (typeof color === 'string') {
    return color
  }
  // color is [string, string]
  return createGradient(color[0], color[1])
}

function renderOuterHtml(outerElem: HTMLElement) {
  outerElem.style.position = 'relative'
  outerElem.innerHTML = `
<svg class="hammer"></svg>
<svg class="circle-square" width="100" height="100" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
 <path d="m5e-7 -1.5e-6v100h100v-100zm50 20c16.62 0 30 13.38 30 30 0 16.62-13.38 30-30 30-16.62 0-30-13.38-30-30 0-16.62 13.38-30 30-30z" fill="#fff" />
</svg>
<svg class="circle-square circle" width="100" height="100" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
 <ellipse cx="50" cy="50" rx="30" ry="30" fill="#eaeaea" />
</svg>
<style>
.circle-square {
  position: absolute;
  z-index: 1;
  width: 100%;
  left: 0;
  height: 100%;
  pointer-events: none;
}
.circle-square.circle {
  z-index: -1;
}
</style>
`
  const illoElem: SVGSVGElement = outerElem.querySelector('svg.hammer')!
  illoElem.style.height = '100%'
  illoElem.style.width = '100%'
  return illoElem
}

type Ctx = {
  colors: Colors
  hideBackLightningBolt: boolean
  slopeSize: number
  slopeSizeEnhanced: number
  isForScreenshot: boolean
}

function render(hammer: Hammer) {
  const { illoElem, perspective, dragRotate } = hammer
  illoElem.setAttribute('width', '100')
  illoElem.setAttribute('height', '100')
  const illo = new Zdog.Illustration({
    element: illoElem,
    dragRotate,
    onDragStart() {
      hammer.onDragStart?.()
    },
    onDragMove() {
      Object.assign(perspective.rotate, illo.rotate)
      Object.assign(perspective.translate, illo.translate)
    },
    //zoom: 4.3,
    rotate: perspective.rotate,
    translate: perspective.translate,
  })

  const colors = hammer.getColors()
  const { hideBackLightningBolt, isForScreenshot } = hammer

  // Compute slope sizes once based on screenshot mode
  const slopeSize = isForScreenshot ? slopeSize_ : slopeSizeEnhanced_
  const slopeSizeEnhanced = slopeSizeEnhanced_
  const handleExtraLength = isForScreenshot ? handleExtraLength_ : 0

  const ctx: Ctx = {
    slopeSize,
    slopeSizeEnhanced,
    isForScreenshot,
    colors,
    hideBackLightningBolt,
  }

  // anchor
  var hammerGroup = new Zdog.Group({
    addTo: illo,
    //translate: { y: -20, x: -20 },
    updateSort: true,
  })
  var handle = new Zdog.Anchor({
    addTo: hammerGroup,
    //*
    rotate: { x: TAU / 4 },
    //*/
  })
  var head = new Zdog.Anchor({
    addTo: hammerGroup,
    //*
    rotate: { z: (-1 * TAU) / 4 },
    translate: { x: -1 * (headLength / 2), y: -10 },
    //*/
  })

  genHead(head, ctx)

  {
    const { handleDiameter, handleLength } = hammer
    if (!hammer.hideHandle) {
      genHandle(handle, colors, handleDiameter, handleLength, slopeSize, handleExtraLength)
    }
  }

  return illo
}

function genHandle(
  handle: Zdog.Anchor,
  colors: Colors,
  handleDiameter: number,
  handleLength: number,
  slopeSize: number,
  handleExtraLength: number,
) {
  const handleStick = normalizeColor(colors.wood)
  const mountColor1 = normalizeColor(colors.metalTop)
  const mountColor2 = normalizeColor(colors.metalBottom2)
  const mountColor3 = normalizeColor(colors.metalBottom)

  let zOffset = 0
  const mount = (color: string, stroke: number, length: number, extend = 0) => {
    stroke = stroke / 2
    const zOffsetAddendum = stroke + length
    /*
    if( zOffset === 0 ) {
    } else {
      zOffset += zOffsetAddendum
    }
    */
    zOffset += zOffsetAddendum / 2
    new Zdog.Cylinder({
      addTo: handle,
      diameter: handleDiameter,
      stroke: stroke,
      length: length + extend,
      fill: true,
      color,
      translate: { x: 0, y: 0, z: 3 - slopeSize + 0 - 1 - zOffset + extend / 2 },
    })
    zOffset += zOffsetAddendum / 2
  }

  if (legacyHandle) {
    mount(mountColor1, 1.4, 2)
  }
  mount(handleStick, 0, handleLength, handleExtraLength)
  if (handleBottomLength2 !== null) mount(mountColor2, 1, handleBottomLength2)
  mount(mountColor3, handleBottomExtraWidth, handleBottomLength1)
}

function genHead(head: Zdog.Anchor, ctx: Ctx) {
  genHeadSides(head, ctx)
  genHeadFaces(head, ctx)
}

function genHeadSides(head: Zdog.Anchor, ctx: Ctx) {
  genHeadSide(head, ctx, true)

  genHeadSide(head, ctx, false, {
    rotate: { x: TAU / 2 },
    translate: { y: headLength },
  })
}

function genHeadFaces(head: Zdog.Anchor, ctx: Ctx) {
  genFaces(head, ctx)
  genFaceSlopes(head, ctx)
}
function genFaces(head: Zdog.Anchor, ctx: Ctx) {
  const { colors, slopeSize, slopeSizeEnhanced, hideBackLightningBolt } = ctx

  const shape = (props: Zdog.ShapeOptions) =>
    new Zdog.Shape({
      stroke: STROKE,
      ...props,
    })

  // Bottom face
  const face = shape({
    path: [
      { x: -1, y: 0, z: 0.5 },
      { x: -1, y: 0, z: -0.5 },
      { x: -1, y: 1, z: -0.5 },
      { x: -1, y: 1, z: 0.5 },
    ],
    translate: { y: slopeSizeEnhanced },
    scale: {
      x: sideLength + slopeSize,
      y: headLength - slopeSize - slopeSizeEnhanced,
      z: 2 * sideLength,
    },
    color: normalizeColor(colors.colorFaceRight ?? colors.metalFace),
    addTo: head,
  })

  // Upper face
  const oppositeEnhanced = 2 * sideLength + slopeSize + slopeSizeEnhanced
  const face2 = face.copy({
    translate: { x: oppositeEnhanced, y: slopeSizeEnhanced },
    color: normalizeColor(colors.colorFaceUpper ?? colors.metalFace),
    addTo: head,
  })

  // Front face
  const faceFrontGroup = new Zdog.Group({ addTo: head })
  face2.copy({
    rotate: { y: (-1 * TAU) / 4 },
    translate: { x: 0, y: slopeSize, z: slopeSizeEnhanced - slopeSize },
    addTo: faceFrontGroup,
  })

  // Back face
  const faceBackGroup = new Zdog.Group({ addTo: head })
  face2.copy({
    rotate: { y: (-1 * TAU) / 4, x: (-1 * TAU) / 2 },
    translate: { x: 0, y: headLength - slopeSize, z: -(slopeSizeEnhanced - slopeSize) },
    color: normalizeColor(colors.colorFaceFront ?? colors.metalFace),
    addTo: faceBackGroup,
  })

  genLightningBolt(colors, ctx, true, { addTo: faceFrontGroup })
  genLightningBolt(colors, ctx, false, { addTo: faceBackGroup })
  // if (!hideBackLightningBolt)
}

function genFaceSlopes(head: Zdog.Anchor, ctx: Ctx) {
  const { colors, slopeSize, slopeSizeEnhanced } = ctx
  const shape = (props: Zdog.ShapeOptions) =>
    new Zdog.Shape({
      stroke: STROKE,
      addTo: head,
      ...props,
    })

  const faceSlope = (
    slopeSizeEnhanced = slopeSize,
    slopeSizeEnhanced2 = slopeSize,
    props: Zdog.ShapeOptions,
  ) => {
    const x = -1 * sideLength
    const y = headLength - slopeSize - slopeSizeEnhanced
    return shape({
      path: [
        { x, y: 0, z: sideLength + slopeSizeEnhanced },
        { x: x - slopeSizeEnhanced2, y: 0, z: sideLength },
        { x: x - slopeSizeEnhanced2, y, z: sideLength },
        { x, y, z: sideLength + slopeSizeEnhanced },
      ],
      translate: { y: slopeSizeEnhanced },
      color: normalizeColor(colors.metalSlope),
      ...props,
    })
  }

  const opposite = 2 * sideLength + slopeSize
  const oppositeEnhanced = 2 * sideLength + slopeSizeEnhanced

  faceSlope(slopeSizeEnhanced, slopeSizeEnhanced, {})
  faceSlope(slopeSizeEnhanced, slopeSizeEnhanced, {
    translate: { x: oppositeEnhanced, y: slopeSizeEnhanced, z: -1 * oppositeEnhanced },
    color: normalizeColor(colors.colorSlopeTop ?? colors.metalSlope),
  })

  faceSlope(slopeSizeEnhanced, undefined, {
    rotate: { x: TAU / 2 },
    translate: { y: headLength - slopeSize },
    color: normalizeColor(colors.colorSlopeBottom ?? colors.metalSlope),
  })
  faceSlope(undefined, undefined, {
    rotate: { x: TAU / 2 },
    translate: { x: opposite, y: headLength - slopeSize, z: 1 * opposite },
  })
}

function genHeadSide(
  head: Zdog.Anchor,
  ctx: Ctx,
  isFront: boolean,
  anchorOptions: Zdog.AnchorOptions = {},
) {
  const { colors, slopeSize, slopeSizeEnhanced, isForScreenshot } = ctx
  const headSide = new Zdog.Anchor({
    addTo: head,
    ...anchorOptions,
  })

  const shape = (props: Zdog.ShapeOptions) =>
    new Zdog.Shape({
      stroke: STROKE,
      addTo: headSide,
      ...props,
    })

  const colorEdge = normalizeColor(colors.metalSlope)
  const colorCorner = normalizeColor(colors.metalCorner)

  // east slope
  var EWSlope = shape({
    path: [
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: 1, z: 1 },
    ],
    translate: { x: sideLength },
    scale: { x: slopeSizeEnhanced, y: slopeSizeEnhanced, z: sideLength },
    color: normalizeColor(colors.colorSlopeTopRight ?? colors.metalSlope),
  })

  // south slope
  var NSSLope = shape({
    path: [
      { z: 0, y: 0, x: 1 },
      { z: 0, y: 0, x: -1 },
      { z: 1, y: 1, x: -1 },
      { z: 1, y: 1, x: 1 },
    ],
    translate: { z: sideLength },
    scale: { x: sideLength, y: slopeSize, z: slopeSize },
    color: normalizeColor(colors.colorSlopeLeft ?? colors.metalSlope),
  })

  // top left corner
  if (!isFront || !isForScreenshot)
    shape({
      path: [
        { x: 0, y: 0, z: 0 },
        { x: slopeSizeEnhanced, y: slopeSize, z: 0 },
        { x: 0, y: slopeSize, z: slopeSizeEnhanced },
      ],
      translate: { x: sideLength, z: sideLength },
      color: normalizeColor(colors.colorCornerTopLeft ?? colorCorner),
    })

  // north slope
  NSSLope.copy({
    scale: { x: sideLength, y: slopeSizeEnhanced, z: -1 * slopeSizeEnhanced },
    translate: { z: -1 * sideLength },
    color: normalizeColor(colors.colorSlopeRight ?? colors.metalSlope),
  })

  // top right corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: slopeSizeEnhanced, y: slopeSizeEnhanced, z: 0 },
      { x: 0, y: slopeSizeEnhanced, z: -1 * slopeSizeEnhanced },
    ],
    translate: { x: sideLength, z: -1 * sideLength },
    color: normalizeColor(colors.colorCornerTopRight ?? colorCorner),
  })

  // west slope
  EWSlope.copy({
    scale: { x: -1 * slopeSize, y: slopeSize, z: sideLength },
    translate: { x: -1 * sideLength },
    color: colorEdge,
  })

  // bottom right corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: -slopeSize, y: slopeSizeEnhanced, z: 0 },
      { x: 0, y: slopeSizeEnhanced, z: -1 * slopeSizeEnhanced },
    ],
    translate: { x: -1 * sideLength, z: -1 * sideLength },
    color: normalizeColor(colors.colorCornerBottomRight ?? colorCorner),
  })

  // bottom left corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: -1 * slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: slopeSize },
    ],
    translate: { x: -1 * sideLength, z: sideLength },
    color: normalizeColor(colors.colorCornerBottomLeft ?? colorCorner),
  })

  /* Failed attempt to remove aliasing issues
  const y = 0.02
  */
  const y = 0

  // cover
  shape({
    path: [
      { x: -1, y, z: 1 },
      { x: -1, y, z: -1 },
      { x: 1, y, z: -1 },
      { x: 1, y, z: 1 },
    ],
    scale: { x: sideLength, y: sideLength, z: sideLength },
    color: normalizeColor(colors.colorFaceRight ?? colors.metalFace),
  })

  return headSide
}

function genLightningBolt(colors: Colors, ctx: Ctx, isFront: boolean, props: Zdog.ShapeOptions) {
  const { slopeSize, slopeSizeEnhanced } = ctx

  //const width = 12

  //const translate = {x: 0, y: 0, z: 0}
  /*/
  const addTo = illo
  const translate = { x: -1 * (headLength / 2) + width / 2 , y: -2 * sideLength, z: sideLength + slopeSize + 2 }
  const rotate = undefined;
  /*/
  const invert = isFront ? 1 : -1
  const lightningBoltPosition = {
    x: lightningBoltOffset,
    y: headLength / 2 - (invert * (slopeSizeEnhanced - slopeSize)) / 2,
    z: invert * (sideLength + slopeSizeEnhanced),
  }
  var rotate = { z: (1 * TAU) / 4, x: (-1 * TAU) / 2 }
  //*/
  const stroke = 0.6
  // Distance from the hammer => apparent thickness of the lightning bolt
  const thikness = stroke / 4
  const shape = new Zdog.Shape({
    rotate,
    path: [
      { x: 54.616 - 67, y: 2.783 - 31 },
      { x: 54.652 - 67, y: 25.572 - 31 },
      { x: 2.663 - 67, y: 20.929 - 31 },
      { x: 2.663 - 67, y: 20.94 - 31 },
      { x: 1.696 - 67, y: 20.831 - 31 },
      { x: -0.753 - 67, y: 22.226 - 31 },
      { x: -0.905 - 67, y: 23.12 - 31 },
      { x: 0.765 - 67, y: 24.363 - 31 },
      { x: 74.597 - 67, y: 61.867 - 31 },
      { x: 77.169 - 67, y: 61.973 - 31 },
      { x: 79.746 - 67, y: 61.87 - 31 },
      { x: 79.503 - 67, y: 39.082 - 31 },
      { x: 131.492 - 67, y: 43.724 - 31 },
      { x: 131.485 - 67, y: 43.711 - 31 },
      { x: 132.452 - 67, y: 43.821 - 31 },
      { x: 134.901 - 67, y: 42.426 - 31 },
      { x: 135.053 - 67, y: 41.532 - 31 },
      { x: 133.387 - 67, y: 40.289 - 31 },
      { x: 58.295 - 67, y: 0.496 - 31 },
      { x: 55.724 - 67, y: 0.39 - 31 },
    ],
    closed: true,
    stroke,
    fill: true,
    color: normalizeColor(colors.lightningBolt),
    translate: {
      x: lightningBoltPosition.x,
      y: lightningBoltPosition.y,
      z: lightningBoltPosition.z + invert * thikness,
    },
    scale: { x: lightningBoltSize, y: lightningBoltSize, z: lightningBoltSize },
    ...props,
  })
  return shape
}

function toHumanReadable({ x, y, z }: { x: number; y: number; z: number }) {
  const f = (v: number) => {
    v = (v * 16) / TAU
    v = Math.floor(v * 100) / 100
    return v
  }
  x = f(x)
  y = f(y)
  z = f(z)
  return { x, y, z }
}
function fromHumanReadableAxis(n: number) {
  return TAU * (n / 16)
}
function fromHumanReadable({ x, y, z }: { x: number; y: number; z: number }) {
  const f = fromHumanReadableAxis
  x = f(x)
  y = f(y)
  z = f(z)
  return { x, y, z }
}
