import { useEffect, useRef, useState } from 'react'

function Search({ tracks, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const results = query.trim()
    ? tracks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const select = (index) => {
    onSelect(index)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={open ? 'search open' : 'search'} ref={wrapRef}>
      <button
        className="search-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="曲を検索"
      >
        ⌕
      </button>
      {open && (
        <div className="search-panel">
          <input
            ref={inputRef}
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="曲を検索"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false)
                setQuery('')
              }
            }}
          />
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((t) => (
                <li key={t.id}>
                  <button onClick={() => select(tracks.indexOf(t))}>
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
