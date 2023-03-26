import { isContext } from 'vm'
import * as Zdog from 'zdog'
import { Hammer, Colors, Perspective } from '../Hammer'

main()

function getElements() {
  return {
    colorPicker: document.getElementById('colorPicker')!,
    handleDiameterPicker: document.getElementById('handleDiameterPicker')!,
    handleLengthPicker: document.getElementById('handleLengthPicker')!,
    rotationInfo: document.getElementById('rotationInfo')!,
    zdogView: document.getElementById('zdogView')!,
    faviconSize: document.getElementById('faviconSize')!,
    autoSpinning: document.getElementById('autoSpinning')!,
    resetBtn: document.querySelector('button')!,
    hideBackLightningBolt: document.getElementById('hideBackLightningBolt')!,
  }
}

function main() {
  const elements = getElements()

  const hammer = new Hammer(document.querySelector('#logo')!)
  hammer.dragRotate = true

  initPerspective(hammer)
  zdogViewInit(elements.zdogView)

  initColorInputs(elements.colorPicker, hammer)
  initHandlePicker(hammer, elements.handleDiameterPicker, 'handleDiameter')
  initHandlePicker(hammer, elements.handleLengthPicker, 'handleLength')
  initFaviconSize(elements.faviconSize)
  initAutoSpinning(elements.autoSpinning)
  initReset(elements.resetBtn)
  initHighBackLightningBold(elements.hideBackLightningBolt, hammer)

  animate(hammer, elements.rotationInfo)

  hammer.init()
}

function initReset(resetBtn: HTMLButtonElement) {
  resetBtn.onclick = () => {
    clearStore()
    // @ts-ignore
    window.navigation.reload()
  }
}

function initColorInputs(colorPicker: Element, hammer: Hammer) {
  colorPicker.innerHTML = ''
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

    const updateUI = () => {
      const val = hammer.colors[key]
      inputEl.value = val
      valEl.innerHTML = ` ${val} <code>${key}</code>`
    }
    updateUI()

    inputEl.oninput = (ev: any) => {
      const val: string = ev.target!.value
      hammer.colors[key as keyof Colors] = val
      updateUI()
      hammer.reset()
      setStoreValue(key, val)
    }
  })
}

function initHandlePicker(hammer: Hammer, handlePicker: Element, handleProp: 'handleDiameter' | 'handleLength') {
  {
    const val = toFloat(getStoreValue(handleProp))
    if (val) hammer[handleProp] = val
  }

  // <div><label><input type="number" step="any" /></label><span id="r2-val"></span></div>
  handlePicker.innerHTML = ''
  const parentEl = document.createElement('div')
  handlePicker.appendChild(parentEl)
  const labelEl = document.createElement('label')
  parentEl.appendChild(labelEl)
  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'number')
  inputEl.setAttribute('step', '0.1')
  inputEl.style.width = '40px'
  inputEl.style.padding = '4px'
  labelEl.appendChild(inputEl)
  const valEl = document.createElement('span')
  valEl.innerHTML = ` <code>${handleProp}</code>`
  parentEl.appendChild(valEl)

  const updateUI = () => {
    const val = hammer[handleProp]
    inputEl.value = String(val)
  }
  updateUI()

  inputEl.oninput = (ev: any) => {
    const val: string = ev.target!.value
    hammer[handleProp] = toFloat(val)
    updateUI()
    hammer.reset()
    setStoreValue(handleProp, val)
  }
}

function zdogViewInit(zdogView: Element) {
  createCheckboxInput({
    elem: zdogView,
    labelText: 'Icon view',
    onToggle: (isChecked: boolean) => {
      document.body.classList[!isChecked ? 'add' : 'remove']('zdogView')
    },
  })
}

function initFaviconSize(faviconSize: Element) {
  createCheckboxInput({
    elem: faviconSize,
    labelText: 'favicon size',
    onToggle: (isChecked: boolean) => {
      document.body.classList[isChecked ? 'add' : 'remove']('faviconSize')
    },
  })
}

function initAutoSpinning(autoSpinning: Element) {
  createCheckboxInput({
    elem: autoSpinning,
    labelText: 'Auto spinning',
    onToggle: (isChecked: boolean) => {
      isSpinning = isChecked
    },
  })
}

function initHighBackLightningBold(hideBackLightningBolt: HTMLElement, hammer: Hammer) {
  createCheckboxInput({
    elem: hideBackLightningBolt,
    labelText: 'Hide back lightning bolt',
    onToggle: (isChecked: boolean) => {
      hammer.hideBackLightningBolt = isChecked
    },
    onChange: () => {
      hammer.reset()
    },
  })
}

function createCheckboxInput({
  elem,
  labelText,
  onToggle,
  onChange,
}: {
  elem: Element
  labelText: string
  onToggle: (isChecked: boolean) => void
  onChange?: (isChecked: boolean) => void
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
      onChange?.(isChecked)
    }
  }
  inputEl.oninput = (ev) => {
    ev.preventDefault()
    storeToggle()
    updateUI()
  }
  updateUI(true)
}

var isSpinning: boolean
function animate(hammer: Hammer, rotationInfo: Element) {
  hammer.onDragStart = () => {
    isSpinning = false
  }
  hammer.onDragEnd = () => {
    savePerspective(hammer)
  }
  if (isSpinning) {
    hammer.perspective.rotate.y += 0.03
    hammer.updatePerspective()
    savePerspective(hammer)
  }
  updateRotationPrint(hammer, rotationInfo)
  requestAnimationFrame(() => {
    hammer.update()
    animate(hammer, rotationInfo)
  })
}
function savePerspective(hammer: Hammer) {
  if (!hammer.illo) return
  const perspective: Perspective = {
    rotate: hammer.illo.rotate,
    translate: hammer.illo.translate,
  }
  setStoreValue('perspective', JSON.stringify(perspective))
}
function initPerspective(hammer: Hammer) {
  const val = getStoreValue('perspective')
  if (val) {
    const perspective: Perspective = JSON.parse(val)
    hammer.perspective = perspective
  }
}

var rotationValue: string
function updateRotationPrint(hammer: Hammer, rotationInfo: Element) {
  if (!rotationInfo) return
  if (!hammer.illo) return
  let { x, y, z } = hammer.illo.rotate
  const t = (v: number) => {
    v = (v * 16) / Zdog.TAU
    v = Math.floor(v * 100) / 100
    return v
  }
  x = t(x)
  y = t(y)
  z = t(z)
  const rotationValueNew = JSON.stringify({ x, y, z }, null, 2)
  if (rotationValue === rotationValueNew) {
    return
  }
  rotationValue = rotationValueNew
  const print = rotationValue.split('\n').join('<br/>').split(' ').join('&nbsp;')
  if (rotationInfo.innerHTML !== print) {
    rotationInfo.innerHTML = print
  }
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
