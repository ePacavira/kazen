'use client'

import { Moon, Sun, User, Bell, Search, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { useShoppingList } from '@/hooks/use-shopping-list'
import NotificationsPanel from './notifications-panel'

export default function Header() {
  const [userName, setUserName] = useState('Willfredy')
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [themeMounted, setThemeMounted] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const { itemCount, totalItems } = useShoppingList()

  useEffect(() => {
    setMounted(true)
    // Login fake - pegar nome do localStorage ou usar padrão
    const savedName = localStorage.getItem('kazen-user-name')
    if (savedName) {
      setUserName(savedName)
    }

    // Tentar usar o theme provider, mas com fallback
    try {
      const savedTheme = localStorage.getItem('kazen-theme') as 'light' | 'dark'
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
      setThemeMounted(true)
    } catch (e) {
      // Fallback se não conseguir acessar
      setThemeMounted(true)
    }
  }, [])

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Carregar contagem de notificações não lidas
  useEffect(() => {
    const loadUnreadCount = () => {
      const savedNotifications = localStorage.getItem('kazen-notifications')
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications)
          const unread = notifications.filter((n: { read: boolean }) => !n.read).length
          setUnreadCount(unread)
        } catch (e) {
          // Ignorar erro
        }
      }
    }

    loadUnreadCount()
    // Atualizar a cada 5 segundos
    const interval = setInterval(loadUnreadCount, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('kazen-theme', newTheme)
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const handleSearchClick = () => {
    if (pathname !== '/') {
      router.push('/')
      // Aguardar navegação antes de abrir busca
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('kazen:open-search'))
      }, 100)
    } else {
      window.dispatchEvent(new CustomEvent('kazen:open-search'))
    }
  }

  if (!mounted || !themeMounted) {
    return (
      <header className="bg-brand-primary border-b border-brand-primary-dark sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="h-10" />
        </div>
      </header>
    )
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled 
            ? (theme === 'dark' ? '#0f172a' : '#ffffff')
            : '#14B8A6',
          color: isScrolled 
            ? (theme === 'dark' ? '#f8fafc' : '#0f172a')
            : '#ffffff',
        }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-30 backdrop-blur-sm shadow-sm ${
          isScrolled 
            ? 'border-b border-border/30 dark:border-slate-700/30 bg-white/95 dark:bg-slate-900/95' 
            : 'border-b border-brand-primary-dark/20 bg-brand-primary'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo e Nome */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer flex-shrink-0 ${
                  isScrolled 
                    ? 'bg-gradient-primary' 
                    : 'bg-white/20 backdrop-blur-sm'
                }`}
              >
                <span className={`font-bold text-lg ${
                  isScrolled ? 'text-white' : 'text-white'
                }`}>
                  K
                </span>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h1 className={`text-lg font-bold truncate ${
                  isScrolled 
                    ? 'text-content-primary dark:text-slate-50' 
                    : 'text-white'
                }`}>
                  Kazen
                </h1>
                <p className={`text-xs truncate ${
                  isScrolled 
                    ? 'text-content-secondary dark:text-slate-400' 
                    : 'text-white/80'
                }`}>
                  Olá, {userName}
                </p>
              </div>
            </motion.div>

            {/* Actions - Desktop */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchClick}
                className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Buscar"
                title="Buscar"
              >
                <Search className={`w-5 h-5 ${
                  isScrolled 
                    ? 'text-content-primary dark:text-slate-50' 
                    : 'text-white'
                }`} />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(true)}
                className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notificações"
                title="Notificações"
              >
                <Bell className={`w-5 h-5 ${
                  isScrolled 
                    ? 'text-content-primary dark:text-slate-50' 
                    : 'text-white'
                }`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Shopping Cart Badge */}
              {itemCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push('/compare')}
                  className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors relative"
                  aria-label="Ver lista"
                  title="Ver lista"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className={`w-full h-full border-2 rounded-full flex items-center justify-center relative ${
                      isScrolled 
                        ? 'border-content-primary dark:border-slate-50' 
                        : 'border-white'
                    }`}>
                      <span className={`text-[10px] font-bold ${
                        isScrolled 
                          ? 'text-content-primary dark:text-slate-50' 
                          : 'text-white'
                      }`}>
                        {itemCount}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {totalItems}
                  </span>
                </motion.button>
              )}

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors"
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className={`w-5 h-5 ${
                    isScrolled 
                      ? 'text-content-primary dark:text-slate-50' 
                      : 'text-white'
                  }`} />
                ) : (
                  <Moon className={`w-5 h-5 ${
                    isScrolled 
                      ? 'text-content-primary' 
                      : 'text-white'
                  }`} />
                )}
              </motion.button>

              {/* Profile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push('/profile')}
                className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors"
                aria-label="Abrir perfil"
                title="Perfil"
              >
                <User className={`w-5 h-5 ${
                  isScrolled 
                    ? 'text-content-primary dark:text-slate-50' 
                    : 'text-white'
                }`} />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center gap-2">
              {itemCount > 0 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push('/compare')}
                  className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors relative"
                  aria-label="Ver lista"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className={`w-full h-full border-2 rounded-full flex items-center justify-center ${
                      isScrolled 
                        ? 'border-content-primary dark:border-slate-50' 
                        : 'border-white'
                    }`}>
                      <span className={`text-[10px] font-bold ${
                        isScrolled 
                          ? 'text-content-primary dark:text-slate-50' 
                          : 'text-white'
                      }`}>
                        {itemCount}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {totalItems}
                  </span>
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-full hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <X className={`w-5 h-5 ${
                    isScrolled 
                      ? 'text-content-primary dark:text-slate-50' 
                      : 'text-white'
                  }`} />
                ) : (
                  <Menu className={`w-5 h-5 ${
                    isScrolled 
                      ? 'text-content-primary dark:text-slate-50' 
                      : 'text-white'
                  }`} />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-surface-overlay-dark z-40 sm:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-l border-border dark:border-slate-700 z-50 sm:hidden shadow-modal"
            >
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    handleSearchClick()
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Search className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  <span className="text-content-primary dark:text-slate-50">Buscar</span>
                </button>
                <button
                  onClick={() => {
                    router.push('/list')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-content-secondary dark:border-slate-400 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-content-secondary dark:text-slate-400">
                        {itemCount}
                      </span>
                    </div>
                  </div>
                  <span className="text-content-primary dark:text-slate-50">Minha Lista</span>
                  {itemCount > 0 && (
                    <span className="ml-auto bg-brand-accent text-white text-xs px-2 py-1 rounded-full font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    router.push('/compare')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className="text-content-primary dark:text-slate-50">Comparar Preços</span>
                </button>
                <div className="border-t border-border dark:border-slate-700 my-2" />
                <button
                  onClick={() => {
                    toggleTheme()
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors text-left"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-content-secondary" />
                  )}
                  <span className="text-content-primary dark:text-slate-50">
                    {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    router.push('/profile')
                    setShowMobileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  <span className="text-content-primary dark:text-slate-50">Perfil</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => {
          setShowNotifications(false)
          // Recarregar contagem após fechar
          const savedNotifications = localStorage.getItem('kazen-notifications')
          if (savedNotifications) {
            try {
              const notifications = JSON.parse(savedNotifications)
              const unread = notifications.filter((n: { read: boolean }) => !n.read).length
              setUnreadCount(unread)
            } catch (e) {
              // Ignorar erro
            }
          }
        }} 
      />
    </>
  )
}
