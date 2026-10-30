import { useState, useEffect, useMemo, useRef } from 'react'
import Disc from './components/Disc'
import Backdrop from './components/Backdrop'
import ScrollRail from './components/ScrollRail'
import Player from './components/Player'

import './App.css'

const ARTIST = 'Eve'
const EXCLUDE = ['sunlit smile!', 'trap for you', 'ruby love', '右に曲ガール']
const dateLabel = (value) => value ? new Date(value).toLocaleDateString('ja-JP', { timeZone: 'UTC' }) : '不明'

export default function App() {
  const [source, setSource] = useState([])
  const [selected, setSelected] = useState(null)
  const [playing, setPlaying] = useState(false)
  const sort = 'new'
  const [view, setView] = useState('player')
  const [details, setDetails] = useState(false)
  const detailTouch = useRef(null)
  const detailCloseButton = useRef(null)
  useEffect(() => {
    if (details) detailCloseButton.current?.focus({ preventScroll: true })
  }, [details])
  const [detailClosing, setDetailClosing] = useState(false)
  const closeDetails = () => setDetailClosing(true)
  useEffect(() => {
    if (!detailClosing) return
    const timer = setTimeout(() => {
      setDetails(false)
      setDetailClosing(false)
    }, 280)
    return () => clearTimeout(timer)
  }, [detailClosing])
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [filter, setFilter] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setError('')
    fetch('https://itunes.apple.com/search?term=Eve&entity=song&country=JP&limit=200', { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(data => {
        const seen = new Set()
        const list = data.results.filter(r => {
          const key = r.trackName?.toLowerCase()
          if (!r.previewUrl || r.artistName !== ARTIST || EXCLUDE.includes(key) || seen.has(key)) return false
          seen.add(key)
          return true
        }).map(r => ({ id: r.trackId, title: r.trackName, album: r.collectionName,
          artwork: r.artworkUrl100.replace('100x100', '600x600'), preview: r.previewUrl,
          release: r.releaseDate, number: r.trackNumber, genre: r.primaryGenreName,
          url: r.trackViewUrl, zoom: r.trackName === 'ファイトソング' ? 'scale(1.35) translate(15%, 22%)' : undefined }))
        if (!list.length) throw new Error()
        setSource(list)
        setSelected([...list].sort((a, b) => Date.parse(b.release) - Date.parse(a.release))[0].id)
      }).catch(e => { if (e.name !== 'AbortError') setError('曲を読み込めませんでした。時間をおいて再試行してください。') })
    return () => controller.abort()
  }, [attempt])
  useEffect(() => {
    if (source.length === 0) return
    const timer = setTimeout(() => setPlaying(true), 1400)
    return () => clearTimeout(timer)
  }, [source])
  const tracks = useMemo(() => {
    const list = [...source]
    list.sort((a, b) => Date.parse(b.release) - Date.parse(a.release))
    return list
  }, [source])
  const current = Math.max(0, tracks.findIndex(t => t.id === selected))
  const track = tracks[current]
  const select = (index) => setSelected(tracks[index].id)
  const step = (offset) => select((current + offset + tracks.length) % tracks.length)
  const next = (shuffle) => {
    if (shuffle && tracks.length > 1) step(1 + Math.floor(Math.random() * (tracks.length - 1)))
    else step(1)
  }
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') { closeDetails(); setView('player') } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  if (!track) return <div className="loading"><div role="status">{error || 'レコードを準備しています…'}{error && <button onClick={() => setAttempt(a => a + 1)}>再試行</button>}</div></div>
  return <main className="hero">
    <Backdrop tracks={tracks} current={current} />

    <header className="site-header"><a className="back-to-artist" href="https://letons11mrty.github.io/artist-site/"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 6-6 6 6 6" /></svg><span>artist site</span></a>
      <nav aria-label="表示切り替え"><button aria-label="プレイヤー" title="プレイヤー" aria-pressed={view === 'player'} onClick={() => setView('player')}><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12a6 6 0 0 1 6-6m6 6a6 6 0 0 1-6 6" /></svg></button><button aria-label="Collection" title="Collection" aria-pressed={view === 'shelf'} onClick={() => setView('shelf')}><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg></button></nav>
      
    </header>
    <div className="player-view" style={{ visibility: view === 'player' ? 'visible' : 'hidden' }} inert={view !== 'player'}><ScrollRail count={tracks.length} current={current} onChange={select} /><div className="left"><Disc key={track.id} artwork={track.artwork} playing={playing} /><div className="info"><p className="num">{String(current + 1).padStart(2, '0')} / {tracks.length}</p><h1 className="title">{track.title}</h1><p className="artist">Eve · {track.album}</p><button className="detail-trigger" onClick={() => setDetails(true)}>曲の詳細 ↗</button></div></div><p className="scroll-hint"><span className="desktop-scroll-hint">SCROLL TO EXPLORE ↓</span><span className="mobile-scroll-hint">← BACK · NEXT →</span></p></div>
      <section className="shelf" style={{ visibility: view === 'shelf' ? 'visible' : 'hidden' }} inert={view !== 'shelf'}><div className="shelf-heading"><div><p className="eyebrow">THE COLLECTION</p><h1>Collection</h1><p>{tracks.length}曲の中から、今日の1枚を。</p></div><input aria-label="棚の曲・アルバムを検索" placeholder="曲名・アルバム名で探す" value={filter} onChange={e => setFilter(e.target.value)} /></div>
        <div className="record-grid">{tracks.filter(t => (t.title + t.album).toLowerCase().includes(filter.trim().toLowerCase())).map(t => <button className={'record-card' + (t.id === selected ? ' selected' : '')} key={t.id} onClick={() => { setSelected(t.id); setView('player') }}><div className="record-cover"><img src={t.artwork} alt="" loading="lazy" />{t.id === selected && <span>NOW SELECTED</span>}</div><strong>{t.title}</strong><small>{t.album}</small>{sort === 'new' || sort === 'old' ? <small>{dateLabel(t.release)}</small> : null}</button>)}</div>
        {!tracks.some(t => (t.title + t.album).toLowerCase().includes(filter.trim().toLowerCase())) && <p role="status">該当するレコードがありません。</p>}
      </section>
    <Player src={track.preview} title={track.title} artwork={track.artwork} playing={playing} onPlayingChange={setPlaying} onPrevious={() => step(-1)} onNext={next} />
    <footer className="site-footer"><span>音源は試聴用プレビューです</span></footer>
    {details && <div className={'detail-overlay' + (detailClosing ? ' is-closing' : '')} onClick={() => closeDetails()}><section className="detail-panel" onTouchStart={e => {
      detailTouch.current = e.touches.length === 1 && e.currentTarget.scrollTop <= 0
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
    }} onTouchCancel={() => { detailTouch.current = null }} onTouchEnd={e => {
      const start = detailTouch.current
      detailTouch.current = null
      if (!start || !e.changedTouches.length) return
      const dy = e.changedTouches[0].clientY - start.y
      const dx = Math.abs(e.changedTouches[0].clientX - start.x)
      if (dy > 75 && dy > dx * 1.5 && e.currentTarget.scrollTop <= 0) closeDetails()
    }} role="dialog" aria-modal="true" aria-label="曲の詳細" onKeyDown={e => { if (e.key !== 'Tab') return; const items = e.currentTarget.querySelectorAll('button, a[href]'); const first = items[0]; const last = items[items.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() } }} onClick={e => e.stopPropagation()}><button ref={detailCloseButton} className="close-detail" onClick={() => closeDetails()} aria-label="詳細を閉じる">✕</button><img className="detail-art" src={track.artwork} alt={track.album + 'のジャケット'} /><p className="eyebrow">RECORD NOTES</p><h2>{track.title}</h2><p>Eve</p><dl><dt>アルバム</dt><dd>{track.album}</dd><dt>発売日</dt><dd>{dateLabel(track.release)}</dd><dt>ジャンル</dt><dd>{track.genre || '不明'}</dd><dt>トラック</dt><dd>{track.number || '—'}</dd></dl>{track.url && <a className="store-link" href={track.url} target="_blank" rel="noreferrer">Apple Musicで聴く ↗</a>}<p className="detail-note">楽曲情報・試聴音源：iTunes<br />発売日は取得した収録作品の情報です。</p></section></div>}
  </main>
}















