import { useState, useEffect } from 'react'
import Disc from './components/Disc'
import Backdrop from './components/Backdrop'
import ScrollRail from './components/ScrollRail'
import Player from './components/Player'
import Search from './components/Search'
import './App.css'

const ARTIST = 'Eve'

const EXCLUDE_TITLES = ['sunlit smile!', 'trap for you', 'ruby love', '右に曲ガール']

const ZOOM = {
  ファイトソング: 'scale(1.35) translate(15%, 22%)',
}

function App() {
  const [tracks, setTracks] = useState([])
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const url =
      'https://itunes.apple.com/search?term=' +
      encodeURIComponent(ARTIST) +
      '&entity=song&country=JP&limit=200'
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const seenTitles = new Set()
        const list = data.results
          .filter(
            (r) =>
              r.previewUrl &&
              r.artistName === ARTIST &&
              !EXCLUDE_TITLES.includes(r.trackName.toLowerCase())
          )
          .filter((r) => {
            const key = r.trackName.toLowerCase()
            if (seenTitles.has(key)) return false
            seenTitles.add(key)
            return true
          })
          .slice(0, 200)
          .map((r) => ({
            id: r.trackId,
            title: r.trackName,
            album: r.collectionName,
            artwork: r.artworkUrl100.replace('100x100', '600x600'),
            preview: r.previewUrl,
            zoom: ZOOM[r.trackName],
          }))
        setTracks(list)
      })
  }, [])

  useEffect(() => {
    if (tracks.length === 0) return
    const timer = setTimeout(() => setPlaying(true), 1400)
    return () => clearTimeout(timer)
  }, [tracks])

  const track = tracks[current]

  const artistSiteLink = (
    <a className="artist-site-link" href="https://letons11mrty.github.io/artiste-site/">
      ← ARTIST SITE
    </a>
  )

  if (tracks.length === 0) {
    return (
      <div className="loading">
        {artistSiteLink}
        Loading...
      </div>
    )
  }

  return (
    <div className="hero">
      {artistSiteLink}
      <Backdrop tracks={tracks} current={current} />
      <ScrollRail
        count={tracks.length}
        current={current}
        onChange={setCurrent}
      />
      <Search tracks={tracks} onSelect={setCurrent} />
      <div className="left">
        <Disc key={current} artwork={track.artwork} playing={playing} />
        <div className="info">
          <p className="num">
            {String(current + 1).padStart(2, '0')} /{' '}
            {String(tracks.length).padStart(2, '0')}
          </p>
          <h1 className="title">{track.title}</h1>
          <p className="artist">{ARTIST}</p>
          <Player
            src={track.preview}
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onEnded={() => setCurrent((c) => (c + 1) % tracks.length)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
