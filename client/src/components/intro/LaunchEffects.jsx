// Fixed particle positions keep the one-time reveal lightweight and repeatable.
export default function LaunchEffects() {
  return (
    <div className="launch-effects" aria-hidden="true">
      <div className="launch-effects__curtain launch-effects__curtain--left" />
      <div className="launch-effects__curtain launch-effects__curtain--right" />
      <div className="launch-effects__light" />
      <div className="launch-effects__mist" />
      {Array.from({ length: 16 }, (_, index) => (
        <i key={`petal-${index}`} className="launch-effects__petal" style={{
          '--x': `${6 + (index * 17) % 89}%`, '--drift': `${(index % 2 ? 1 : -1) * (18 + index * 3)}px`,
          '--delay': `${1.25 + (index % 4) * .12}s`, '--duration': `${2.1 + (index % 3) * .25}s`,
          '--petal-color': ['#eee3c7', '#cfad65', '#c78c64', '#aa6960'][index % 4],
        }} />
      ))}
      {Array.from({ length: 10 }, (_, index) => (
        <i key={`ember-${index}`} className="launch-effects__ember" style={{
          '--x': `${index % 2 ? 82 + index : 5 + index}%`,
          '--drift': `${index % 2 ? -15 : 15}px`, '--delay': `${.3 + (index % 3) * .08}s`,
        }} />
      ))}
    </div>
  )
}
