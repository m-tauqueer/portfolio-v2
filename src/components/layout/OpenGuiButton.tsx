import { motion } from 'framer-motion'
import { MagneticButton } from '../ui/MagneticButton'

interface OpenGuiButtonProps {
  onClick: () => void
  visible: boolean
}

export function OpenGuiButton({ onClick, visible }: OpenGuiButtonProps) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="open-gui-wrapper"
    >
      <MagneticButton onClick={onClick} className="open-gui-btn">
        [ open gui ↓ ]
      </MagneticButton>
    </motion.div>
  )
}
