import { useRef, useEffect } from 'react'

function ScrollRail({ count, current, onChange }) {
  const railRef = useRef(null)

  const handleScroll = () => {
    const rail = railRef.current
    const index = Math.round(rail.scrollTop / rail.clientHeight)
    if (index !== current && index >= 0 && index < count) {
      onChange(index)
    }
  }

  useEffect(() => {
    const rail = railRef.current
    const index = Math.round(rail.scrollTop / rail.clientHeight)
    if (index !== current) {
      rail.scrollTo({ top: current * rail.clientHeight, behavior: 'smooth' })
    }
  }, [current, count])

  return (
    <div className="rail" ref={railRef} onScroll={handleScroll}>
      {Array.from({ length: count }, (_, i) => (
        <div className="section" key={i} />
      ))}
    </div>
  )
}

export default ScrollRail
