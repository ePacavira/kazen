'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { useToast } from './toast'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'promo'
  title: string
  message: string
  time: string
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export default function NotificationsPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { addToast } = useToast()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar notificações do localStorage
    const savedNotifications = localStorage.getItem('kazen-notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      // Notificações mockadas
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'promo',
          title: 'Nova Promoção!',
          message: 'Picanha Fresca com 20% de desconto no Kero Talatona',
          time: 'Há 2 horas',
          read: false,
          action: {
            label: 'Ver Oferta',
            onClick: () => {
              addToast('Redirecionando para a oferta...', 'info')
            }
          }
        },
        {
          id: '2',
          type: 'success',
          title: 'Lista Salva',
          message: 'Sua lista de compras foi salva com sucesso',
          time: 'Há 5 horas',
          read: false,
        },
        {
          id: '3',
          type: 'info',
          title: 'Preço Atualizado',
          message: 'O preço do Frango Inteiro mudou em 3 lojas',
          time: 'Há 1 dia',
          read: true,
        },
        {
          id: '4',
          type: 'warning',
          title: 'Produto Indisponível',
          message: 'Costela de Vaca está fora de estoque no Shoprite',
          time: 'Há 2 dias',
          read: true,
        },
        {
          id: '5',
          type: 'promo',
          title: 'Economia Detectada!',
          message: 'Você pode poupar até 15.000 Kz comparando preços',
          time: 'Há 3 dias',
          read: false,
        },
      ]
      setNotifications(mockNotifications)
      localStorage.setItem('kazen-notifications', JSON.stringify(mockNotifications))
    }
  }, [addToast])

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem('kazen-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('kazen-notifications', JSON.stringify(updated))
      return updated
    })
    addToast('Todas as notificações foram marcadas como lidas', 'success')
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('kazen-notifications', JSON.stringify(updated))
      return updated
    })
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.setItem('kazen-notifications', JSON.stringify([]))
    addToast('Todas as notificações foram removidas', 'info')
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle2
      case 'warning':
        return AlertTriangle
      case 'promo':
        return Sparkles
      default:
        return Info
    }
  }

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-status-success border-status-success bg-status-success-lightest dark:bg-status-success-darkest/20'
      case 'warning':
        return 'text-status-warning border-status-warning bg-status-warning-lightest dark:bg-status-warning-darkest/20'
      case 'promo':
        return 'text-brand-accent border-brand-accent bg-brand-accent/10 dark:bg-brand-accent/20'
      default:
        return 'text-status-info border-status-info bg-status-info-lightest dark:bg-status-info-darkest/20'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay sutil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Card Suspenso */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-border dark:border-slate-700 shadow-modal flex flex-col"
            style={{ maxHeight: 'calc(100vh - 6rem - 80px)' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border dark:border-slate-700 flex items-center justify-between bg-surface-card dark:bg-slate-800 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                  Notificações
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={markAllAsRead}
                    className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors text-content-secondary dark:text-slate-400"
                    title="Marcar todas como lidas"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-content-primary dark:text-slate-50" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-8 text-center">
                  <Bell className="w-16 h-16 text-content-tertiary dark:text-slate-600 mb-4" />
                  <p className="text-content-secondary dark:text-slate-400 font-medium mb-2">
                    Nenhuma notificação
                  </p>
                  <p className="text-sm text-content-tertiary dark:text-slate-500">
                    Você está em dia!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border dark:divide-slate-700">
                  <AnimatePresence>
                    {notifications.map((notification, index) => {
                      const Icon = getIcon(notification.type)
                      const colorClass = getColor(notification.type)

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => !notification.read && markAsRead(notification.id)}
                          className={cn(
                            'p-4 hover:bg-surface-hover dark:hover:bg-slate-800 transition-colors cursor-pointer relative group',
                            !notification.read && 'bg-brand-primary/5 dark:bg-brand-primary/10'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              'p-2 rounded-lg border flex-shrink-0',
                              colorClass
                            )}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className={cn(
                                  'font-semibold text-sm',
                                  !notification.read 
                                    ? 'text-content-primary dark:text-slate-50' 
                                    : 'text-content-secondary dark:text-slate-400'
                                )}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-sm text-content-secondary dark:text-slate-400 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-content-tertiary dark:text-slate-500">
                                  {notification.time}
                                </span>
                                {notification.action && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      notification.action?.onClick()
                                    }}
                                    className="text-xs font-medium text-brand-primary hover:text-brand-primary-dark"
                                  >
                                    {notification.action.label}
                                  </motion.button>
                                )}
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="p-1 rounded-lg hover:bg-surface-pressed dark:hover:bg-slate-700 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border dark:border-slate-700 bg-surface-card dark:bg-slate-800 rounded-b-2xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAll}
                  className="w-full py-2 px-4 bg-surface-hover dark:bg-slate-700 hover:bg-surface-pressed dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-content-primary dark:text-slate-50 transition-colors"
                >
                  Limpar Todas
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
