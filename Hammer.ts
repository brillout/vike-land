export { Hammer }
export { toHumanReadable }
export { fromHumanReadable }
export { fromHumanReadableAxis }
export type { IlloElement }
export type { Colors }
export type { Perspective }
export type { PerspectiveUserControlable }

import * as Zdog from 'zdog'
const { TAU } = Zdog

/*******************************/
/********** DEFAULTS ***********/
/*******************************/

const headLength = 35

const handleDiameterDefault = 8
const handleLengthDefault = 18

const STROKE = 0
const slopeSize = 3
const sideLength = 8

// perspectiveDefault is meant to be overriden by setting hammer.perspective = /* ... */
const perspectiveDefault: Perspective = {
  rotate: fromHumanReadable({ x: 0, y: 0, z: 0 }),
  translate: { x: 0, y: 0, z: 0 },
}

const colorsDefault: Colors = {
  metal1: '#bdbdbd',
  metal2: '#b3b3b3',
  metal3: '#a6a6a6',
  metal4: '#949494',
  wood: '#a5764a',
  lightningBolt: '#fbcc56',
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

type Colors = {
  metal1: string
  metal2: string
  metal3: string
  metal4: string
  wood: string
  lightningBolt: string
}

class Hammer {
  constructor(outerElem: HTMLElement) {
    if (!outerElem) throw new Error('Missing `outerElem` argument')
    const illoElem = renderOuterHtml(outerElem)
    this.illoElem = illoElem
    this.colors = colorsDefault
    this.perspective = perspectiveDefault
    this.handleDiameter = handleDiameterDefault
    this.handleLength = handleLengthDefault
    this.hideBackLightningBolt = false
  }
  illo: Zdog.Illustration | undefined = undefined
  illoElem: IlloElement
  perspective: Perspective
  dragRotate: boolean = false
  onDragStart: (() => void) | undefined = undefined
  handleDiameter: number
  handleLength: number
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
  const handleStick = colors.wood
  const mountColor1 = colors.metal3
  const mountColor2 = colors.metal4

  let zOffset = 0
  const mount = (color: string, stroke: number, length: number = 0) => {
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
      length,
      fill: true,
      color,
      translate: { x: 0, y: 0, z: 0 - 1 - zOffset },
    })
    zOffset += zOffsetAddendum / 2
  }

  mount(mountColor2, 1, 3)
  mount(handleStick, 0, handleLength)
  mount(mountColor2, 1, 1)
  mount(mountColor1, 2, 3)
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
    color: colors.metal3,
    addTo: head,
  })

  // Upper face
  const opposite = 2 * (sideLength + slopeSize)
  const face2 = face.copy({
    translate: { x: opposite, y: slopeSize },
    addTo: head,
  })

  // Front face
  var frontFaceGroup = new Zdog.Group({
    addTo: head,
  })
  face2.copy({
    rotate: { y: (-1 * TAU) / 4 },
    translate: { x: 0, y: slopeSize },
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
    color: colors.metal2,
  })

  const opposite = 2 * sideLength + slopeSize
  faceSlope.copy({
    translate: { x: opposite, y: slopeSize, z: -1 * opposite },
  })
  faceSlope.copy({
    rotate: { x: TAU / 2 },
    translate: { y: headLength - slopeSize },
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

  const colorEdge = colors.metal2
  const colorCorner = colors.metal1

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
    color: colorEdge,
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
    color: colorEdge,
  })

  // south east corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: slopeSize },
    ],
    translate: { x: sideLength, z: sideLength },
    color: colorCorner,
  })

  // north slope
  NSSLope.copy({
    scale: { x: sideLength, y: slopeSize, z: -1 * slopeSize },
    translate: { z: -1 * sideLength },
    color: colorEdge,
  })

  // north east corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: -1 * slopeSize },
    ],
    translate: { x: sideLength, z: -1 * sideLength },
    color: colorCorner,
  })

  // west slope
  EWSlope.copy({
    scale: { x: -1 * slopeSize, y: slopeSize, z: sideLength },
    translate: { x: -1 * sideLength },
    color: colorEdge,
  })

  // north west corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: -slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: -1 * slopeSize },
    ],
    translate: { x: -1 * sideLength, z: -1 * sideLength },
    color: colorCorner,
  })

  // south west corner
  shape({
    path: [
      { x: 0, y: 0, z: 0 },
      { x: -1 * slopeSize, y: slopeSize, z: 0 },
      { x: 0, y: slopeSize, z: slopeSize },
    ],
    translate: { x: -1 * sideLength, z: sideLength },
    color: colorCorner,
  })

  // cover
  shape({
    path: [
      { x: -1, y: 0, z: 1 },
      { x: -1, y: 0, z: -1 },
      { x: 1, y: 0, z: -1 },
      { x: 1, y: 0, z: 1 },
    ],
    scale: { x: sideLength, y: sideLength, z: sideLength },
    color: colors.metal3,
  })

  return headSide
}

function genViteLogo(group: Zdog.Group, colors: Colors) {
  const scale = 0.04
  //const width = 12

  //const translate = {x: 0, y: 0, z: 0}
  /*/
  const addTo = illo
  const translate = { x: -1 * (headLength / 2) + width / 2 , y: -2 * sideLength, z: sideLength + slopeSize + 2 }
  const rotate = undefined;
  /*/
  const addTo = group
  const translate = { x: 6.5, y: 8.2, z: sideLength + slopeSize }
  const rotate = { z: (1 * TAU) / 4 }
  //*/
  const stroke = 0.6
  // Distance from the hammer => apparent thickness of the Vite logo
  const thikness = stroke / 4
  const shape = new Zdog.Shape({
    addTo,
    rotate,
    path: [
      { x: 292.965, y: 1.5744 },
      {
        bezier: [
          { x: 292.965, y: 1.5744 },
          { x: 156.801, y: 28.2552 },
          { x: 156.801, y: 28.2552 },
        ],
      },
      {
        bezier: [
          { x: 154.563, y: 28.6937 },
          { x: 152.906, y: 30.5903 },
          { x: 152.771, y: 32.8664 },
        ],
      },
      {
        bezier: [
          { x: 152.771, y: 32.8664 },
          { x: 144.395, y: 174.33 },
          { x: 144.395, y: 174.33 },
        ],
      },
      {
        bezier: [
          { x: 144.198, y: 177.662 },
          { x: 147.258, y: 180.248 },
          { x: 150.51, y: 179.498 },
        ],
      },
      {
        bezier: [
          { x: 150.51, y: 179.498 },
          { x: 188.42, y: 170.749 },
          { x: 188.42, y: 170.749 },
        ],
      },
      {
        bezier: [
          { x: 191.967, y: 169.931 },
          { x: 195.172, y: 173.055 },
          { x: 194.443, y: 176.622 },
        ],
      },
      {
        bezier: [
          { x: 194.443, y: 176.622 },
          { x: 183.18, y: 231.775 },
          { x: 183.18, y: 231.775 },
        ],
      },
      {
        bezier: [
          { x: 182.422, y: 235.487 },
          { x: 185.907, y: 238.661 },
          { x: 189.532, y: 237.56 },
        ],
      },
      {
        bezier: [
          { x: 189.532, y: 237.56 },
          { x: 212.947, y: 230.446 },
          { x: 212.947, y: 230.446 },
        ],
      },
      {
        bezier: [
          { x: 216.577, y: 229.344 },
          { x: 220.065, y: 232.527 },
          { x: 219.297, y: 236.242 },
        ],
      },
      {
        bezier: [
          { x: 219.297, y: 236.242 },
          { x: 201.398, y: 322.875 },
          { x: 201.398, y: 322.875 },
        ],
      },
      {
        bezier: [
          { x: 200.278, y: 328.294 },
          { x: 207.486, y: 331.249 },
          { x: 210.492, y: 326.603 },
        ],
      },
      {
        bezier: [
          { x: 210.492, y: 326.603 },
          { x: 212.5, y: 323.5 },
          { x: 212.5, y: 323.5 },
        ],
      },
      {
        bezier: [
          { x: 212.5, y: 323.5 },
          { x: 323.454, y: 102.072 },
          { x: 323.454, y: 102.072 },
        ],
      },
      {
        bezier: [
          { x: 325.312, y: 98.3645 },
          { x: 322.108, y: 94.137 },
          { x: 318.036, y: 94.9228 },
        ],
      },
      {
        bezier: [
          { x: 318.036, y: 94.9228 },
          { x: 279.014, y: 102.454 },
          { x: 279.014, y: 102.454 },
        ],
      },
      {
        bezier: [
          { x: 275.347, y: 103.161 },
          { x: 272.227, y: 99.746 },
          { x: 273.262, y: 96.1583 },
        ],
      },
      {
        bezier: [
          { x: 273.262, y: 96.1583 },
          { x: 298.731, y: 7.86689 },
          { x: 298.731, y: 7.86689 },
        ],
      },
      {
        bezier: [
          { x: 299.767, y: 4.27314 },
          { x: 296.636, y: 0.855181 },
          { x: 292.965, y: 1.5744 },
        ],
      },
    ],
    closed: true,
    stroke,
    fill: true,
    color: colors.lightningBolt,
    translate: { x: translate.x, y: translate.y, z: translate.z + thikness },
    scale: { x: scale, y: scale, z: scale },
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
