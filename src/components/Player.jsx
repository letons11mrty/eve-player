import { useEffect, useRef, useState } from 'react'
const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
export default function Player({ src, title, artwork, playing, onPlayingChange, onPrevious, onNext }) {
  const audioRef = useRef(null)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [shuffle, setShuffle] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const audio = audioRef.current
    setPosition(0); setDuration(0); setError('')
    audio.load()
  }, [src])
  useEffect(() => {
    const audio = audioRef.current
    let cancelled = false
    const resume = () => {
      audio.play().catch(e => {
        if (!cancelled && e.name !== 'AbortError' && e.name !== 'NotAllowedError') {
          setError('再生できません。もう一度お試しください。')
        }
      })
    }
    if (playing) {
      audio.play().catch(e => {
        if (cancelled || e.name === 'AbortError') return
        if (e.name === 'NotAllowedError') {
          window.addEventListener('pointerdown', resume, { once: true })
          window.addEventListener('keydown', resume, { once: true })
        } else {
          onPlayingChange(false)
          setError('再生できません。もう一度お試しください。')
        }
      })
    } else audio.pause()
    return () => {
      cancelled = true
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [playing, src, onPlayingChange])
  useEffect(() => { audioRef.current.volume = volume }, [volume])
  return <section className="player-bar" aria-label="再生操作"><div className="now-playing"><img src={artwork} alt="" /><div><strong>{title}</strong><small>Eve · PREVIEW</small></div></div><div className="transport"><div className="transport-buttons"><button aria-label="シャッフル" aria-pressed={shuffle} onClick={() => setShuffle(s => !s)}>⤨</button><button aria-label="前の曲" onClick={onPrevious}>❮</button><button className="play-btn" aria-label={playing ? '一時停止' : '再生'} onClick={() => { setError(''); onPlayingChange(!playing) }}>{playing ? '❚❚' : '▶'}</button><button aria-label="次の曲" onClick={() => onNext(shuffle)}>❯</button></div><div className="seek"><span>{time(position)}</span><input type="range" aria-label="再生位置" min="0" max={duration || 0} step="0.1" value={Math.min(position, duration)} disabled={!duration} onChange={e => { audioRef.current.currentTime = Number(e.target.value); setPosition(Number(e.target.value)) }} /><span>{time(duration)}</span></div>{error && <p className="play-error" role="status">{error}</p>}</div><label className="volume">音量<input type="range" aria-label="音量" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(Number(e.target.value))} /></label><audio ref={audioRef} src={src} preload="metadata" onTimeUpdate={e => setPosition(e.currentTarget.currentTime)} onLoadedMetadata={e => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)} onEnded={() => onNext(shuffle)} onError={() => { setError('この試聴音源を再生できません。別の曲をお試しください。'); onPlayingChange(false) }} /></section>
}

