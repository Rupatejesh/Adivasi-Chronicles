import './TitleCardTwo.css'

function TitleCardTwo({ onContinue }) {
  return (
    <div className="title-card-two" aria-label="Bright Eastern Ghats-inspired morning landscape">
      <div className="title-card-two__sky" aria-hidden="true" />
      <div className="title-card-two__sun-glow" aria-hidden="true" />
      <div className="title-card-two__sunbeam" aria-hidden="true" />
      <div className="title-card-two__mountains title-card-two__mountains--far" aria-hidden="true" />
      <div className="title-card-two__mountains title-card-two__mountains--mid" aria-hidden="true" />
      <div className="title-card-two__valley-light" aria-hidden="true" />

      <div className="title-card-two__mist-curtain" aria-hidden="true">
        <span className="title-card-two__mist-layer title-card-two__mist-layer--one" />
        <span className="title-card-two__mist-layer title-card-two__mist-layer--two" />
        <span className="title-card-two__mist-layer title-card-two__mist-layer--three" />
        <span className="title-card-two__mist-layer title-card-two__mist-layer--four" />
        <span className="title-card-two__mist-layer title-card-two__mist-layer--five" />
      </div>

      <div className="title-card-two__hills title-card-two__hills--back" aria-hidden="true" />
      <div className="title-card-two__hills title-card-two__hills--mid" aria-hidden="true" />
      <div className="title-card-two__forest title-card-two__forest--back" aria-hidden="true" />
      <div className="title-card-two__hills title-card-two__hills--front" aria-hidden="true" />
      <div className="title-card-two__forest title-card-two__forest--front" aria-hidden="true" />
      <div className="title-card-two__petals" aria-hidden="true">
        <span className="title-card-two__petal title-card-two__petal--one" />
        <span className="title-card-two__petal title-card-two__petal--two" />
        <span className="title-card-two__petal title-card-two__petal--three" />
        <span className="title-card-two__petal title-card-two__petal--four" />
        <span className="title-card-two__petal title-card-two__petal--five" />
        <span className="title-card-two__petal title-card-two__petal--six" />
      </div>

      <div className="title-card-two__content" aria-live="polite">
        <p className="title-card-two__message">
          <span className="title-card-two__line title-card-two__line--one">Stories that survived.</span>
          <span className="title-card-two__line title-card-two__line--two">Ideas that transformed society.</span>
          <span className="title-card-two__line title-card-two__line--three">Rights that empower generations.</span>
        </p>

        <button
          type="button"
          className="title-card-two__cta"
          onClick={onContinue}
          aria-label="Enter Website"
        >
          Enter Website
        </button>
      </div>
    </div>
  )
}

export default TitleCardTwo
