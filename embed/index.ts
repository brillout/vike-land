import { Hammer } from '../Hammer'

Array.from(document.querySelectorAll('.logo')).forEach((logoEl) => {
  const hammer = new Hammer(logoEl as HTMLElement)
  hammer.init()
})
