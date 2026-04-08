import { TAG_COLORS } from '../../constants/colors'

export default function TagChip({ tag }) {
  return (
    <span className="tag-chip" style={{ '--chip-color': TAG_COLORS[tag] || '#8a8a8a' }}>
      {tag}
    </span>
  )
}
