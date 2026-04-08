import { motion } from 'framer-motion'
import { MONTHS } from '../../constants/months'
import { MONTH_IMAGES } from '../../constants/monthImages'

export default function PolaroidHero({ monthDate }) {
  const monthName = MONTHS[monthDate.getMonth()]
  const imageSrc = MONTH_IMAGES[monthDate.getMonth()]

  return (
    <motion.article
      className="polaroid"
      initial={{ y: -24, opacity: 0, rotate: -7 }}
      animate={{ y: 0, opacity: 1, rotate: -2.5 }}
      whileHover={{ rotate: -0.3, scale: 1.03, y: -6 }}
      transition={{ type: 'spring', damping: 20, stiffness: 180 }}
    >
      <img src={imageSrc} alt={`${monthName} mood board`} loading="eager" />
      <footer>{monthName}</footer>
    </motion.article>
  )
}
