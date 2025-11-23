'use client'

import React, { useState, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X, Bell, BellOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number, action?: { label: string; onClick: () => void }) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    duration = 4000,
    action?: { label: string; onClick: () => void }
  ) => {
    const id = Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, message, type, duration, action }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} onClearAll={clearAll} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ 
  toasts, 
  onRemove, 
  onClearAll 
}: { 
  toasts: Toast[]
  onRemove: (id: string) => void
  onClearAll: () => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full sm:max-w-md">
      {/* Clear All Button - Só aparece se houver múltiplas notificações */}
      {toasts.length > 1 && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onClearAll}
          className="ml-auto mb-1 px-3 py-1.5 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-xs font-medium text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors pointer-events-auto shadow-elevated"
        >
          Limpar todas
        </motion.button>
      )}
      
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onRemove={onRemove}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ 
  toast, 
  onRemove,
  index 
}: { 
  toast: Toast
  onRemove: (id: string) => void
  index: number
}) {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: {
      bg: 'bg-status-success-lightest dark:bg-status-success-darkest/30',
      border: 'border-status-success',
      text: 'text-status-success-darkest dark:text-status-success-light',
      icon: 'text-status-success-dark',
    },
    error: {
      bg: 'bg-status-error-lightest dark:bg-status-error-darkest/30',
      border: 'border-status-error',
      text: 'text-status-error-darkest dark:text-status-error-light',
      icon: 'text-status-error-dark',
    },
    info: {
      bg: 'bg-status-info-lightest dark:bg-status-info-darkest/30',
      border: 'border-status-info',
      text: 'text-status-info-darkest dark:text-status-info-light',
      icon: 'text-status-info-dark',
    },
    warning: {
      bg: 'bg-status-warning-lightest dark:bg-status-warning-darkest/30',
      border: 'border-status-warning',
      text: 'text-status-warning-darkest dark:text-status-warning-light',
      icon: 'text-status-warning-dark',
    },
  }

  const Icon = icons[toast.type]
  const colorScheme = colors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ 
        type: 'spring',
        damping: 25,
        stiffness: 300,
        delay: index * 0.05
      }}
      className={cn(
        'bg-surface-card dark:bg-slate-800 border rounded-xl shadow-modal p-4 min-w-[300px] max-w-md pointer-events-auto',
        colorScheme.bg,
        colorScheme.border,
        'backdrop-blur-sm'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', colorScheme.icon)} />
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium', colorScheme.text)}>
            {toast.message}
          </p>
          {toast.action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toast.action.onClick}
              className="mt-2 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-medium hover:bg-brand-primary-dark transition-colors"
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(toast.id)}
          className={cn(
            'flex-shrink-0 p-1 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors',
            colorScheme.text
          )}
          aria-label="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={cn(
            'h-1 mt-3 rounded-full',
            colorScheme.border,
            'bg-current opacity-30'
          )}
        />
      )}
    </motion.div>
  )
}
