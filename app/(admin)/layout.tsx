'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  Store, 
  DollarSign, 
  BarChart3, 
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useToast } from '@/components/toast'

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Produtos', path: '/admin/products' },
  { icon: Store, label: 'Lojas', path: '/admin/stores' },
  { icon: DollarSign, label: 'Preços', path: '/admin/prices' },
  { icon: Users, label: 'Utilizadores', path: '/admin/users' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { addToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se é admin (fake check)
    const isAdmin = localStorage.getItem('kazen-admin-logged-in')
    if (isAdmin !== 'true') {
      addToast('Acesso negado. Apenas administradores.', 'error')
      router.push('/login')
    }
  }, [router, addToast])

  const handleLogout = () => {
    localStorage.removeItem('kazen-admin-logged-in')
    addToast('Sessão admin encerrada', 'success')
    router.push('/login')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-surface-card dark:bg-slate-800 border-r border-border dark:border-slate-700 flex flex-col"
      >
        {/* Logo e Header */}
        <div className="p-6 border-b border-border dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">K</span>
              </div>
              <div>
                <h1 className="font-bold text-content-primary dark:text-slate-50">Kazen</h1>
                <p className="text-xs text-content-secondary dark:text-slate-400">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <motion.button
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20'
                    : 'text-content-secondary dark:text-slate-400 hover:bg-surface-hover dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border dark:border-slate-700">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-status-error dark:text-status-error-light hover:bg-status-error/10 dark:hover:bg-status-error/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-surface-card dark:bg-slate-800 border-b border-border dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-content-secondary dark:text-slate-400" />
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-content-secondary dark:text-slate-400">
                Painel Administrativo
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-surface-overlay-dark z-40 lg:hidden"
        />
      )}
    </div>
  )
}

