import {
  fromHumanReadable,
  fromHumanReadableAxis,
  Hammer,
  toHumanReadable,
  type PerspectiveUserControlable,
} from '../Hammer'
import { presetsColor, presetsPerspective, perspectiveDefault } from './presets'

let changeRotation2D: (n: number) => void
let getRotation2D: () => number
let changeHandleDiameter: (n: number) => void
let changeHandleLength: (n: number) => void
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
  initPresetsColor(elements.presetsColor, hammer, elements.colorPicker)
  initColorInputs(elements.colorPicker, hammer)
  changeHandleDiameter = initHandlePicker(hammer, elements.handleDiameterPicker, 'handleDiameter', perspectiveDefault.handleDiameter).changeVal
  changeHandleLength = initHandlePicker(hammer, elements.handleLengthPicker, 'handleLength', perspectiveDefault.handleLength).changeVal
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

function initHandlePicker(hammer: Hammer, handlePicker: Element, handleProp: 'handleDiameter' | 'handleLength', defaultValue?: number) {
  return createNumberInput({
    elem: handlePicker,
    labelText: `<code>${handleProp}</code>`,
    getValue() {
      return hammer[handleProp]
    },
    setValue(n: number) {
      hammer[handleProp] = n
    },
    defaultValue,
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
    const val = toFloat(getStoreValue(storeKey) as any)
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
  const storeGet = () => ((getStoreValue(id) as any)?.isChecked as undefined | boolean) ?? false
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

    // Extract gradients from the gradient-container
    const gradientContainer = document.querySelector('svg.gradient-container defs')
    if (gradientContainer && gradientContainer.children.length > 0) {
      const defsContent = Array.from(gradientContainer.children)
        .map(el => el.outerHTML)
        .join('\n    ')
      // Insert defs section after the opening svg tag
      content = content.replace('<svg xmlns="http://www.w3.org/2000/svg" ',
        `<svg xmlns="http://www.w3.org/2000/svg" `)
      content = content.replace('>', `>\n  <defs>\n    ${defsContent}\n  </defs>`)
    }

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
  Object.entries(presetsPerspective).forEach(([name, preset]) => {
    genPresetBtn(name, presetsEl, () => {
      changeHandleDiameter(preset.handleDiameter || hammer.handleDiameterDefault)
      changeHandleLength(preset.handleLength || hammer.handleLengthDefault)
      hammer.perspective.rotate = fromHumanReadable(preset.rotate)
      changeRotation2D(preset.rotation2D)
      hammer.reset()
    })
  })
}
function initPresetsColor(presetsColorEl: Element, hammer: Hammer, colorPickerEl: Element) {
  addHeading('Colors', presetsColorEl)
  Object.entries(presetsColor).forEach(([name, colors]) => {
    genPresetBtn(name, presetsColorEl, () => {
      // Clear ALL possible color-related localStorage values
      objectKeys(hammer.colors).forEach((key) => {
        window.localStorage.removeItem(`__vike_logo__input_${key}`)
      })
      // Save all colors from this preset to localStorage
      objectKeys(colors).forEach((key) => {
        setStoreValue(key, colors[key])
      })
      // Make a copy of the preset colors to avoid mutating the original preset object
      hammer.colors = { ...colors }
      hammer.reset()
      // Rebuild color inputs to show only colors defined in this preset
      // Pass false to not load from localStorage since we just set the preset
      initColorInputs(colorPickerEl, hammer)
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

  objectKeys(hammer.colors).forEach((key) => {
    {
      const val = getStoreValue(key)
      if (val) hammer.colors[key] = val as any
    }

    const val = hammer.colors[key]

    // Skip if the color is not defined in the current preset
    if (val === undefined) return

    const isGradient = Array.isArray(val)

    // <div><label><input type="color" /></label><span id="r2-val"></span></div>
    const parentEl = document.createElement('div')
    colorPicker.appendChild(parentEl)
    const labelEl = document.createElement('label')
    parentEl.appendChild(labelEl)

    const inputEl = document.createElement('input')
    inputEl.setAttribute('type', 'color')
    labelEl.appendChild(inputEl)

    let inputEl2: HTMLInputElement | undefined
    if (isGradient) {
      inputEl2 = document.createElement('input')
      inputEl2.setAttribute('type', 'color')
      labelEl.appendChild(inputEl2)
    }

    const valEl = document.createElement('span')
    parentEl.appendChild(valEl)

    const updateInput = () => {
      const val = hammer.colors[key]
      if (val === undefined) return

      if (Array.isArray(val)) {
        // Gradient tuple
        const hexVal1 = colorNameToHex(val[0]) || val[0]
        const hexVal2 = colorNameToHex(val[1]) || val[1]
        inputEl.value = hexVal1
        if (inputEl2) inputEl2.value = hexVal2
        valEl.innerHTML = ` [${val[0]}, ${val[1]}] <code>${key}</code>`
      } else {
        // Solid color
        const hexVal = colorNameToHex(val) || val
        inputEl.value = hexVal
        valEl.innerHTML = ` ${val} <code>${key}</code>`
      }
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
      const newVal: string = ev.target!.value
      if (Array.isArray(hammer.colors[key])) {
        hammer.colors[key] = [newVal, (hammer.colors[key] as [string, string])[1]]
      } else {
        hammer.colors[key] = newVal
      }
      updateInput()
      hammer.reset()
      updateStore()
    }

    if (inputEl2) {
      inputEl2.oninput = (ev: any) => {
        const newVal: string = ev.target!.value
        if (Array.isArray(hammer.colors[key])) {
          hammer.colors[key] = [(hammer.colors[key] as [string, string])[0], newVal]
        }
        updateInput()
        hammer.reset()
        updateStore()
      }
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

function getStoreValue(key: string): unknown {
  const stored = window.localStorage[`__vike_logo__input_${key}`]
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return stored
  }
}
function setStoreValue(key: string, val: unknown): void | undefined {
  window.localStorage[`__vike_logo__input_${key}`] = JSON.stringify(val)
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

function colorNameToHex(color: string | [string, string]): string | null {
  // If it's a gradient tuple, use the first color
  if (Array.isArray(color)) {
    color = color[0]
  }

  // If it's already a hex color, return it
  if (color.startsWith('#')) return color

  // Create a temporary canvas to convert named colors to hex
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = color
  const computedColor = ctx.fillStyle

  // If the color was valid, fillStyle will be set to the hex value
  if (computedColor.startsWith('#')) return computedColor

  return null
}

/** Same as Object.keys() but with type inference */
export function objectKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj)
}
