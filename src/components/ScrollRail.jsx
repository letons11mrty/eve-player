import { useRef, useLayoutEffect } from 'react'

function ScrollRail({ count, current, onChange }) {
  const railRef = useRef(null)
  const currentRef = useRef(current)
  currentRef.current = current
  const horizontal = () => window.matchMedia('(max-width: 700px)').matches

  useLayoutEffect(() => {
    const rail = railRef.current
    const isHorizontal = horizontal()
    const size = isHorizontal ? rail.clientWidth : rail.clientHeight
    const position = isHorizontal ? rail.scrollLeft : rail.scrollTop
    if (size && Math.round(position / size) !== current) {
      rail.scrollTo({
        left: isHorizontal ? current * size : 0,
        top: isHorizontal ? 0 : current * size,
        behavior: 'instant',
      })
    }
  }, [current, count])

  useLayoutEffect(() => {
    const rail = railRef.current
    const resize = () => {
      const isHorizontal = horizontal()
      rail.scrollTo({
        left: isHorizontal ? currentRef.current * rail.clientWidth : 0,
        top: isHorizontal ? 0 : currentRef.current * rail.clientHeight,
        behavior: 'instant',
      })
    }
    const observer = new ResizeObserver(resize)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="rail" ref={railRef} onScroll={() => {
      const rail = railRef.current
      const isHorizontal = horizontal()
      const size = isHorizontal ? rail.clientWidth : rail.clientHeight
      if (!size) return
      const index = Math.round((isHorizontal ? rail.scrollLeft : rail.scrollTop) / size)
      if (index !== current && index >= 0 && index < count) onChange(index)
    }}>
      {Array.from({ length: count }, (_, i) => <div className="section" key={i} />)}
    </div>
  )
}

export default ScrollRail
