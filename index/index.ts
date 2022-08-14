import * as Zdog from 'zdog'
import { Hammer } from '../Hammer'

const hammer = new Hammer(document.querySelector('#logo')!)
hammer.dragRotate = true
hammer.colors = {
  metal1: '#949494',
  metal2: '#828282',
  metal3: '#696969',
  metal4: '#707070',
  wood: '#a05922',
  lightningBolt: '#ecb018'
}
{
  const { TAU } = Zdog
  hammer.perspective = {
    rotate: { x: TAU * (-0.13 / 16), y: TAU * (-6.63 / 16), z: TAU * (-1.2 / 16) },
    translate: { x: -2.6, y: 7, z: 0 }
  }
}
hammer.init()
