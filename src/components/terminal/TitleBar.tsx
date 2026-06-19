export function TitleBar() {
  return (
    <div className="title-bar">
      <div className="traffic-lights">
        <span className="traffic-light red" />
        <span className="traffic-light yellow" />
        <span className="traffic-light green" />
      </div>
      <span className="title-text font-display">tauqueer@tauq.me — netrunner-shell</span>
      <div style={{ width: 54 }} />
    </div>
  )
}
