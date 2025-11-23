'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import BottomNav from '@/components/bottom-nav'
import { mockStores, mockPrices } from '@/lib/supabase'
import type { ShoppingListItem, StoreComparison } from '@/lib/types'
import { formatCurrency, calculateSavings, calculateSavingsPercentage } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, MapPin, TrendingDown, Award, Trash2, ShoppingBag, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/components/toast'
import { useShoppingList } from '@/hooks/use-shopping-list'

export default function ComparePage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { clearList } = useShoppingList()
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])
  const [comparisons, setComparisons] = useState<StoreComparison[]>([])
  const [cheapestStore, setCheapestStore] = useState<StoreComparison | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
        if (list.length > 0) {
          setShoppingList(list)
          calculateComparisons(list)
        } else {
          setIsLoading(false)
        }
      } catch (e) {
        addToast('Erro ao carregar lista', 'error')
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [mounted, addToast])

  const calculateComparisons = (list: ShoppingListItem[]) => {
    setIsLoading(true)
    
    // Simular um pequeno delay para mostrar loading
    setTimeout(() => {
      const storeComparisons: StoreComparison[] = mockStores.map(store => {
        let total = 0
        const items = list.map(item => {
          const priceData = mockPrices[item.product_id]?.[store.id]
          if (!priceData) return null

          const itemTotal = priceData.price * item.quantity
          total += itemTotal

          return {
            product: item.product,
            price: priceData.price,
            in_stock: priceData.in_stock,
          }
        }).filter(Boolean) as Array<{
          product: any
          price: number
          in_stock: boolean
        }>

        return {
          store,
          total,
          items,
        }
      })

      // Ordenar por preço total
      storeComparisons.sort((a, b) => a.total - b.total)
      setComparisons(storeComparisons)
      setCheapestStore(storeComparisons[0] || null)
      setIsLoading(false)
    }, 500)
  }

  const handleReserve = (storeId: string) => {
    router.push(`/checkout?store=${storeId}`)
  }

  const handleViewMap = (storeId: string) => {
    addToast('Funcionalidade de mapa em breve!', 'info')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface-card dark:bg-slate-800 rounded-xl p-6 animate-pulse">
                <div className="h-24 bg-surface-hover dark:bg-slate-700 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  if (shoppingList.length === 0 || comparisons.length === 0) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/home')}
            className="flex items-center gap-2 text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full flex items-center justify-center mb-6"
            >
              <ShoppingBag className="w-12 h-12 text-brand-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-3"
            >
              Nenhum item selecionado
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-content-secondary dark:text-slate-400 mb-8 max-w-md"
            >
              Adicione produtos à sua lista na página inicial para comparar preços entre diferentes lojas e encontrar os melhores valores.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/home')}
              className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-brand-primary/30 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Ir para Produtos
            </motion.button>
          </motion.div>
        </main>
        <BottomNav />
      </div>
    )
  }

  const maxTotal = Math.max(...comparisons.map(c => c.total))
  const savings = cheapestStore ? calculateSavings(cheapestStore.total, maxTotal) : 0
  const savingsPercentage = cheapestStore ? calculateSavingsPercentage(cheapestStore.total, maxTotal) : 0
  const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearList()
                localStorage.removeItem('kazen-shopping-list')
                addToast('Todos os itens foram removidos', 'success')
                router.push('/')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-status-error/10 hover:bg-status-error/20 dark:bg-status-error/20 dark:hover:bg-status-error/30 text-status-error dark:text-status-error-light rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Limpar Lista</span>
              <span className="sm:hidden">Limpar</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-2">
                Comparação de Preços
              </h1>
              <p className="text-content-secondary dark:text-slate-400">
                {shoppingList.length} {shoppingList.length === 1 ? 'produto' : 'produtos'} • {totalItems} itens
              </p>
            </div>
          </div>

          {/* Savings Banner - Melhorado */}
          {cheapestStore && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-accent via-brand-accent to-brand-accent-dark p-6 shadow-elevated mb-6"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white">
                    Melhor Oferta Encontrada!
                  </h2>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {formatCurrency(savings)}
                  </span>
                  <span className="text-xl font-semibold text-white/90">
                    ({savingsPercentage}% de economia)
                  </span>
                </div>
                <p className="text-white/90 text-sm">
                  Compre no <span className="font-bold">{cheapestStore.store.name}</span> e economize mais!
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Store Comparisons - Layout Melhorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {comparisons.map((comparison, index) => {
            const isCheapest = index === 0
            const barWidth = (comparison.total / maxTotal) * 100
            const difference = cheapestStore ? comparison.total - cheapestStore.total : 0

            return (
              <motion.div
                key={comparison.store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  bg-surface-card dark:bg-slate-800 rounded-xl border p-5 shadow-card flex flex-col
                  ${isCheapest 
                    ? 'border-brand-accent/50 ring-2 ring-brand-accent/20 bg-gradient-to-br from-brand-accent/5 to-transparent dark:from-brand-accent/10 lg:col-span-2' 
                    : 'border-border dark:border-slate-700'
                  }
                  transition-all duration-200 hover:shadow-elevated
                `}
              >
                {/* Store Header - Layout Horizontal Compacto */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {comparison.store.logo_url ? (
                      <div className={`
                        w-12 h-12 rounded-lg overflow-hidden bg-surface-hover dark:bg-slate-700 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 flex-shrink-0
                        ${isCheapest ? 'ring-brand-accent/30' : 'ring-brand-primary/20'}
                      `}>
                        <Image
                          src={comparison.store.logo_url}
                          alt={comparison.store.name}
                          width={48}
                          height={48}
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                          w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg flex-shrink-0
                          ${isCheapest ? 'ring-2 ring-brand-accent/30' : ''}
                        `}
                        style={{ backgroundColor: comparison.store.color_hex || '#14B8A6' }}
                      >
                        {comparison.store.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-content-primary dark:text-slate-50 text-base truncate">
                          {comparison.store.name}
                        </h3>
                        {isCheapest && (
                          <motion.span
                            initial={{ scale: 0, rotate: -12 }}
                            animate={{ scale: 1, rotate: -12 }}
                            className="bg-brand-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-lg flex-shrink-0"
                          >
                            <Award className="w-3 h-3" />
                            Mais Barato
                          </motion.span>
                        )}
                      </div>
                      <button
                        onClick={() => handleViewMap(comparison.store.id)}
                        className="flex items-center gap-1 text-xs text-content-secondary dark:text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary-light transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Localização</span>
                      </button>
                    </div>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-xl font-bold text-content-primary dark:text-slate-50 mb-0.5">
                      {formatCurrency(comparison.total)}
                    </p>
                    {!isCheapest && difference > 0 && (
                      <p className="text-[10px] text-status-error-DEFAULT font-semibold">
                        +{formatCurrency(difference)}
                      </p>
                    )}
                    {isCheapest && (
                      <p className="text-[10px] text-brand-accent font-semibold flex items-center gap-1 justify-end">
                        <TrendingDown className="w-3 h-3" />
                        Economia
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="mb-3">
                  <div className="h-2.5 bg-surface-hover dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className={`
                        h-full rounded-full relative
                        ${isCheapest 
                          ? 'bg-gradient-to-r from-brand-accent via-brand-accent to-brand-accent-dark' 
                          : 'bg-gradient-to-r from-content-secondary to-content-tertiary dark:from-slate-600 dark:to-slate-500'
                        }
                      `}
                    >
                      {isCheapest && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-white/20 rounded-full"
                        />
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Lista de produtos - Grid compacto */}
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-hide flex-1">
                  {comparison.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + itemIndex * 0.03 }}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {item.in_stock ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-success-DEFAULT flex-shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-status-error-DEFAULT flex items-center justify-center flex-shrink-0">
                            <span className="text-status-error-DEFAULT text-[8px]">✕</span>
                          </div>
                        )}
                        <span className={`
                          text-xs truncate
                          ${item.in_stock 
                            ? 'text-content-primary dark:text-slate-50' 
                            : 'text-content-tertiary dark:text-slate-500 line-through'
                          }
                        `}>
                          {item.product.name}
                        </span>
                      </div>
                      <span className={`
                        font-semibold text-xs ml-2 flex-shrink-0
                        ${item.in_stock 
                          ? 'text-content-primary dark:text-slate-50' 
                          : 'text-content-tertiary dark:text-slate-500'
                        }
                      `}>
                        {formatCurrency(item.price)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Botão de ação */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReserve(comparison.store.id)}
                  className={`
                    w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-auto
                    ${isCheapest
                      ? 'bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white hover:shadow-lg hover:shadow-brand-primary/40 shadow-elevated'
                      : 'bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 hover:bg-surface-pressed dark:hover:bg-slate-600'
                    }
                  `}
                >
                  {isCheapest ? (
                    <>
                      <Star className="w-4 h-4" />
                      Reservar Agora
                    </>
                  ) : (
                    'Ver Detalhes'
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
