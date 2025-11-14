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
const slopeSize = 2
const sideLength = 8
const lightningBoltSize = 0.135
const lightningBoltOffset = 0.3

const handleBottomLength1 = 3
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
  metal1: ColorValue
  metal2: ColorValue
  metal3: ColorValue
  metal4: ColorValue
  metal5: ColorValue
  metal6: ColorValue
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
  update() {
    if (this.illo) {
      this.illo.updateRenderGraph()
    }
  }
}

let gradientCounter = 0

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

type Options = {
  colors: Colors
  hideBackLightningBolt: boolean
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

  const { colors, hideBackLightningBolt } = hammer
  const options = { colors, hideBackLightningBolt }

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

  genHead(head, options)

  {
    const { handleDiameter, handleLength } = hammer
    genHandle(handle, colors, handleDiameter, handleLength)
  }

  return illo
}

function genHandle(handle: Zdog.Anchor, colors: Colors, handleDiameter: number, handleLength: number) {
  const handleStick = normalizeColor(colors.wood)
  const mountColor1 = normalizeColor(colors.metal4)
  const mountColor2 = normalizeColor(colors.metal5)
  const mountColor3 = normalizeColor(colors.metal6)

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
      translate: { x: 0, y: 0, z: (3 - slopeSize) + 0 - 1 - zOffset + (extend/2) },
    })
    zOffset += zOffsetAddendum / 2
  }

  if (legacyHandle) {
    mount(mountColor1, 1.4, 2)
  }
  mount(handleStick, 0, handleLength, 10)
  if (handleBottomLength2 !== null) mount(mountColor2, 1, handleBottomLength2)
  mount(mountColor3, 1.4, handleBottomLength1)
}

function genHead(head: Zdog.Anchor, options: Options) {
  genHeadSides(head, options.colors)
  genHeadFaces(head, options)
}

function genHeadSides(head: Zdog.Anchor, colors: Colors) {
  const headSide = genHeadSide(head, colors)

  headSide.copyGraph({
    addTo: head,
    rotate: { x: TAU / 2 },
    translate: { y: headLength },
  })
}

function genHeadFaces(head: Zdog.Anchor, options: Options) {
  genFaces(head, options)
  genFaceSlopes(head, options.colors)
}
function genFaces(head: Zdog.Anchor, options: Options) {
  const { colors } = options

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
    translate: { y: slopeSize },
    scale: { x: sideLength + slopeSize, y: headLength - 2 * slopeSize, z: 2 * sideLength },
    color: normalizeColor(colors.colorFaceRight ?? colors.metal3),
    addTo: head,
  })

  // Upper face
  const opposite = 2 * (sideLength + slopeSize)
  const face2 = face.copy({
    translate: { x: opposite, y: slopeSize },
    color: normalizeColor(colors.colorFaceUpper ?? colors.metal3),
    addTo: head,
  })

  // Front face
  var frontFaceGroup = new Zdog.Group({
    addTo: head,
  })
  face2.copy({
    rotate: { y: (-1 * TAU) / 4 },
    translate: { x: 0, y: slopeSize },
    color: normalizeColor(colors.colorFaceFront ?? colors.metal3),
    addTo: frontFaceGroup,
  })
  const viteLogo = genViteLogo(frontFaceGroup, colors)

  // Back face
  frontFaceGroup.copyGraph({
    rotate: { x: (-1 * TAU) / 2 },
    translate: { x: 0, y: headLength, z: 0 },
    addTo: head,
  })

  if (options.hideBackLightningBolt) {
    viteLogo.remove()
  }
}

function genFaceSlopes(head: Zdog.Anchor, colors: Colors) {
  const shape = (props: Zdog.ShapeOptions) =>
    new Zdog.Shape({
      stroke: STROKE,
      addTo: head,
      ...props,
    })

  const x = -1 * sideLength
  const y = headLength - 2 * slopeSize
  const z1 = sideLength + slopeSize
  const z2 = sideLength
  const faceSlope = shape({
    path: [
      { x, y: 0, z: z1 },
      { x: x - slopeSize, y: 0, z: z2 },
      { x: x - slopeSize, y, z: z2 },
      { x, y, z: z1 },
    ],
    translate: { y: slopeSize },
    color: normalizeColor(colors.metal2),
  })

  const opposite = 2 * sideLength + slopeSize
  faceSlope.copy({
    translate: { x: opposite, y: slopeSize, z: -1 * opposite },
    color: normalizeColor(colors.colorSlopeTop ?? colors.metal2),
  })
  faceSlope.copy({
    rotate: { x: TAU / 2 },
    translate: { y: headLength - slopeSize },
    color: normalizeColor(colors.colorSlopeBottom ?? colors.metal2),
  })
  faceSlope.copy({
    rotate: { x: TAU / 2 },
    translate: { x: opposite, y: headLength - slopeSize, z: 1 * opposite },
  })
}

function genHeadSide(head: Zdog.Anchor, colors: Colors) {
  const headSide = new Zdog.Anchor({
    addTo: head,
  })

  const shape = (props: Zdog.ShapeOptions) =>
    new Zdog.Shape({
      stroke: STROKE,
      addTo: headSide,
      ...props,
    })

  const colorEdge = normalizeColor(colors.metal2)
  const colorCorner = normalizeColor(colors.metal1)

  // east slope
  var EWSlope = shape({
    path: [
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: 1, z: 1 },
    ],
    translate: { x: sideLength },
    scale: { x: slopeSize, y: slopeSize, z: sideLength },
    color: normalizeColor(colors.colorSlopeTopRight ?? colors.metal2),
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
    color: normalizeColor(colors.colorSlopeLeft ?? colors.metal2),
  })

  // top left corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: slopeSize },
    ],
    translate: { x: sideLength, z: sideLength },
    color: normalizeColor(colors.colorCornerTopLeft ?? colorCorner),
  })

  // north slope
  NSSLope.copy({
    scale: { x: sideLength, y: slopeSize, z: -1 * slopeSize },
    translate: { z: -1 * sideLength },
    color: normalizeColor(colors.colorSlopeRight ?? colors.metal2),
  })

  // top right corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: -1 * slopeSize },
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
      { x: -slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: -1 * slopeSize },
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
    color: normalizeColor(colors.colorFaceRight ?? colors.metal3),
  })

  return headSide
}

function genViteLogo(group: Zdog.Group, colors: Colors) {
  //const width = 12

  //const translate = {x: 0, y: 0, z: 0}
  /*/
  const addTo = illo
  const translate = { x: -1 * (headLength / 2) + width / 2 , y: -2 * sideLength, z: sideLength + slopeSize + 2 }
  const rotate = undefined;
  /*/
  const addTo = group
  const lightningBoltPosition = { x: lightningBoltOffset, y: (headLength / 2) - 0.0, z: sideLength + slopeSize }
  const rotate = { z: (1 * TAU) / 4 }
  //*/
  const stroke = 0.6
  // Distance from the hammer => apparent thickness of the lightning bolt
  const thikness = stroke / 4
  const shape = new Zdog.Shape({
    addTo,
    rotate,
    path: [
      { x: 54.616 - 67, y: 2.783 - 31 },
      { x: 54.652 - 67, y: 25.572 - 31 },
      { x: 2.663 - 67, y: 20.929 - 31 },
      { x: 2.663 - 67, y: 20.940 - 31 },
      { x: 1.696 - 67, y: 20.831 - 31 },
      { x: -0.753 - 67, y: 22.226 - 31 },
      { x: -0.905 - 67, y: 23.120 - 31 },
      { x: 0.765 - 67, y: 24.363 - 31 },
      { x: 74.597 - 67, y: 61.867 - 31 },
      { x: 77.169 - 67, y: 61.973 - 31 },
      { x: 79.746 - 67, y: 61.870 - 31 },
      { x: 79.503 - 67, y: 39.082 - 31 },
      { x: 131.492 - 67, y: 43.724 - 31 },
      { x: 131.485 - 67, y: 43.711 - 31 },
      { x: 132.452 - 67, y: 43.821 - 31 },
      { x: 134.901 - 67, y: 42.426 - 31 },
      { x: 135.053 - 67, y: 41.532 - 31 },
      { x: 133.387 - 67, y: 40.289 - 31 },
      { x: 58.295 - 67, y: 0.496 - 31 },
      { x: 55.724 - 67, y: 0.390 - 31 },
    ],
    closed: true,
    stroke,
    fill: true,
    color: normalizeColor(colors.lightningBolt),
    translate: { x: lightningBoltPosition.x, y: lightningBoltPosition.y, z: lightningBoltPosition.z + thikness },
    scale: { x: lightningBoltSize, y: lightningBoltSize, z: lightningBoltSize },
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
