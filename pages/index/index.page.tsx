import React from 'react'
import logoBanner from './vike-logo-banner.jpg'

export const skipPageShell = true

export { Page }

function Page() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <img src={logoBanner} height={200} alt="logo" style={{ display: 'block' }} />
      <br />
      <br />
      <div>Landing Page</div>
    </div>
  )
}
