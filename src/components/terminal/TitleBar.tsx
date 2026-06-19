export function TitleBar() {
  return (
    <div className="title-bar">
      <div className="traffic-lights">
        <span className="traffic-light red" />
        <span className="traffic-light yellow" />
        <span className="traffic-light green" />
      </div>
      <span className="title-text">tauqueer@tauq.me — cyber-shell</span>
      <div style={{ width: 54 }} />
    </div>
  )
}
