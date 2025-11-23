'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import BottomNav from '@/components/bottom-nav'
import EmptyState from '@/components/empty-state'
import type { ShoppingListItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { Trash2, Plus, Minus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/toast'
import { useShoppingList } from '@/hooks/use-shopping-list'

export default function ListPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { clearList } = useShoppingList()
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    if (isLoggedIn !== 'true') {
      router.push('/login')
      return
    }
  }, [router])

  useEffect(() => {
    if (!mounted) return
    const savedList = localStorage.getItem('kazen-shopping-list')
    if (savedList) {
      try {
        setShoppingList(JSON.parse(savedList))
      } catch (e) {
        console.error('Error loading list:', e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  const handleRemove = (productId: string) => {
    const updated = shoppingList.filter(item => item.product_id !== productId)
    setShoppingList(updated)
    localStorage.setItem('kazen-shopping-list', JSON.stringify(updated))
    addToast('Produto removido', 'info')
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(productId)
      return
    }
    const updated = shoppingList.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    )
    setShoppingList(updated)
    localStorage.setItem('kazen-shopping-list', JSON.stringify(updated))
  }

  if (shoppingList.length === 0) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-6">
            Minha Lista
          </h1>
          <EmptyState
            icon="cart"
            title="Lista vazia"
            description="Adicione produtos na página inicial para começar a comparar preços"
            action={{
              label: 'Ver Produtos',
              onClick: () => router.push('/home')
            }}
          />
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-content-primary dark:text-slate-50">
            Minha Lista
          </h1>
          {shoppingList.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearList()
                setShoppingList([])
                localStorage.removeItem('kazen-shopping-list')
                addToast('Todos os itens foram removidos', 'success')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-status-error/10 hover:bg-status-error/20 dark:bg-status-error/20 dark:hover:bg-status-error/30 text-status-error dark:text-status-error-light rounded-lg font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar Tudo</span>
              <span className="sm:hidden">Limpar</span>
            </motion.button>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {shoppingList.map((item, index) => (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-4 flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-surface-hover dark:bg-slate-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-content-primary dark:text-slate-50 mb-2 truncate">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-surface-hover dark:bg-slate-700 flex items-center justify-center text-content-primary dark:text-slate-50 hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="font-bold text-content-primary dark:text-slate-50 w-8 text-center">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-surface-hover dark:bg-slate-700 flex items-center justify-center text-content-primary dark:text-slate-50 hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(item.product_id)}
                  className="p-2 text-status-error-DEFAULT hover:bg-status-error-lightest dark:hover:bg-status-error-darkest/30 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Remover produto"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
