export { presetsColor }
export { presetsPerspective }
export { perspectiveDefault }
export { colorsDefault }

import { type Colors } from '../Hammer'

const colorsDefault: Colors = {
  metal1: '#c0c0c0',
  metal2: '#a8a8a8',
  metal3: ['#d8d8d8', '#b8b8b8'],
  metal4: 'rgba(0,0,0,0.2)',
  metal5: '#909090',
  metal6: ['#d6d6d6', '#949494'],
  wood: ['#ed983e', '#c35f22'],
  lightningBolt: '#ffeb3b',
  colorSlopeTop: ['#d9d9da', '#b8b7b8'],
  // colorSlopeLeft: ['#c8c8c8', '#a8a8a8'],
  colorSlopeLeft: '#c1c2c2',
  colorSlopeRight: '#999999',
  colorSlopeTopRight: '#d9d9d9',
  colorSlopeBottom: ['#b0b0b0', '#909090'],
  colorFaceRight: '#a2a2a3',
  colorFaceUpper: ['#b0b0b1', '#abacab'],
  colorFaceFront: ['#c7cac9', '#b0afaf'],
  colorCornerTopLeft: '#cacbcb',
  colorCornerTopRight: '#9b9b9a',
  colorCornerBottomRight: '#949494',
  colorCornerBottomLeft: '#979697',
}

const perspectiveDefault: Perspective = {
  rotation2D: 0,
  handleDiameter: 7.7,
  handleLength: 13.5,
  rotate: { x: 0.00, y: -7.16, z: -2 },
}

type Perspective = {
  rotation2D: number
  rotate: { x: number; y: number; z: number }
  handleDiameter?: number
  handleLength?: number
}

const presetsColor: Record<string, Colors> = {
  'colors-default': { ...colorsDefault },
  vivid: {
    metal1: 'cyan',
    metal2: 'red',
    metal3: 'blue',
    metal4: 'red',
    metal5: 'red',
    metal6: 'gray',
    wood: 'black',
    lightningBolt: 'black',
    colorSlopeTop: 'green',
    colorSlopeLeft: 'yellow',
    colorSlopeRight: 'orange',
    colorSlopeTopRight: 'navy',
    colorSlopeBottom: 'pink',
    colorFaceRight: 'blue',
    colorFaceUpper: 'purple',
    colorFaceFront: 'darkblue',
    colorCornerTopLeft: 'lime',
    colorCornerTopRight: 'magenta',
    colorCornerBottomRight: 'teal',
    colorCornerBottomLeft: 'gold',
  },
  gradient: {
    metal1: ['#ff6b6b', '#ff8c8c'],
    metal2: ['#4ecdc4', '#45b7aa'],
    metal3: ['#ffe66d', '#ffd93d'],
    metal4: ['#ff6b6b', '#ff8c8c'],
    metal5: ['#ff6b6b', '#ff8c8c'],
    metal6: ['#a8a8a8', '#c0c0c0'],
    wood: ['#8b4513', '#a0522d'],
    lightningBolt: ['#ffeb3b', '#fdd835'],
  },
  'colors-default-previous': {
    metal1: '#ababab',
    metal2: '#949494',
    metal3: '#757575',
    metal4: '#6e6e6e',
    metal5: '#7a7a7a',
    metal6: '#828282',
    wood: '#91512b',
    lightningBolt: '#fbbf28',
  },
  previous: {
    metal1: '#b5b5b5',
    metal2: '#949494',
    metal3: '#757575',
    metal4: '#6e6e6e',
    metal5: '#767676',
    metal6: '#828282',
    wood: '#91512b',
    lightningBolt: '#f7bc26',
  },
  darker: {
    metal1: '#a3a3a3',
    metal2: '#8f8f8f',
    metal3: '#757575',
    metal4: '#878787',
    metal5: '#878787',
    metal6: '#808080',
    wood: '#91512b',
    lightningBolt: '#f7bc26',
  },
  older2: {
    metal1: '#b0b0b0',
    metal2: '#949494',
    metal3: '#757575',
    metal4: '#878787',
    metal5: '#878787',
    metal6: '#808080',
    wood: '#91512b',
    lightningBolt: '#f7bc26',
  },
  older: {
    metal1: '#b5b5b5',
    metal2: '#949494',
    metal3: '#757575',
    metal4: '#787878',
    metal5: '#787878',
    metal6: '#707070',
    wood: '#91512b',
    lightningBolt: '#f7bc26',
  },
  brighter: {
    metal1: '#b5b5b5',
    metal2: '#949494',
    metal3: '#7a7a7a',
    metal4: '#787878',
    metal5: '#787878',
    metal6: '#7a7a7a',
    wood: '#91512b',
    lightningBolt: '#f7bc26',
  },
  ['too-bright']: {
    metal1: '#bdbdbd',
    metal2: '#b3b3b3',
    metal3: '#a6a6a6',
    metal4: '#9e9e9e',
    metal5: '#9e9e9e',
    metal6: '#a6a6a6',
    wood: '#a56c4a',
    lightningBolt: '#fbcc56',
  },
  oldest: {
    metal1: '#949494',
    metal2: '#828282',
    metal3: '#696969',
    metal4: '#707070',
    metal5: '#707070',
    metal6: '#696969',
    wood: '#96511d',
    lightningBolt: '#ecb018',
  },
}

const presetsPerspective: Record<string, Perspective> = {
  'perspective-default': perspectiveDefault,
  'perspective-default-previous': {
    rotation2D: 13,
    rotate: { x: -0.4, y: 23.5, z: 0 },
  },
  maud: {
    rotation2D: 0,
    handleLength: 10,
    rotate: { x: -0.1, y: -7, z: -2 },
  },
  classic: {
    rotation2D: 0,
    rotate: { x: -0.13, y: -6.63, z: -1.2 },
  },
  ['classic-long-handle']: {
    rotation2D: 0,
    handleLength: 20.5,
    rotate: { x: -0.13, y: -6.63, z: -1.2 },
  },
  ['oldest-mirrored']: {
    rotation2D: -21,
    rotate: { x: -0.7, y: 7.1, z: 0 },
  },
  previous: {
    rotation2D: 11,
    rotate: { x: -0.3, y: -6.63, z: 0 },
  },
  new1: {
    rotation2D: -23,
    rotate: { x: -0.4, y: 152.8, z: 0 },
  },
  new2: {
    rotation2D: -23,
    rotate: { x: -0.6, y: 159.19, z: 0 },
  },
  new3: {
    rotation2D: -23,
    rotate: { x: -0.4, y: 159.3, z: 0 },
  },
  favicon: {
    rotation2D: 29,
    rotate: { x: -0.4, y: 0.6, z: 0 },
  },
  latest: {
    rotation2D: -30,
    rotate: { x: -0.5, y: 23.2, z: 0 },
  },
  ['vertical-mirrored']: {
    handleDiameter: 8.2,
    handleLength: 21.8,
    rotation2D: 0,
    rotate: { x: -0.4, y: -56.41, z: 0 },
  },
  vertical: {
    handleDiameter: 8.2,
    handleLength: 21.8,
    rotation2D: 0,
    rotate: { x: -0.4, y: -55.6, z: 0 },
  },
  laying: {
    handleDiameter: 8.5,
    handleLength: 20.9,
    rotation2D: 66.3,
    rotate: { x: -0.4, y: -56.41, z: 0 },
  },
}
