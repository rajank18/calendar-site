import Button from '../UI/Button'

export default function MonthNavigator({ onPrev, onNext }) {
  return (
    <>
      <Button className="ribbon-btn ribbon-prev" onClick={onPrev} aria-label="Previous month">
        <span aria-hidden="true">&#8593;</span>
      </Button>
      <Button className="ribbon-btn ribbon-next" onClick={onNext} aria-label="Next month">
        <span aria-hidden="true">&#8595;</span>
      </Button>
    </>
  )
}
