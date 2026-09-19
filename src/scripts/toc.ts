/**
 * <gloss-toc>: table-of-contents scrollspy, ported from the starlight-toc
 * pattern. Draws one vertical rail beside the links, highlights the active
 * reading range with a clipped accent track, and slides a small thumb along
 * the rail as the reader moves. IntersectionObserver drives the state; the
 * observer walks backwards from whatever crossed the reading band to the
 * heading that owns it.
 */

const trackX = (depth: number) => (depth <= 2 ? 8 : depth === 3 ? 16 : 24)

class GlossToc extends HTMLElement {
  private _current = this.querySelector('a[aria-current="true"]') as HTMLAnchorElement | null
  private minH = parseInt(this.dataset.minH || '2', 10)
  private maxH = parseInt(this.dataset.maxH || '3', 10)
  private list = this.querySelector('.toc-list') as HTMLElement | null
  private track: HTMLDivElement | null = null
  private railPath: SVGPathElement | null = null
  private railSvg: SVGSVGElement | null = null
  private trackPath: SVGPathElement | null = null
  private trackSvg: SVGSVGElement | null = null
  private thumb: HTMLDivElement | null = null
  private computed: {
    positions: Array<[number, number, number]>
    itemLineLengths: Array<[number, number]>
  } | null = null
  private links: HTMLAnchorElement[] = []
  private previousActive: { startIdx: number; endIdx: number; isUp: boolean } | null = null
  /* the pinned meta block in the left rail carries a live "you are here":
     the section mark below it is replaced as the reader scrolls past
     headings */
  private railMark = document.querySelector('.railstick .railmark')

  protected set current(link: HTMLAnchorElement) {
    if (link === this._current) return
    if (this._current) this._current.removeAttribute('aria-current')
    link.setAttribute('aria-current', 'true')
    this._current = link
  }

  constructor() {
    super()

    this.links = [...this.querySelectorAll('.toc-link')] as HTMLAnchorElement[]
    if (this.list && this.links.length > 0) {
      this.mountTrack()
      this.rebuildTrack()
      new ResizeObserver(() => this.rebuildTrack()).observe(this.list)
    }

    const isHeading = (el: Element): el is HTMLHeadingElement => {
      if (el instanceof HTMLHeadingElement) {
        const level = el.tagName[1]
        if (level) {
          const int = parseInt(level, 10)
          if (int >= this.minH && int <= this.maxH) return true
        }
      }
      return false
    }

    const getElementHeading = (el: Element | null): HTMLHeadingElement | null => {
      if (!el) return null
      const origin = el
      while (el) {
        if (isHeading(el)) return el
        el = el.previousElementSibling
        while (el?.lastElementChild) el = el.lastElementChild
        const heading = getElementHeading(el)
        if (heading) return heading
      }
      return getElementHeading(origin.parentElement)
    }

    const setCurrent: IntersectionObserverCallback = entries => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue
        const heading = getElementHeading(target)
        if (!heading) continue
        const link = this.links.find(
          item => item.hash === '#' + encodeURIComponent(heading.id)
        )
        if (link) {
          this.current = link
          this.syncActiveRange(link)
          break
        }
      }
    }

    const toObserve = document.querySelectorAll(
      '#page-content .prose [id], #page-content .prose [id] ~ *, #page-content .prose > *'
    )

    let observer: IntersectionObserver | undefined
    const observe = () => {
      if (observer) observer.disconnect()
      observer = new IntersectionObserver(setCurrent, { rootMargin: this.getRootMargin() })
      toObserve.forEach(element => observer?.observe(element))
    }
    observe()

    const onIdle =
      window.requestIdleCallback || ((callback: IdleRequestCallback) => setTimeout(callback, 1))
    let timeout: ReturnType<typeof setTimeout> | undefined
    window.addEventListener('resize', () => {
      if (observer) observer.disconnect()
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => onIdle(observe), 200)
    })

    /* the top bar tucks away while reading down and returns on scroll up, so
       the occluded band changes size; rebuild the observer to match */
    const top = document.querySelector('.top')
    if (top) {
      new MutationObserver(() => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => onIdle(observe), 260)
      }).observe(top, { attributes: true, attributeFilter: ['class'] })
    }

    if (this.links[0] && !this._current) this.current = this.links[0]
    if (this._current) this.syncActiveRange(this._current)
  }

  private mountTrack() {
    if (!this.list) return
    this.track = document.createElement('div')
    this.track.className = 'toc-track'
    this.track.setAttribute('aria-hidden', 'true')
    this.railSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.railSvg.classList.add('toc-rail-svg')
    this.railPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.railPath.classList.add('toc-rail-path')
    this.railPath.setAttribute('fill', 'none')
    this.railPath.setAttribute('stroke-width', '1')
    this.railSvg.appendChild(this.railPath)
    this.trackSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.trackSvg.classList.add('toc-track-svg')
    this.trackPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.trackPath.classList.add('toc-track-path')
    this.trackPath.setAttribute('fill', 'none')
    this.trackPath.setAttribute('stroke-width', '1')
    this.trackSvg.appendChild(this.trackPath)
    this.thumb = document.createElement('div')
    this.thumb.className = 'toc-thumb'
    this.track.append(this.railSvg, this.trackSvg, this.thumb)
    this.list.prepend(this.track)
  }

  private rebuildTrack() {
    if (
      !this.list ||
      !this.track ||
      !this.railSvg ||
      !this.railPath ||
      !this.trackSvg ||
      !this.trackPath ||
      this.list.clientHeight === 0 ||
      this.links.length === 0
    ) {
      return
    }

    let width = 0
    let height = 0
    let path = ''
    const positions: Array<[number, number, number]> = []

    for (let index = 0; index < this.links.length; index++) {
      const link = this.links[index]
      const depth = parseInt(link.dataset.depth || '2', 10)
      const style = getComputedStyle(link)
      const x = trackX(depth) + 0.5
      const top = link.offsetTop + parseFloat(style.paddingTop)
      const bottom = link.offsetTop + link.clientHeight - parseFloat(style.paddingBottom)
      width = Math.max(width, x + 8)
      height = Math.max(height, bottom)

      if (index === 0) {
        path += ` M${x} ${top} L${x} ${bottom}`
      } else {
        const previous = positions[index - 1]
        if (previous[2] === x) {
          path += ` L${x} ${top}`
        } else {
          path += ` C ${previous[2]} ${top - 4} ${x} ${previous[1] + 4} ${x} ${top}`
        }
        path += ` L${x} ${bottom}`
      }
      positions.push([top, bottom, x])
    }

    const temporaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    temporaryPath.setAttribute('d', path)
    this.trackSvg.appendChild(temporaryPath)
    const totalLength = temporaryPath.getTotalLength()
    const itemLineLengths: Array<[number, number]> = []
    for (let index = 0; index < positions.length; index++) {
      const [top, bottom] = positions[index]
      let start =
        index > 0 ? itemLineLengths[index - 1][1] + (top - positions[index - 1][1]) : top
      while (start < totalLength && temporaryPath.getPointAtLength(start).y < top) {
        start++
      }
      itemLineLengths.push([start, start + bottom - top])
    }
    temporaryPath.remove()

    this.computed = { positions, itemLineLengths }
    this.track.style.width = `${width}px`
    this.track.style.height = `${height}px`
    this.railSvg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    this.railSvg.style.width = `${width}px`
    this.railSvg.style.height = `${height}px`
    this.railPath.setAttribute('d', path)
    this.trackSvg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    this.trackSvg.style.width = `${width}px`
    this.trackSvg.style.height = `${height}px`
    this.trackPath.setAttribute('d', path)
    if (this._current) this.syncActiveRange(this._current)
  }

  private syncActiveRange(link: HTMLAnchorElement) {
    const index = this.links.indexOf(link)
    if (index === -1) return
    let end = index
    const activeBandTop = this.getActiveBandTop()

    for (let next = index + 1; next < this.links.length; next++) {
      const id = decodeURIComponent(this.links[next].hash.slice(1))
      const heading = document.getElementById(id)
      if (!heading) break
      const rect = heading.getBoundingClientRect()
      if (rect.top > activeBandTop + 48) break
      if (rect.top < activeBandTop - 8) {
        end = next
        continue
      }
      end = next
      break
    }

    for (let item = 0; item < this.links.length; item++) {
      if (item >= index && item <= end) {
        this.links[item].setAttribute('data-active', 'true')
      } else {
        this.links[item].removeAttribute('data-active')
      }
    }
    this.updateRailMark(index)
    this.updateTrackWindow(index, end)
  }

  /* swap the rail's section mark for "¶ <num>" of the section the reader is
     in; the number comes from the nearest numbered item at or above the
     active link (h3s borrow their parent h2's number) */
  private updateRailMark(startIdx: number) {
    if (!this.railMark) return
    let num: string | null = null
    for (let item = startIdx; item >= 0; item--) {
      const label = this.links[item]?.querySelector('.tocnum')?.textContent
      if (label) {
        num = label
        break
      }
    }
    this.railMark.textContent = num ? `¶ ${num}` : '¶'
  }

  private headerHeight() {
    const top = document.querySelector('.top')
    if (!top || top.classList.contains('tuck')) return 0
    return top.getBoundingClientRect().height
  }

  private getActiveBandTop() {
    return this.headerHeight() + 32
  }

  private updateTrackWindow(start: number, end: number) {
    if (!this.track || !this.computed || !this.thumb) return
    const { positions, itemLineLengths } = this.computed
    if (!positions[start] || !positions[end]) return

    let isUp = false
    if (this.previousActive) {
      isUp =
        this.previousActive.startIdx > start ||
        this.previousActive.endIdx > end ||
        (this.previousActive.startIdx === start &&
          this.previousActive.endIdx === end &&
          this.previousActive.isUp)
    }
    this.previousActive = { startIdx: start, endIdx: end, isUp }
    this.track.style.setProperty('--track-top', `${positions[start][0]}px`)
    this.track.style.setProperty('--track-bottom', `${positions[end][1]}px`)
    /* the square caps the lit segment: flush with its top edge when moving
       up, flush with its bottom edge when moving down — placed in plain x/y
       so it always sits exactly on the rail of the item it marks */
    const edgeIdx = isUp ? start : end
    const size = 5
    const x = positions[edgeIdx][2] - size / 2
    const y = isUp ? positions[start][0] : positions[end][1] - size
    this.track.style.setProperty('--thumb-x', `${x}px`)
    this.track.style.setProperty('--thumb-y', `${y}px`)
    this.track.style.setProperty('--opacity', '1')
  }

  private getRootMargin(): `-${number}px 0% ${number}px` {
    const top = this.headerHeight() + 32
    const bottom = top + 24
    const height = document.documentElement.clientHeight
    return `-${top}px 0% ${bottom - height}px`
  }
}

customElements.define('gloss-toc', GlossToc)
