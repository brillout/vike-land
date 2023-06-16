import { fromHumanReadable, Hammer, type Perspective } from '../Hammer'

const perspective: Perspective = {
  rotate: fromHumanReadable({ x: -0.13, y: -6.63, z: -1.2 }),
  translate: { x: -2.6, y: 7, z: 0 },
}

Array.from(document.querySelectorAll('.logo')).forEach((logoEl) => {
  const hammer = new Hammer(logoEl as HTMLElement)
  hammer.perspective = perspective
  hammer.init()
})
