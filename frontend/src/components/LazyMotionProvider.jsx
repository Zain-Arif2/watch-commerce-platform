import { LazyMotion, domAnimation } from 'framer-motion'

const LazyMotionProvider = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
)

export default LazyMotionProvider
