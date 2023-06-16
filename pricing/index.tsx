import React from 'react'
import ReactDOM from 'react-dom/client'

import { Pricing } from './Pricing'
import { PricingDesc } from './PricingDesc'

const container = document.getElementById('react-root')
const root = ReactDOM.createRoot(container!)
root.render(
  <div id="pricing-page">
    <h1>Pricing</h1>
    <Pricing />
    <PricingDesc />
  </div>,
)
