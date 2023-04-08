import { fromHumanReadableAxis, Hammer, toHumanReadable, type Colors, type PerspectiveUserControlable } from '../Hammer'

const rotation2DDefault = 11

main()

function getElements() {
  return {
    colorPicker: document.getElementById('colorPicker')!,
    handleDiameterPicker: document.getElementById('handleDiameterPicker')!,
    handleLengthPicker: document.getElementById('handleLengthPicker')!,
    zdogView: document.getElementById('zdogView')!,
    faviconSize: document.getElementById('faviconSize')!,
    autoSpinning: document.getElementById('autoSpinning')!,
    resetBtn: document.querySelector('button')!,
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

  initColorInputs(elements.colorPicker, hammer)
  initHandlePicker(hammer, elements.handleDiameterPicker, 'handleDiameter')
  initHandlePicker(hammer, elements.handleLengthPicker, 'handleLength')
  initFaviconSize(elements.faviconSize)
  initAutoSpinning(elements.autoSpinning)
  initReset(elements.resetBtn)
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
    translateX,
    translateY,
    translateZ,
  }: {
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
    const changeVal = createNumberInput({
      elem,
      labelText: `<code>${axis}</code> (${type})`,
      getValue() {
        const n = toHumanReadable(getCoordinate())[axis]
        // console.log('get', n)
        return n
      },
      setValue(n: number) {
        // console.log('set', n)
        getCoordinate()[axis] = fromHumanReadableAxis(n)
      },
      hammer,
    })
    if (type === 'rotate') {
      if (!onPerspectiveChange) onPerspectiveChange = []
      onPerspectiveChange.push((perspectiveUserControlable) => {
        const n = perspectiveUserControlable[axis]
        changeVal(n)
      })
    }
  })
}

function initRotate2D(elemRotate2D: HTMLElement) {
  const elemLogo = document.getElementById('logo')!

  const toVal = (n: number) => `rotate(${n}deg)`
  const fromVal = (val: string) => parseInt(val.split('(')[1]!.split('deg)')[0]!, 10)

  createNumberInput({
    elem: elemRotate2D,
    labelText: `<code>degree</code> (2D rotation)`,
    defaultValue: rotation2DDefault,
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
}

function initHandlePicker(hammer: Hammer, handlePicker: Element, handleProp: 'handleDiameter' | 'handleLength') {
  createNumberInput({
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
    if (val) setValue(val)
    else if (defaultValue) setValue(defaultValue)
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

  inputEl.oninput = (ev: any) => {
    const val: string = ev.target!.value
    const n = toFloat(val)
    setValue(n)
    hammer?.reset()
    setStoreValue(storeKey, val)
  }

  const changeVal = (n: number) => {
    // console.log('change', n)
    const val = String(n)
    inputEl.value = val
    setStoreValue(storeKey, val)
  }
  return changeVal
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

function initReset(resetBtn: HTMLButtonElement) {
  resetBtn.onclick = () => {
    isSpinning = false
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

var isSpinning: boolean
var onPerspectiveChange: ((perspective: PerspectiveUserControlable) => void | undefined)[]
function animate(hammer: Hammer) {
  hammer.onDragStart = () => {
    isSpinning = false
  }
  requestAnimationFrame(() => {
    if (isSpinning) {
      hammer.perspective.rotate.y += 0.015
      hammer.updatePerspective()
    }
    hammer.update()
    callOnPerspectiveChange(hammer)
    animate(hammer)
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
