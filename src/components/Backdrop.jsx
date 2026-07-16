import Jacket from './Jacket'

function Backdrop({ tracks, current }) {
  return (
    <div className="backdrop">
      {tracks.map((track, i) => (
        <Jacket key={track.id} track={track} active={i === current} />
      ))}
    </div>
  )
}

export default Backdrop
