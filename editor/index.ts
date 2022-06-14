import * as Zdog from 'zdog'
import { Hammer, Colors } from '../Hammer'

main({
  colorPicker: document.getElementById('colorPicker')!,
  rotationInfo: document.getElementById('rotationInfo')!,
  zdogView: document.getElementById('zdogView')!,
  faviconSize: document.getElementById('faviconSize')!,
  autoSpinning: document.getElementById('autoSpinning')!
})

function main(anchors: {
  colorPicker: Element
  rotationInfo: Element
  zdogView: Element
  faviconSize: Element
  autoSpinning: Element
}) {
  const hammer = new Hammer(document.querySelector('#logo')!)
  hammer.dragRotate = true
  hammer.colors = {
    // *b*lue
    metal1: '#949494',
    metal2: '#828282',
    metal3: '#696969',
    metal4: '#707070',
    // b*r*aun
    wood: '#96511d',
    lightningBolt: '#ecb018'
  }
  {
    const { TAU } = Zdog
    hammer.perspective = {
      // rotate: { x: TAU * (-0.29 / 16), y: TAU * (9.99 / 16), z: TAU * (-1.2 / 16) },
      rotate: { x: TAU * (-0.13 / 16), y: TAU * (-6.63 / 16), z: TAU * (-1.2 / 16) },
      translate: { x: -2.6, y: 7, z: 0 }
    }
  }
  hammer.init()

  zdogViewInit(anchors.zdogView)
  initColorInputs(anchors.colorPicker, hammer)
  faviconSizeInit(anchors.faviconSize)
  autoSpinningInit(anchors.autoSpinning)
  animate(hammer, anchors.rotationInfo)
}

function initColorInputs(colorPicker: Element, hammer: Hammer) {
  Object.keys(hammer.colors).forEach((key) => {
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
      const val = hammer.colors[key as keyof Colors]
      inputEl.value = val
      valEl.innerHTML = ` ${val} <code>${key}</code>`
    }
    updateUI()

    inputEl.oninput = (ev: any) => {
      hammer.colors[key as keyof Colors] = ev.target!.value
      updateUI()
      hammer.updateColors()
    }
  })
}

function zdogViewInit(zdogView: Element) {
  createCheckboxInput({
    elem: zdogView,
    labelText: 'Zdog original view',
    onToggle: (isChecked: boolean) => document.body.classList[isChecked ? 'add' : 'remove']('zdogView')
  })
}

function faviconSizeInit(faviconSize: Element) {
  createCheckboxInput({
    elem: faviconSize,
    labelText: 'favicon size',
    onToggle: (isChecked: boolean) => document.body.classList[isChecked ? 'add' : 'remove']('faviconSize')
  })
}

function autoSpinningInit(autoSpinning: Element) {
  createCheckboxInput({
    elem: autoSpinning,
    labelText: 'Auto spinning',
    onToggle: (isChecked: boolean) => (isSpinning = isChecked)
  })
}

function createCheckboxInput({
  elem,
  labelText,
  onToggle
}: {
  elem: Element
  labelText: string
  onToggle: (isChecked: boolean) => void
}) {
  const labelEl = document.createElement('label')
  elem.appendChild(labelEl)
  const inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'checkbox')
  labelEl.appendChild(inputEl)
  labelEl.appendChild(document.createTextNode(labelText))

  const { id } = elem
  assert(id)
  const storeKey = '__vike_logo__input_' + id
  const storeGet = () => (JSON.parse(window.localStorage[storeKey] ?? '"{}"').isChecked as undefined | boolean) ?? false
  const storeToggle = () => {
    let isChecked = storeGet()
    isChecked = !isChecked
    window.localStorage[storeKey] = JSON.stringify({ isChecked })
  }
  const updateUI = () => {
    const isChecked = storeGet()
    onToggle(isChecked)
    inputEl.checked = isChecked
  }
  inputEl.oninput = (ev) => {
    ev.preventDefault()
    storeToggle()
    updateUI()
  }
  updateUI()
}

var isSpinning: boolean
function animate(hammer: Hammer, rotationInfo: Element) {
  hammer.onDragStart = () => {
    isSpinning = false
  }
  if (isSpinning) {
    hammer.perspective.rotate.y += 0.03
    hammer.updatePerspective()
  }
  updateRotationPrint(hammer, rotationInfo)
  requestAnimationFrame(() => {
    hammer.update()
    animate(hammer, rotationInfo)
  })
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
