'use client'

import { Home, ShoppingBag, BarChart3, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const navItems = [
  { icon: Home, label: 'Início', path: '/home' },
  { icon: ShoppingBag, label: 'Lista', path: '/list' },
  { icon: BarChart3, label: 'Comparar', path: '/compare' },
  { icon: User, label: 'Perfil', path: '/profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-border dark:border-slate-700 z-50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 safe-area-inset-bottom">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors relative',
                  isActive
                    ? 'text-brand-primary'
                    : 'text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50'
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-primary/10 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn('w-5 h-5 relative z-10', isActive && 'stroke-[2.5]')} />
                <span className="text-xs font-medium relative z-10">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
