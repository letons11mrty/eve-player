function Jacket({ track, active }) {
  return (
    <div className={active ? 'jacket active' : 'jacket'}>
      <img
        className="jacket-blur"
        src={track.artwork}
        alt=""
        aria-hidden="true"
      />
      <div className="jacket-main">
        <img
          src={track.artwork}
          alt={active ? track.title : ''}
          style={track.zoom ? { transform: track.zoom } : undefined}
        />
      </div>
    </div>
  )
}

export default Jacket
