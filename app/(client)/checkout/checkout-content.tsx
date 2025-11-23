'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import BottomNav from '@/components/bottom-nav'
import { mockStores, mockPrices } from '@/lib/supabase'
import type { ShoppingListItem } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowLeft, CheckCircle2, QrCode, Loader2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import QRCodeDisplay from '@/components/qr-code-display'
import { useToast } from '@/components/toast'
import { useShoppingList } from '@/hooks/use-shopping-list'

export default function CheckoutContent() {
  const router = useRouter()
  const { addToast } = useToast()
  const { clearList } = useShoppingList()
  const searchParams = useSearchParams()
  const storeId = searchParams.get('store')
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [store, setStore] = useState<any>(null)
  const [total, setTotal] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
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
        const list: ShoppingListItem[] = JSON.parse(savedList)
        setShoppingList(list)
        
        if (storeId) {
          const foundStore = mockStores.find(s => s.id === storeId)
          if (foundStore) {
            setStore(foundStore)
            calculateTotal(list, storeId)
          } else {
            addToast('Loja não encontrada', 'error')
            router.push('/compare')
          }
        }
      } catch (e) {
        addToast('Erro ao carregar dados', 'error')
        router.push('/home')
      }
    } else {
      router.push('/home')
    }
  }, [mounted, storeId, router, addToast])

  const calculateTotal = (list: ShoppingListItem[], storeId: string) => {
    let totalPrice = 0
    list.forEach(item => {
      const priceData = mockPrices[item.product_id]?.[storeId]
      if (priceData && priceData.in_stock) {
        totalPrice += priceData.price * item.quantity
      }
    })
    setTotal(totalPrice)
  }

  const handlePayment = async () => {
    if (total <= 0) {
      addToast('Não há itens para pagar', 'error')
      return
    }

    setIsProcessing(true)
    addToast('Processando pagamento...', 'info')
    
    // Simular processamento de pagamento com progresso
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setShowSuccess(true)
    addToast('Pagamento realizado com sucesso!', 'success')
    
    // Confetes melhorados!
    const duration = 3000
    const end = Date.now() + duration

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval)
        return
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#14B8A6', '#F97316', '#8B5CF6']
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#14B8A6', '#F97316', '#8B5CF6']
      })
    }, 25)

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100])
    }
  }

  const handleShowQR = () => {
    setShowQR(true)
  }

  if (!store || shoppingList.length === 0) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-content-secondary dark:text-slate-400">Carregando...</p>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="h-screen bg-surface-ground dark:bg-slate-900 flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 pb-20 overflow-hidden flex flex-col">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 mb-4 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </motion.button>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6 sm:p-8 text-center flex-1 flex flex-col justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-status-success-lightest dark:bg-status-success-darkest/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-16 h-16 text-status-success-DEFAULT" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-3"
              >
                Reserva Confirmada!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-content-secondary dark:text-slate-400 mb-8"
              >
                A sua reserva foi feita com sucesso no <span className="font-semibold text-content-primary dark:text-slate-50">{store.name}</span>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShowQR}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  Mostrar QR Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Limpar a lista de compras
                    clearList()
                    localStorage.removeItem('kazen-shopping-list')
                    addToast('Lista de compras limpa', 'success')
                    router.push('/home')
                  }}
                  className="w-full bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 py-4 rounded-lg font-semibold hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                >
                  Voltar ao Início
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <h1 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-1">
                  Finalizar Reserva
                </h1>
                <p className="text-sm text-content-secondary dark:text-slate-400">
                  {store.name}
                </p>
              </motion.div>

              {/* Área de conteúdo com scroll interno se necessário */}
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide pb-4">
                <div className="space-y-4">
                  {/* Card da Loja - Layout Melhorado */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card p-5"
                  >
                    <div className="flex items-center gap-4">
                      {store.logo_url ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-hover dark:bg-slate-700 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 ring-brand-primary/20 flex-shrink-0">
                          <Image
                            src={store.logo_url}
                            alt={store.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0"
                          style={{ backgroundColor: store.color_hex || '#14B8A6' }}
                        >
                          {store.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-content-primary dark:text-slate-50 text-base mb-1 truncate">{store.name}</h3>
                        <p className="text-xs text-content-secondary dark:text-slate-400">Reserva para retirada</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card de Produtos - Layout Melhorado */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card overflow-hidden"
                  >
                    <div className="p-5 pb-4">
                      <h3 className="font-bold text-content-primary dark:text-slate-50 mb-4 text-base">Itens do Pedido</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {shoppingList.map((item, index) => {
                          const priceData = mockPrices[item.product_id]?.[store.id]
                          if (!priceData) return null

                          return (
                            <motion.div
                              key={item.product_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.03 }}
                              className="flex items-center justify-between py-2.5 px-3 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-content-primary dark:text-slate-50 truncate">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-content-secondary dark:text-slate-400">
                                  {item.quantity}x {formatCurrency(priceData.price)}
                                </p>
                              </div>
                              <p className="font-bold text-sm text-content-primary dark:text-slate-50 ml-3 flex-shrink-0">
                                {formatCurrency(priceData.price * item.quantity)}
                              </p>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="px-5 py-4 border-t border-border dark:border-slate-700 bg-surface-hover/30 dark:bg-slate-700/30">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-content-primary dark:text-slate-50">Total</span>
                        <motion.span
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="text-2xl font-bold text-brand-primary"
                        >
                          {formatCurrency(total)}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card de Método de Pagamento - Layout Melhorado */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 }}
                    className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card p-5"
                  >
                    <h3 className="font-bold text-content-primary dark:text-slate-50 mb-3 text-base">Método de Pagamento</h3>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-primary/10 to-brand-primary-dark/10 dark:from-brand-primary/20 dark:to-brand-primary-dark/20 rounded-xl border border-brand-primary/20 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-content-primary dark:text-slate-50">MCX Wallet</p>
                        <p className="text-xs text-content-secondary dark:text-slate-400">Pagamento rápido e seguro</p>
                      </div>
                    </div>
                    
                    {/* Botão de Pagamento - Dentro do card */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePayment}
                      disabled={isProcessing || total <= 0}
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white py-4 rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-brand-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processando Pagamento...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>Pagar {formatCurrency(total)}</span>
                        </>
                      )}
                    </motion.button>
                    
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.18 }}
                      className="text-xs text-content-tertiary dark:text-slate-500 text-center mt-3"
                    >
                      Ao continuar, você concorda com os termos de uso e política de privacidade
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-overlay-dark z-50 flex items-center justify-center p-4 pb-24"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-card dark:bg-slate-800 rounded-xl p-6 sm:p-8 max-w-sm w-full shadow-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-4 text-center">
                QR Code para Retirada
              </h3>
              <div className="mb-4 flex items-center justify-center">
                <QRCodeDisplay 
                  value={`kazen://checkout/${store?.id}/${Date.now()}`}
                  size={240}
                />
              </div>
              <p className="text-sm text-content-secondary dark:text-slate-400 text-center mb-6">
                Mostre este QR Code na loja para retirar os seus produtos
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQR(false)}
                className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-dark transition-colors"
              >
                Fechar
              </motion.button>
            </motion.div>
          </motion.div>
         )}

       </main>

       <BottomNav />
    </div>
  )
}

