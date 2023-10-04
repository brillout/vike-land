import {
  colorsDefault,
  fromHumanReadable,
  fromHumanReadableAxis,
  Hammer,
  toHumanReadable,
  type Colors,
  type PerspectiveUserControlable,
} from '../Hammer'

const presetsColor: Record<string, Colors> = {
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
  default: { ...colorsDefault },
}
const presets: Record<string, Preset> = {
  oldest: {
    rotation2D: 0,
    rotate: { x: -0.13, y: -6.63, z: -1.2 },
    // translate: { x: -2.6, y: 7, z: 0 },
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
  latest2: {
    rotation2D: 13,
    rotate: { x: -0.4, y: 23.5, z: 0 },
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
}
type Preset = {
  rotation2D: number
  rotate: { x: number; y: number; z: number }
  handleDiameter?: number
  handleLength?: number
}

const perspectiveDefault = presets.latest2

let changeRotation2D: (n: number) => void
let getRotation2D: () => number
let changeHandleDiameter: (n: number) => void
let changeHandleLength: (n: number) => void
let updateColorInputs: () => void
main()

function getElements() {
  return {
    presets: document.getElementById('presets')!,
    presetsColor: document.getElementById('presetsColor')!,
    colorPicker: document.getElementById('colorPicker')!,
    handleDiameterPicker: document.getElementById('handleDiameterPicker')!,
    handleLengthPicker: document.getElementById('handleLengthPicker')!,
    zdogView: document.getElementById('zdogView')!,
    faviconSize: document.getElementById('faviconSize')!,
    autoSpinning: document.getElementById('autoSpinning')!,
    reset: document.querySelector('button#reset') as HTMLButtonElement,
    download: document.querySelector('button#download') as HTMLButtonElement,
    hideBackLightningBolt: document.getElementById('hideBackLightningBolt')!,
    rotateX: document.getElementById('rotate-x')!,
    rotateY: document.getElementById('rotate-y')!,
    rotateZ: document.getElementById('rotate-z')!,
    rotate2D: document.getElementById('rotate2D')!,
    translateX: document.getElementById('translate-x')!,
    translateY: document.getElementById('translate-y')!,
    translateZ: document.getElementById('translate-z')!,
  }
}

function main() {
  const elements = getElements()

  const hammer = new Hammer(document.querySelector('#logo')!)
  hammer.dragRotate = true

  zdogViewInit(elements.zdogView)

  initPresets(elements.presets, hammer)
  initPresetsColor(elements.presetsColor, hammer)
  initColorInputs(elements.colorPicker, hammer)
  changeHandleDiameter = initHandlePicker(hammer, elements.handleDiameterPicker, 'handleDiameter').changeVal
  changeHandleLength = initHandlePicker(hammer, elements.handleLengthPicker, 'handleLength').changeVal
  initFaviconSize(elements.faviconSize)
  initAutoSpinning(elements.autoSpinning)
  initReset(elements.reset)
  initDownload(elements.download)
  initHighBackLightningBold(elements.hideBackLightningBolt, hammer)
  initPerspectiveControlers(hammer, elements)
  initRotate2D(elements.rotate2D)

  animate(hammer)

  hammer.init()
}

function initPerspectiveControlers(
  hammer: Hammer,
  {
    rotateX,
    rotateY,
    rotateZ,
  }: /*
    translateX,
    translateY,
    translateZ,
    */
  {
    rotateX: HTMLElement
    rotateY: HTMLElement
    rotateZ: HTMLElement
    translateX: HTMLElement
    translateY: HTMLElement
    translateZ: HTMLElement
  },
) {
  ;(
    [
      {
        elem: rotateX,
        type: 'rotate' as const,
        axis: 'x',
      },
      {
        elem: rotateY,
        type: 'rotate' as const,
        axis: 'y',
      },
      {
        elem: rotateZ,
        type: 'rotate' as const,
        axis: 'z',
      },
      /*
      {
        elem: translateX,
        type: 'translate' as const,
        axis: 'x',
      },
      {
        elem: translateY,
        type: 'translate' as const,
        axis: 'y',
      },
      {
        elem: translateZ,
        type: 'translate' as const,
        axis: 'z',
      },
      */
    ] as const
  ).forEach(({ elem, axis, type }) => {
    const getCoordinate = () => hammer.perspective[type]
    const { changeVal } = createNumberInput({
      elem,
      labelText: `<code>${axis}</code> (${type})`,
      getValue() {
        const n = toHumanReadable(getCoordinate())[axis]
        return n
      },
      setValue(n: number) {
        getCoordinate()[axis] = fromHumanReadableAxis(n)
      },
      defaultValue: perspectiveDefault.rotate[axis],
      hammer,
    })
    if (type === 'rotate') {
      if (!onPerspectiveChange) onPerspectiveChange = []
      onPerspectiveChange.push((perspectiveUserControlable) => {
        const n = perspectiveUserControlable[axis]
        changeVal(n, true)
      })
    }
  })
}

function initRotate2D(elemRotate2D: HTMLElement) {
  const elemLogo = document.getElementById('logo')!

  const toVal = (n: number) => `rotate(${n}deg)`
  const fromVal = (val: string) => parseInt(val.split('(')[1]!.split('deg)')[0]!, 10)

  const controls = createNumberInput({
    elem: elemRotate2D,
    labelText: `<code>degree</code> (2D rotation)`,
    defaultValue: perspectiveDefault.rotation2D,
    getValue() {
      const val = elemLogo.style.transform
      return fromVal(val)
    },
    setValue(n: number) {
      const val = toVal(n)
      elemLogo.style.transform = val
    },
    step: 1,
  })
  changeRotation2D = controls.changeVal
  getRotation2D = controls.getValue
}

function initHandlePicker(hammer: Hammer, handlePicker: Element, handleProp: 'handleDiameter' | 'handleLength') {
  return createNumberInput({
    elem: handlePicker,
    labelText: `<code>${handleProp}</code>`,
    getValue() {
      return hammer[handleProp]
    },
    setValue(n: number) {
      hammer[handleProp] = n
    },
    hammer,
  })
}

function createNumberInput({
  elem,
  labelText,
  getValue,
  setValue,
  defaultValue,
  step = 0.1,
  hammer,
}: {
  elem: Element
  labelText: string
  getValue: () => number
  setValue: (n: number) => void
  step?: number
  defaultValue?: number
  hammer?: Hammer
}) {
  const storeKey = elem.id!

  {
    const val = toFloat(getStoreValue(storeKey))
    if (val !== null) setValue(val)
    else if (defaultValue !== undefined) setValue(defaultValue)
  }

  // <div><label><input type="number" step="any" /></label><span id="r2-val"></span></div>
  elem.innerHTML = ''
  const parentEl = document.createElement('div')
  elem.appendChild(parentEl)
  const labelEl = document.createElement('label')
  parentEl.appendChild(labelEl)
  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'number')
  inputEl.setAttribute('step', step.toString())
  inputEl.style.width = '40px'
  inputEl.style.padding = '4px'
  labelEl.appendChild(inputEl)
  const valEl = document.createElement('span')
  valEl.innerHTML = ' ' + labelText
  parentEl.appendChild(valEl)

  const val = getValue()
  inputEl.value = String(val)

  const apply = (n: number) => {
    setValue(n)
    hammer?.reset()
  }

  inputEl.oninput = (ev: any) => {
    const val: string = ev.target!.value
    const n = toFloat(val)
    apply(n)
    setStoreValue(storeKey, val)
  }

  const changeVal = (n: number, alreadyApplied?: true) => {
    const val = String(n)
    inputEl.value = val
    if (!alreadyApplied) apply(n)
    setStoreValue(storeKey, val)
  }
  const controls = { changeVal, getValue }
  return controls
}

function zdogViewInit(zdogView: Element) {
  createCheckboxInput({
    elem: zdogView,
    labelText: 'Icon view',
    onToggle(isChecked: boolean) {
      document.body.classList[!isChecked ? 'add' : 'remove']('zdogView')
    },
  })
}

function initFaviconSize(faviconSize: Element) {
  createCheckboxInput({
    elem: faviconSize,
    labelText: 'Favicon size',
    onToggle(isChecked: boolean) {
      document.body.classList[isChecked ? 'add' : 'remove']('faviconSize')
    },
  })
}

function initAutoSpinning(autoSpinning: Element) {
  createCheckboxInput({
    elem: autoSpinning,
    labelText: 'Auto spinning',
    onToggle(isChecked: boolean) {
      isSpinning = isChecked
    },
  })
}

function initHighBackLightningBold(hideBackLightningBolt: HTMLElement, hammer: Hammer) {
  createCheckboxInput({
    elem: hideBackLightningBolt,
    labelText: 'Hide back lightning bolt',
    onToggle(isChecked: boolean) {
      hammer.hideBackLightningBolt = isChecked
    },
    applyValue() {
      hammer.reset()
    },
  })
}

function createCheckboxInput({
  elem,
  labelText,
  onToggle,
  applyValue,
}: {
  elem: Element
  labelText: string
  onToggle: (isChecked: boolean) => void
  applyValue?: (isChecked: boolean) => void
}) {
  elem.innerHTML = ''
  const labelEl = document.createElement('label')
  elem.appendChild(labelEl)
  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'checkbox')
  labelEl.appendChild(inputEl)
  labelEl.appendChild(document.createTextNode(labelText))

  const { id } = elem
  assert(id)
  const storeGet = () => (JSON.parse(getStoreValue(id) ?? '"{}"').isChecked as undefined | boolean) ?? false
  const storeToggle = () => {
    let isChecked = storeGet()
    isChecked = !isChecked
    setStoreValue(id, JSON.stringify({ isChecked }))
  }
  const updateUI = (isInit?: true) => {
    const isChecked = storeGet()
    onToggle(isChecked)
    inputEl.checked = isChecked
    if (!isInit) {
      applyValue?.(isChecked)
    }
  }
  inputEl.oninput = (ev) => {
    ev.preventDefault()
    storeToggle()
    updateUI()
  }
  updateUI(true)
}

function initReset(reset: HTMLButtonElement) {
  reset.onclick = () => {
    isSpinning = false
    clearStore()
    // @ts-ignore
    window.navigation.reload()
  }
}
function initDownload(download: HTMLButtonElement) {
  download.onclick = () => {
    const hammerSvg = document.querySelector('.hammer')!
    let content = hammerSvg.outerHTML
    content = content.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    const rotation2D = getRotation2D()
    content = content.replace('<path', `<g transform="rotate(${rotation2D},0,0)"><path`)
    content = content.replace('</svg>', '</g></svg>')
    downloadFile(content, 'image/svg+xml', 'vike-generated.svg')
  }
}

function downloadFile(content: string, mimeType: string, filename: string) {
  const a = document.createElement('a')
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
}

function initPresets(presetsEl: Element, hammer: Hammer) {
  addHeading('Settings', presetsEl)
  Object.entries(presets).forEach(([name, preset]) => {
    genPresetBtn(name, presetsEl, () => {
      changeHandleDiameter(preset.handleDiameter || hammer.handleDiameterDefault)
      changeHandleLength(preset.handleLength || hammer.handleLengthDefault)
      hammer.perspective.rotate = fromHumanReadable(preset.rotate)
      changeRotation2D(preset.rotation2D)
      hammer.reset()
    })
  })
}
function initPresetsColor(presetsColorEl: Element, hammer: Hammer) {
  addHeading('Colors', presetsColorEl)
  Object.entries(presetsColor).forEach(([name, colors]) => {
    genPresetBtn(name, presetsColorEl, () => {
      hammer.colors = colors
      hammer.reset()
      updateColorInputs()
    })
  })
}

function genPresetBtn(name: string, parentEl: Element, onclick: () => void) {
  const btnEl = document.createElement('button')
  btnEl.style.marginRight = '10px'
  btnEl.style.marginBottom = '7px'
  btnEl.innerHTML = ` ${name} `
  btnEl.onclick = onclick
  parentEl.appendChild(btnEl)
}

function addHeading(heading: string, el: Element) {
  const headingEl = document.createElement('h3')
  headingEl.innerHTML = heading
  el.prepend(headingEl)
}

function initColorInputs(colorPicker: Element, hammer: Hammer) {
  colorPicker.innerHTML = ''

  const updateInputs: (() => void)[] = []
  updateColorInputs = () => updateInputs.forEach((f) => f())

  objectKeys(hammer.colors).forEach((key) => {
    {
      const val = getStoreValue(key)
      if (val) hammer.colors[key] = val
    }

    // <div><label><input type="color" /></label><span id="r2-val"></span></div>
    const parentEl = document.createElement('div')
    colorPicker.appendChild(parentEl)
    const labelEl = document.createElement('label')
    parentEl.appendChild(labelEl)
    const inputEl = document.createElement('input')
    inputEl.setAttribute('type', 'color')
    labelEl.appendChild(inputEl)
    const valEl = document.createElement('span')
    parentEl.appendChild(valEl)

    const updateInput = () => {
      const val = hammer.colors[key]
      inputEl.value = val
      valEl.innerHTML = ` ${val} <code>${key}</code>`
    }
    const updateStore = () => {
      const val = hammer.colors[key]
      setStoreValue(key, val)
    }
    updateInput()
    updateInputs.push(() => {
      updateInput()
      updateStore()
    })

    inputEl.oninput = (ev: any) => {
      const val: string = ev.target!.value
      hammer.colors[key] = val
      updateInput()
      hammer.reset()
      updateStore()
    }
  })
}

var isSpinning: boolean
var isMouseover: boolean
var onPerspectiveChange: ((perspective: PerspectiveUserControlable) => void | undefined)[]
function animate(hammer: Hammer) {
  const logoElem = document.getElementById('logo')!
  logoElem.onmouseleave = () => {
    isMouseover = false
  }
  logoElem.onmouseenter = () => {
    isMouseover = true
  }
  /*
  hammer.onDragStart = () => {
    isMouseover = true
  }
  */
  render(hammer)
}

function render(hammer: Hammer) {
  requestAnimationFrame(() => {
    if (isSpinning && !isMouseover) {
      hammer.perspective.rotate.y += 0.015
      hammer.updatePerspective()
    }
    hammer.update()
    callOnPerspectiveChange(hammer)
    render(hammer)
  })
}

var rotateValue: string
function callOnPerspectiveChange(hammer: Hammer) {
  if (!hammer.illo) return
  const { x, y, z } = toHumanReadable(hammer.illo.rotate)
  const rotateValueNew = JSON.stringify({ x, y, z }, null, 2)
  const hasChanged = rotateValue !== rotateValueNew
  rotateValue = rotateValueNew
  if (!hasChanged) return
  const perspectiveUserControlable: PerspectiveUserControlable = { x, y, z }
  onPerspectiveChange.forEach((fn) => fn(perspectiveUserControlable))
}

function assert(condition: unknown): asserts condition {
  if (!condition) throw new Error('Assertion failed.')
}

function getStoreValue(key: string): null | string {
  return window.localStorage[`__vike_logo__input_${key}`] ?? null
}
function setStoreValue(key: string, val: string): void | undefined {
  window.localStorage[`__vike_logo__input_${key}`] = val
}
function clearStore() {
  window.localStorage.clear()
}

function toFloat(val: string): number
function toFloat(val: string | null): number | null
function toFloat(val: string | null): number | null {
  if (val === null) return null
  return parseFloat(val)
}

/** Same as Object.keys() but with type inference */
export function objectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj)
}
