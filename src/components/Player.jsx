import { useEffect, useRef } from 'react'

function Player({ src, playing, onToggle, onEnded }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    audio.src = src
    if (playing) {
      audio.play().catch(() => {})
    }
  }, [src])

  useEffect(() => {
    const audio = audioRef.current
    if (!playing) {
      audio.pause()
      return
    }
    const resume = () => {
      audio.play().catch(() => {})
    }
    audio.play().catch(() => {
      window.addEventListener('pointerdown', resume, { once: true })
      window.addEventListener('keydown', resume, { once: true })
    })
    return () => {
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [playing])

  return (
    <>
      <button className="play-btn" onClick={onToggle}>
        {playing ? '❚❚' : '▶'}
      </button>
      <audio ref={audioRef} onEnded={onEnded} />
    </>
  )
}

export default Player
