'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Search, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: 'cart' | 'search' | 'package'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

const icons = {
  cart: ShoppingCart,
  search: Search,
  package: Package,
}

export default function EmptyState({ icon = 'cart', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="w-24 h-24 bg-surface-hover dark:bg-slate-700 rounded-full flex items-center justify-center mb-6"
      >
        <Icon className="w-12 h-12 text-content-tertiary dark:text-slate-500" />
      </motion.div>
      <h3 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-2">
        {title}
      </h3>
      <p className="text-content-secondary dark:text-slate-400 mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-dark transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}

