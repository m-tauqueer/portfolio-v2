import { useEffect, type RefObject } from 'react'

const SCROLL_EDGE = 2

function isScrollable(el: HTMLElement): boolean {
  return el.scrollHeight > el.clientHeight + SCROLL_EDGE
}

function atTop(el: HTMLElement): boolean {
  return el.scrollTop <= SCROLL_EDGE
}

function atBottom(el: HTMLElement): boolean {
  return el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_EDGE
}

/**
 * Lets page scroll when the embedded terminal hits its scroll edges.
 * Keeps internal scroll when there is room inside the terminal.
 */
export function useScrollChain(containerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (!isScrollable(el)) return

      if (e.deltaY < 0 && atTop(el)) return
      if (e.deltaY > 0 && atBottom(el)) return

      e.stopPropagation()
    }

    let touchStartY = 0

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0]?.clientY ?? 0
      const deltaY = touchStartY - touchY

      if (Math.abs(deltaY) < 2) return

      if (!isScrollable(el)) return

      const scrollingDown = deltaY > 0
      const scrollingUp = deltaY < 0

      if (scrollingDown && atBottom(el)) return
      if (scrollingUp && atTop(el)) return

      e.stopPropagation()
    }

    el.addEventListener('wheel', onWheel, { capture: true })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { capture: true, passive: true })

    return () => {
      el.removeEventListener('wheel', onWheel, { capture: true })
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove, { capture: true })
    }
  }, [enabled, containerRef])
}
