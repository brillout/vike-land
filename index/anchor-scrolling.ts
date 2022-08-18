import './anchor-scrolling.css'

anchorScrolling()

// Copied & adapted from https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link/49910424#49910424
function anchorScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (ev) {
      const hash = anchor.getAttribute('href')!
      scrollTo(hash)
      ev.preventDefault()
    })
  })

  document.querySelectorAll('h2[id]').forEach((heading) => {
    heading.addEventListener('click', function (ev) {
      const hash = heading.getAttribute('id')!
      scrollTo(`#${hash}`)
      ev.preventDefault()
    })
  })

  document.querySelector('h1')?.addEventListener('click', () => {
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
    })
    if (window.location.hash === '' && window.scrollY === 0) {
      window.location.reload()
    } else {
      history.pushState(null, '', '/')
    }
  })
}

function scrollTo(hash: string) {
  const el = document.querySelector(hash)!
  el.scrollIntoView({
    behavior: 'smooth',
  })
  history.pushState(null, '', hash)
}
