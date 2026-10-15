/**
 * ui-craft.ts — Interactive instrument controls, micro-interactions,
 * keyboard shortcuts, ledger filters, schematic lightbox, and telemetry.
 */

export function initUiCraft() {
  const announcer = document.getElementById('announcer')
  function announce(msg: string) {
    if (announcer) announcer.textContent = msg
  }

  /* ---- 1. Zero-reflow copy actions ---- */
  const timers = new WeakMap<Element, number>()
  function confirmCopy(btn: Element, msg: string) {
    btn.setAttribute('data-copied', '1')
    announce(msg)
    const prev = timers.get(btn)
    if (prev) window.clearTimeout(prev)
    timers.set(
      btn,
      window.setTimeout(() => {
        btn.removeAttribute('data-copied')
      }, 1600)
    )
  }

  function copyText(text: string, btn: Element, msg: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => confirmCopy(btn, msg),
        () => confirmCopy(btn, msg)
      )
    } else {
      confirmCopy(btn, msg)
    }
  }

  /* ---- 2. Schematic Lightbox ---- */
  const lightbox = document.getElementById('schematic-lightbox') as HTMLElement | null
  const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null
  const lightboxCaption = document.getElementById('lightbox-caption')
  const lightboxClose = document.getElementById('lightbox-close')

  function openLightbox(src: string, caption: string) {
    if (!lightbox || !lightboxImg) return
    lightboxImg.src = src
    lightboxImg.alt = caption
    if (lightboxCaption) lightboxCaption.textContent = caption
    lightbox.hidden = false
    lightboxClose?.focus()
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return
    lightbox.hidden = true
  }

  lightboxClose?.addEventListener('click', closeLightbox)
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox()
  })

  /* ---- 3. Delegated Click Handler (Copy, Peek, Filter, Plate Controls) ---- */
  document.addEventListener('click', e => {
    const target = e.target as Element | null
    if (!target) return

    const link = target.closest('[data-link]')
    if (link) {
      copyText(
        location.origin + (link.getAttribute('data-link') || ''),
        link,
        'Link copied to clipboard.'
      )
      return
    }

    const codeBtn = target.closest('[data-code]')
    if (codeBtn) {
      const pre = codeBtn.closest('.code')
      const el = pre && pre.querySelector('pre code')
      if (el && el.textContent) {
        copyText(el.textContent, codeBtn, 'Code copied to clipboard.')
      }
      return
    }

    const txt = target.closest('[data-copy-text]')
    if (txt) {
      copyText(txt.getAttribute('data-copy-text') || '', txt, 'Copied to clipboard.')
      return
    }

    /* Ledger individual schematic peek toggle */
    const peekBtn = target.closest('[data-peek-target]') as HTMLButtonElement | null
    if (peekBtn) {
      const id = peekBtn.getAttribute('data-peek-target')
      const panel = id ? document.getElementById(id) : null
      if (panel) {
        const nextOpen = panel.hidden
        panel.hidden = !nextOpen
        peekBtn.setAttribute('aria-expanded', String(nextOpen))
      }
      return
    }

    /* Ledger tag filter buttons */
    const filterBtn = target.closest('[data-filter-tag]') as HTMLButtonElement | null
    if (filterBtn) {
      const selectedTag = filterBtn.getAttribute('data-filter-tag') || 'all'
      const allFilterBtns = document.querySelectorAll('[data-filter-tag]')
      allFilterBtns.forEach(b => {
        b.setAttribute(
          'aria-pressed',
          String(b.getAttribute('data-filter-tag') === selectedTag)
        )
      })
      const rows = document.querySelectorAll('.entry-row') as NodeListOf<HTMLElement>
      let visibleCount = 0
      rows.forEach(row => {
        const rowTags = (row.getAttribute('data-tags') || '').split(',').filter(Boolean)
        const match = selectedTag === 'all' || rowTags.includes(selectedTag)
        row.hidden = !match
        if (match) visibleCount++
      })
      const countEl = document.getElementById('ledger-count')
      if (countEl) {
        countEl.textContent =
          selectedTag === 'all'
            ? `${visibleCount} entries, newest first`
            : `${visibleCount} ${visibleCount === 1 ? 'entry' : 'entries'} tagged #${selectedTag}`
      }
      announce(`Showing ${visibleCount} entries`)
      return
    }

    /* Article schematic plate blueprint-tone toggle */
    const bpBtn = target.closest('[data-plate-blueprint]') as HTMLButtonElement | null
    if (bpBtn) {
      const plate = bpBtn.closest('.schematic-plate')
      if (plate) {
        const active = plate.getAttribute('data-blueprint') === 'true'
        plate.setAttribute('data-blueprint', String(!active))
        bpBtn.setAttribute('aria-pressed', String(!active))
      }
      return
    }

    /* Article schematic plate zoom lightbox */
    const zoomTrigger = target.closest('[data-plate-zoom]') as HTMLElement | null
    if (zoomTrigger) {
      const src = zoomTrigger.getAttribute('data-plate-zoom') || ''
      const title = zoomTrigger.getAttribute('data-plate-title') || 'FIG. 00 — SYSTEM SCHEMATIC'
      if (src) openLightbox(src, title)
    }
  })

  /* Global schematics toggle on home ledger */
  const schematicsToggle = document.getElementById('schematics-toggle')
  schematicsToggle?.addEventListener('click', () => {
    const isOpen = document.documentElement.getAttribute('data-schematics') === 'open'
    if (isOpen) {
      document.documentElement.removeAttribute('data-schematics')
      schematicsToggle.setAttribute('aria-pressed', 'false')
      announce('Collapsed schematic previews.')
    } else {
      document.documentElement.setAttribute('data-schematics', 'open')
      schematicsToggle.setAttribute('aria-pressed', 'true')
      announce('Expanded all schematic previews.')
    }
  })

  /* ---- 4. Route entry animation ---- */
  document.addEventListener(
    'click',
    e => {
      const target = e.target as Element | null
      const a = target?.closest('a[href]') as HTMLAnchorElement | null
      if (!a || a.origin !== location.origin) return
      try {
        sessionStorage.setItem('aivan:nav', String(Date.now()))
      } catch {
        /* private mode */
      }
    },
    true
  )

  if (document.documentElement.getAttribute('data-enter') === 'set') {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('data-enter', 'play')
        setTimeout(() => {
          document.documentElement.removeAttribute('data-enter')
        }, 450)
      })
    })
  }

  /* ---- 5. Theme Toggle & Architectural Grid Toggle ---- */
  const modeBtn = document.getElementById('mode-toggle')
  const modeLabel = document.getElementById('mode-label')
  const gridBtn = document.getElementById('grid-toggle')

  function rememberTheme(v: string) {
    try {
      localStorage.setItem('aivan:theme', v)
    } catch {
      /* private mode */
    }
  }

  function syncModeBtn() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
    if (modeLabel) {
      modeLabel.textContent = dark ? 'light' : 'dark'
    }
    if (modeBtn) {
      modeBtn.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme')
    }
  }

  function flipTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-notrans', '')
    document.documentElement.setAttribute('data-theme', next)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.removeAttribute('data-notrans')
      })
    })
    rememberTheme(next)
    syncModeBtn()
    announce((next === 'dark' ? 'Dark' : 'Light') + ' theme on.')
  }

  if (modeBtn) {
    modeBtn.addEventListener('click', flipTheme)
    syncModeBtn()
  }

  function toggleGrid() {
    const active = document.documentElement.getAttribute('data-grid') === 'on'
    if (active) {
      document.documentElement.removeAttribute('data-grid')
      gridBtn?.setAttribute('aria-pressed', 'false')
      announce('Architectural grid off.')
    } else {
      document.documentElement.setAttribute('data-grid', 'on')
      gridBtn?.setAttribute('aria-pressed', 'true')
      announce('Architectural grid on.')
    }
  }

  gridBtn?.addEventListener('click', toggleGrid)

  if (typeof window.matchMedia === 'function') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ev => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem('aivan:theme')
      } catch {
        /* private mode */
      }
      if (saved) return
      document.documentElement.setAttribute('data-theme', ev.matches ? 'dark' : 'light')
      syncModeBtn()
    })
  }

  /* ---- 6. Global Keyboard Shortcuts (/, b, t, Escape) ---- */
  const seekInput = document.getElementById('search-input') as HTMLInputElement | null
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox()
      return
    }
    const tag = document.activeElement?.tagName || ''
    if (/^(INPUT|TEXTAREA|SELECT)$/i.test(tag) || e.metaKey || e.ctrlKey || e.altKey) {
      return
    }
    if (e.key === '/') {
      e.preventDefault()
      seekInput?.focus()
      seekInput?.select()
    } else if (e.key === 'b' || e.key === 'B') {
      e.preventDefault()
      toggleGrid()
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault()
      flipTheme()
    }
  })

  /* ---- 7. Skip Link ---- */
  const skipLink = document.getElementById('skip')
  const main = document.getElementById('main')
  if (skipLink && main) {
    skipLink.addEventListener('click', e => {
      e.preventDefault()
      main.focus()
      main.scrollIntoView()
    })
  }

  /* ---- 8. Live Singapore Telemetry Clock (UTC+8) ---- */
  const clockEl = document.getElementById('sg-clock')
  if (clockEl) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const updateClock = () => {
      try {
        clockEl.textContent = `SGP · ${fmt.format(new Date())}`
      } catch {
        clockEl.textContent = 'SGP · UTC+8'
      }
    }
    updateClock()
    setInterval(updateClock, 30000)
  }

  /* ---- 9. Auto-hide Top Bar + Article Reading Progress Gauge ---- */
  const topBar = document.querySelector('.top')
  const progressFill = document.getElementById('rail-progress-fill')
  const progressLabel = document.getElementById('rail-progress-label')
  const articleEl = document.querySelector('#page-content article.prose') as HTMLElement | null

  let lastY = 0
  let downRun = 0
  let scrollTick = false

  function onScrollFrame() {
    const y = Math.max(0, window.scrollY)
    const d = y - lastY
    downRun = d > 0 ? downRun + d : 0
    if (topBar) {
      if (d < 0 || y <= 16) topBar.classList.remove('tuck')
      else if (downRun > 24 && y > 48) topBar.classList.add('tuck')
    }
    lastY = y

    if (articleEl && progressFill && progressLabel) {
      const rect = articleEl.getBoundingClientRect()
      const total = Math.max(1, articleEl.offsetHeight - window.innerHeight * 0.55)
      const scrolled = Math.min(total, Math.max(0, -rect.top + window.innerHeight * 0.25))
      const pct = Math.round((scrolled / total) * 100)
      progressFill.style.setProperty('--read-pct', `${pct}%`)
      progressLabel.textContent = `${String(pct).padStart(2, '0')}% READ`
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (scrollTick) return
      scrollTick = true
      requestAnimationFrame(() => {
        scrollTick = false
        onScrollFrame()
      })
    },
    { passive: true }
  )

  topBar?.addEventListener('focusin', () => {
    topBar.classList.remove('tuck')
  })

  onScrollFrame()
}

initUiCraft()
