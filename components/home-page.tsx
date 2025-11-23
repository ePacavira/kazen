'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from './header'
import ProductCard from './product-card'
import BottomNav from './bottom-nav'
import { mockProducts, mockPrices, mockStores } from '@/lib/supabase'
import { useShoppingList } from '@/hooks/use-shopping-list'
import { ShoppingCart, TrendingDown, X, Flame, Star, TrendingUp, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from './toast'
import { formatCurrency, calculateSavings } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const { shoppingList, addProduct, removeProduct, updateQuantity, totalItems, itemCount, clearList } = useShoppingList()
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)

  // Calcular poupança estimada
  const estimatedSavings = useMemo(() => {
    if (shoppingList.length === 0) return 0
    
    let minTotal = Infinity
    let maxTotal = 0

    mockStores.forEach(store => {
      let total = 0
      shoppingList.forEach(item => {
        const priceData = mockPrices[item.product_id]?.[store.id]
        if (priceData && priceData.in_stock) {
          total += priceData.price * item.quantity
        }
      })
      if (total > 0) {
        minTotal = Math.min(minTotal, total)
        maxTotal = Math.max(maxTotal, total)
      }
    })

    return maxTotal > 0 ? calculateSavings(minTotal, maxTotal) : 0
  }, [shoppingList])

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return mockProducts
    
    const query = searchQuery.toLowerCase()
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Produtos em promoção
  const promoProducts = useMemo(() => {
    return mockProducts.filter(product => {
      return mockStores.some(store => {
        const priceData = mockPrices[product.id]?.[store.id]
        return priceData?.is_promo
      })
    })
  }, [])

  // Produtos mais baratos (melhor preço)
  const cheapestProducts = useMemo(() => {
    return mockProducts
      .map(product => {
        const prices = mockStores.map(store => {
          const priceData = mockPrices[product.id]?.[store.id]
          return priceData?.price || Infinity
        }).filter(p => p !== Infinity)
        
        const minPrice = prices.length > 0 ? Math.min(...prices) : Infinity
        return { product, minPrice }
      })
      .filter(item => item.minPrice !== Infinity)
      .sort((a, b) => a.minPrice - b.minPrice)
      .slice(0, 5)
      .map(item => item.product)
  }, [])

  // Produtos premium (marcas premium)
  const premiumProducts = useMemo(() => {
    return mockProducts.filter(product => 
      product.brand === 'Premium' || product.brand === 'Gourmet'
    ).slice(0, 5)
  }, [])

  // Escutar evento de busca do header
  useEffect(() => {
    const handleSearchOpen = () => {
      setShowSearchBar(true)
    }
    window.addEventListener('kazen:open-search', handleSearchOpen)
    return () => {
      window.removeEventListener('kazen:open-search', handleSearchOpen)
    }
  }, [])

  const handleCompare = () => {
    if (shoppingList.length === 0) {
      addToast('Adicione produtos à lista primeiro!', 'warning')
      return
    }
    localStorage.setItem('kazen-shopping-list', JSON.stringify(shoppingList))
    router.push('/compare')
  }

  const getProductPrices = (productId: string) => {
    const prices = mockStores.map(store => {
      const priceData = mockPrices[productId]?.[store.id]
      return priceData?.price || 0
    }).filter(p => p > 0)
    
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
    const hasPromo = mockStores.some(store => {
      const priceData = mockPrices[productId]?.[store.id]
      return priceData?.is_promo
    })
    
    return { minPrice, maxPrice, hasPromo }
  }

  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section - Mais compacta */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-content-primary dark:text-slate-50 mb-1">
                Churrasco de Domingo
              </h1>
              <p className="text-sm sm:text-base text-content-secondary dark:text-slate-400">
                Compare preços e poupe nas suas compras
              </p>
            </div>
            {shoppingList.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-brand-accent to-brand-accent-dark text-white px-4 py-2 rounded-full shadow-lg self-start sm:self-auto"
              >
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    Poupe até {formatCurrency(estimatedSavings)}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Search Bar - Aparece quando há busca ou quando clicado no header */}
          <AnimatePresence>
            {(showSearchBar || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative mb-4 overflow-hidden"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchBar(true)}
                    autoFocus
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all text-sm"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-content-tertiary dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setShowSearchBar(false)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-hover dark:hover:bg-slate-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-content-tertiary dark:text-slate-500" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar - Só aparece se tiver itens */}
          {shoppingList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 dark:from-brand-primary/20 dark:to-brand-accent/20 rounded-xl p-3 mb-4 border border-brand-primary/20"
            >
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-content-secondary dark:text-slate-400">
                    {itemCount} {itemCount === 1 ? 'produto' : 'produtos'} • {totalItems} itens
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-accent">
                    Poupe {formatCurrency(estimatedSavings)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Seção 1 de 3: Em Promoção */}
        {!searchQuery && promoProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-brand-accent/10 dark:bg-brand-accent/20 px-2 py-1 rounded text-xs font-bold text-brand-accent">
                  1 de 3
                </div>
                <Flame className="w-5 h-5 text-brand-accent" />
                <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                  Em Promoção
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {promoProducts.map((product, index) => {
                  const item = shoppingList.find(i => i.product_id === product.id)
                  const { minPrice, maxPrice, hasPromo } = getProductPrices(product.id)

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-[160px] sm:w-[180px] flex-shrink-0"
                    >
                      <ProductCard
                        product={product}
                        quantity={item?.quantity || 0}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        hasPromo={hasPromo}
                        onAdd={() => addProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                        onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Seção 2 de 3: Melhores Preços */}
        {!searchQuery && cheapestProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-brand-primary/10 dark:bg-brand-primary/20 px-2 py-1 rounded text-xs font-bold text-brand-primary">
                  2 de 3
                </div>
                <TrendingDown className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                  Melhores Preços
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {cheapestProducts.map((product, index) => {
                  const item = shoppingList.find(i => i.product_id === product.id)
                  const { minPrice, maxPrice, hasPromo } = getProductPrices(product.id)

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-[160px] sm:w-[180px] flex-shrink-0"
                    >
                      <ProductCard
                        product={product}
                        quantity={item?.quantity || 0}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        hasPromo={hasPromo}
                        onAdd={() => addProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                        onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Seção 3 de 3: Premium */}
        {!searchQuery && premiumProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-brand-secondary/10 dark:bg-brand-secondary/20 px-2 py-1 rounded text-xs font-bold text-brand-secondary">
                  3 de 3
                </div>
                <Star className="w-5 h-5 text-brand-secondary" />
                <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                  Premium & Gourmet
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                {premiumProducts.map((product, index) => {
                  const item = shoppingList.find(i => i.product_id === product.id)
                  const { minPrice, maxPrice, hasPromo } = getProductPrices(product.id)

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="w-[160px] sm:w-[180px] flex-shrink-0"
                    >
                      <ProductCard
                        product={product}
                        quantity={item?.quantity || 0}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        hasPromo={hasPromo}
                        onAdd={() => addProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                        onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* Seção Principal de Produtos - Só aparece se não houver busca */}
        {!searchQuery && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                Todos os Produtos
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {mockProducts.map((product, index) => {
                const item = shoppingList.find(i => i.product_id === product.id)
                const { minPrice, maxPrice, hasPromo } = getProductPrices(product.id)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ProductCard
                      product={product}
                      quantity={item?.quantity || 0}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      hasPromo={hasPromo}
                      onAdd={() => addProduct(product.id)}
                      onRemove={() => removeProduct(product.id)}
                      onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                    />
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* Resultados da Busca */}
        {searchQuery && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-content-primary dark:text-slate-50">
                Resultados da busca
              </h2>
              <p className="text-sm text-content-secondary dark:text-slate-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-content-secondary dark:text-slate-400 mb-2">
                  Nenhum produto encontrado
                </p>
                <p className="text-sm text-content-tertiary dark:text-slate-500">
                  Tente buscar com outros termos
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product, index) => {
                  const item = shoppingList.find(i => i.product_id === product.id)
                  const { minPrice, maxPrice, hasPromo } = getProductPrices(product.id)

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ProductCard
                        product={product}
                        quantity={item?.quantity || 0}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        hasPromo={hasPromo}
                        onAdd={() => addProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                        onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Floating Action Button - Melhorado */}
      <AnimatePresence>
        {shoppingList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-0 right-0 bg-white dark:bg-slate-800 border-t border-border dark:border-slate-700 shadow-modal p-4 z-40 backdrop-blur-sm bg-white/95 dark:bg-slate-800/95"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-content-secondary dark:text-slate-400 truncate">
                  {itemCount} {itemCount === 1 ? 'produto' : 'produtos'} selecionados
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base sm:text-lg font-semibold text-content-primary dark:text-slate-50">
                    {totalItems} itens
                  </p>
                  {estimatedSavings > 0 && (
                    <>
                      <span className="text-content-tertiary dark:text-slate-500">•</span>
                      <p className="text-xs sm:text-sm font-medium text-brand-accent">
                        Poupe {formatCurrency(estimatedSavings)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    clearList()
                    addToast('Todos os itens foram removidos', 'success')
                  }}
                  className="p-2.5 sm:p-3 bg-status-error/10 hover:bg-status-error/20 dark:bg-status-error/20 dark:hover:bg-status-error/30 text-status-error dark:text-status-error-light rounded-full transition-colors"
                  title="Limpar lista"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCompare}
                  className="bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-brand-primary/30 transition-all shadow-elevated whitespace-nowrap text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Comparar</span>
                  <span className="sm:hidden">Ver</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
