'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, DollarSign, ShoppingCart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingProps {
  onComplete: () => void
}

const slides = [
  {
    icon: Clock,
    title: 'Poupe Tempo',
    description: 'Compare preços de múltiplos supermercados sem sair de casa. Encontre os melhores preços em segundos.',
    color: 'brand-primary',
    gradient: 'from-brand-primary to-brand-primary-dark',
  },
  {
    icon: DollarSign,
    title: 'Poupe Kwanzas',
    description: 'Economize até 30% nas suas compras comparando preços. Cada kwanza poupado faz a diferença.',
    color: 'brand-accent',
    gradient: 'from-brand-accent to-brand-accent-dark',
  },
  {
    icon: ShoppingCart,
    title: 'Compre Melhor',
    description: 'Tome decisões informadas. Veja onde cada produto está mais barato e monte a sua lista ideal.',
    color: 'brand-secondary',
    gradient: 'from-brand-secondary to-brand-secondary-dark',
  },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const skip = () => {
    onComplete()
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500",
      `bg-gradient-to-br ${slides[currentSlide].gradient}`
    )}>
      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={skip}
        className="absolute top-8 right-6 text-white/90 hover:text-white text-sm font-medium z-10 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full transition-colors"
      >
        Pular
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex flex-col items-center justify-center flex-1 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-12"
          >
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
              {(() => {
                const Icon = slides[currentSlide].icon
                return (
                  <Icon className="w-16 h-16 text-white" />
                )
              })()}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white text-center mb-4"
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/95 text-center text-lg mb-12 leading-relaxed"
          >
            {slides[currentSlide].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Next button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={nextSlide}
        className="bg-white text-brand-primary-dark font-semibold px-8 py-4 rounded-full flex items-center gap-2 shadow-2xl hover:shadow-3xl transition-shadow"
      >
        {currentSlide === slides.length - 1 ? 'Começar' : 'Próximo'}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
