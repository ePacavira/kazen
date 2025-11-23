'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import BottomNav from '@/components/bottom-nav'
import { User, LogOut, Settings, Bell, Moon, Sun, Shield, Heart, ShoppingBag, TrendingUp, Award, MapPin, Phone, Mail, Edit2, Save, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/components/toast'

export default function ProfilePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [userName, setUserName] = useState('Willfredy')
  const [userEmail, setUserEmail] = useState('willfredy@example.com')
  const [userPhone, setUserPhone] = useState('+244 923 456 789')
  const [userLocation, setUserLocation] = useState('Luanda, Angola')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notifications, setNotifications] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    if (isLoggedIn !== 'true') {
      router.push('/login')
      return
    }

    // Carregar dados do localStorage
    const savedName = localStorage.getItem('kazen-user-name')
    const savedEmail = localStorage.getItem('kazen-user-email')
    const savedPhone = localStorage.getItem('kazen-user-phone')
    const savedLocation = localStorage.getItem('kazen-user-location')
    const savedTheme = localStorage.getItem('kazen-theme') as 'light' | 'dark'
    const savedNotifications = localStorage.getItem('kazen-notifications')

    if (savedName) setUserName(savedName)
    if (savedEmail) setUserEmail(savedEmail)
    if (savedPhone) setUserPhone(savedPhone)
    if (savedLocation) setUserLocation(savedLocation)
    if (savedTheme) setTheme(savedTheme)
    if (savedNotifications !== null) setNotifications(savedNotifications === 'true')

    // Verificar tema do sistema
    if (!savedTheme && typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [router])

  const handleLogout = () => {
    // Limpar dados de autenticação
    localStorage.removeItem('kazen-user-logged-in')
    localStorage.removeItem('kazen-user-email')
    localStorage.removeItem('kazen-user-name')
    localStorage.removeItem('kazen-user-phone')
    localStorage.removeItem('kazen-user-location')
    // Manter outras preferências (tema, notificações, etc.)
    addToast('Sessão encerrada com sucesso', 'success')
    router.push('/login')
  }

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
    addToast(`Modo ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado`, 'success')
  }

  const handleSave = () => {
    localStorage.setItem('kazen-user-name', userName)
    localStorage.setItem('kazen-user-email', userEmail)
    localStorage.setItem('kazen-user-phone', userPhone)
    localStorage.setItem('kazen-user-location', userLocation)
    setIsEditing(false)
    addToast('Perfil atualizado com sucesso!', 'success')
  }

  const handleCancel = () => {
    // Restaurar valores originais
    const savedName = localStorage.getItem('kazen-user-name') || 'Willfredy'
    const savedEmail = localStorage.getItem('kazen-user-email') || 'willfredy@example.com'
    const savedPhone = localStorage.getItem('kazen-user-phone') || '+244 923 456 789'
    const savedLocation = localStorage.getItem('kazen-user-location') || 'Luanda, Angola'
    
    setUserName(savedName)
    setUserEmail(savedEmail)
    setUserPhone(savedPhone)
    setUserLocation(savedLocation)
    setIsEditing(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="h-64" />
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header do Perfil */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-2xl p-6 text-white shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30"
                >
                  <User className="w-10 h-10" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{userName}</h1>
                  <p className="text-white/80 text-sm">{userEmail}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                aria-label={isEditing ? 'Cancelar edição' : 'Editar perfil'}
              >
                {isEditing ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Edit2 className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Informações Pessoais */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-content-primary dark:text-slate-50 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-primary" />
            Informações Pessoais
          </h2>
          <div className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-content-secondary dark:text-slate-400 mb-1 block">
                Nome
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              ) : (
                <p className="text-content-primary dark:text-slate-50 font-medium">{userName}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-content-secondary dark:text-slate-400 mb-1 block flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              ) : (
                <p className="text-content-primary dark:text-slate-50 font-medium">{userEmail}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-content-secondary dark:text-slate-400 mb-1 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              ) : (
                <p className="text-content-primary dark:text-slate-50 font-medium">{userPhone}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-content-secondary dark:text-slate-400 mb-1 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Localização
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              ) : (
                <p className="text-content-primary dark:text-slate-50 font-medium">{userLocation}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 bg-brand-primary text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-brand-primary-dark transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </motion.button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Estatísticas */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-content-primary dark:text-slate-50 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            Estatísticas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 dark:from-brand-primary/20 dark:to-brand-primary/10 rounded-xl p-4 border border-brand-primary/20"
            >
              <ShoppingBag className="w-6 h-6 text-brand-primary mb-2" />
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50">12</p>
              <p className="text-xs text-content-secondary dark:text-slate-400">Listas criadas</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 dark:from-brand-accent/20 dark:to-brand-accent/10 rounded-xl p-4 border border-brand-accent/20"
            >
              <Award className="w-6 h-6 text-brand-accent mb-2" />
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50">1.2k</p>
              <p className="text-xs text-content-secondary dark:text-slate-400">Produtos comparados</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-brand-secondary/10 to-brand-secondary/5 dark:from-brand-secondary/20 dark:to-brand-secondary/10 rounded-xl p-4 border border-brand-secondary/20"
            >
              <TrendingUp className="w-6 h-6 text-brand-secondary mb-2" />
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50">45k</p>
              <p className="text-xs text-content-secondary dark:text-slate-400">Kz poupados</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-status-success/10 to-status-success/5 dark:from-status-success/20 dark:to-status-success/10 rounded-xl p-4 border border-status-success/20"
            >
              <Heart className="w-6 h-6 text-status-success mb-2" />
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50">98%</p>
              <p className="text-xs text-content-secondary dark:text-slate-400">Satisfação</p>
            </motion.div>
          </div>
        </motion.section>

        {/* Configurações */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-content-primary dark:text-slate-50 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-primary" />
            Configurações
          </h2>
          <div className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card divide-y divide-border dark:divide-slate-700">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={toggleTheme}
              className="w-full p-4 flex items-center justify-between hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-brand-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-brand-primary" />
                )}
                <div className="text-left">
                  <p className="font-medium text-content-primary dark:text-slate-50">
                    Modo {theme === 'dark' ? 'Escuro' : 'Claro'}
                  </p>
                  <p className="text-sm text-content-secondary dark:text-slate-400">
                    Alternar tema da aplicação
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-surface-hover dark:bg-slate-700 rounded-full relative">
                <motion.div
                  animate={{ x: theme === 'dark' ? 24 : 0 }}
                  className="w-6 h-6 bg-brand-primary rounded-full absolute top-0"
                />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              onClick={() => {
                setNotifications(!notifications)
                localStorage.setItem('kazen-notifications', String(!notifications))
                addToast(`Notificações ${!notifications ? 'ativadas' : 'desativadas'}`, 'success')
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-brand-primary" />
                <div className="text-left">
                  <p className="font-medium text-content-primary dark:text-slate-50">
                    Notificações
                  </p>
                  <p className="text-sm text-content-secondary dark:text-slate-400">
                    Receber alertas e atualizações
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-surface-hover dark:bg-slate-700 rounded-full relative">
                <motion.div
                  animate={{ x: notifications ? 24 : 0 }}
                  className="w-6 h-6 bg-brand-primary rounded-full absolute top-0"
                />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              className="w-full p-4 flex items-center justify-between hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-brand-primary" />
                <div className="text-left">
                  <p className="font-medium text-content-primary dark:text-slate-50">
                    Privacidade
                  </p>
                  <p className="text-sm text-content-secondary dark:text-slate-400">
                    Gerenciar dados e segurança
                  </p>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* Ações */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-status-error/10 hover:bg-status-error/20 dark:bg-status-error/20 dark:hover:bg-status-error/30 text-status-error dark:text-status-error-light py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border border-status-error/20"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </motion.button>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  )
}
