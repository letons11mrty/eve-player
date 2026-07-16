function Disc({ artwork, playing }) {
  return (
    <div className={playing ? 'disc' : 'disc paused'}>
      <div className="sheen" />
      <div className="groove g1" />
      <div className="groove g2" />
      <div className="groove g3" />
      <div className="disc-label">
        <img src={artwork} alt="" />
      </div>
      <div className="spindle" />
    </div>
  )
}

export default Disc
