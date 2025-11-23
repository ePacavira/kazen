'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, Search, Edit2, TrendingUp, TrendingDown, Tag, X, Save } from 'lucide-react'
import { mockProducts, mockStores, mockPrices } from '@/lib/supabase'
import { useToast } from '@/components/toast'
import { formatCurrency } from '@/lib/utils'

type PriceData = {
  price: number
  is_promo: boolean
  in_stock: boolean
}

export default function PricesPage() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStore, setSelectedStore] = useState<string>('all')
  const [prices, setPrices] = useState<Record<string, Record<string, PriceData>>>({})
  const [showModal, setShowModal] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, PriceData>>({})
  const [products, setProducts] = useState(mockProducts)
  const [stores, setStores] = useState(mockStores)

  // Carregar preços do localStorage ou usar mockPrices
  useEffect(() => {
    const savedPrices = localStorage.getItem('kazen-admin-prices')
    if (savedPrices) {
      setPrices(JSON.parse(savedPrices))
    } else {
      setPrices(mockPrices)
      localStorage.setItem('kazen-admin-prices', JSON.stringify(mockPrices))
    }
  }, [])

  // Carregar produtos e lojas do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('kazen-admin-products')
    const savedStores = localStorage.getItem('kazen-admin-stores')
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    if (savedStores) {
      setStores(JSON.parse(savedStores))
    }
  }, [])

  // Salvar preços no localStorage
  const savePrices = (newPrices: Record<string, Record<string, PriceData>>) => {
    setPrices(newPrices)
    localStorage.setItem('kazen-admin-prices', JSON.stringify(newPrices))
  }

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, searchQuery])

  const handleEdit = (productId: string) => {
    setEditingProductId(productId)
    
    // Carregar preços atuais do produto para todas as lojas
    const currentPrices: Record<string, PriceData> = {}
    stores.forEach(store => {
      const priceData = prices[productId]?.[store.id]
      if (priceData) {
        currentPrices[store.id] = { ...priceData }
      } else {
        // Se não existe, criar com valores padrão
        currentPrices[store.id] = {
          price: 0,
          is_promo: false,
          in_stock: true,
        }
      }
    })
    
    setFormData(currentPrices)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!editingProductId) return

    // Validar preços
    let hasError = false
    stores.forEach(store => {
      const priceData = formData[store.id]
      if (priceData && priceData.price < 0) {
        hasError = true
        addToast(`Preço inválido para ${store.name}`, 'error')
      }
    })

    if (hasError) return

    // Atualizar preços
    const newPrices = { ...prices }
    if (!newPrices[editingProductId]) {
      newPrices[editingProductId] = {}
    }

    stores.forEach(store => {
      const priceData = formData[store.id]
      if (priceData && priceData.price > 0) {
        newPrices[editingProductId][store.id] = {
          price: priceData.price,
          is_promo: priceData.is_promo || false,
          in_stock: priceData.in_stock !== false,
        }
      }
    })

    savePrices(newPrices)
    addToast('Preços atualizados com sucesso!', 'success')
    setShowModal(false)
    setEditingProductId(null)
    setFormData({})
  }

  const getPriceData = (productId: string, storeId: string) => {
    return prices[productId]?.[storeId]
  }

  const getMinPrice = (productId: string) => {
    const productPrices = Object.values(prices[productId] || {})
      .filter(p => p.in_stock)
      .map(p => p.price)
    return productPrices.length > 0 ? Math.min(...productPrices) : 0
  }

  const getMaxPrice = (productId: string) => {
    const productPrices = Object.values(prices[productId] || {})
      .filter(p => p.in_stock)
      .map(p => p.price)
    return productPrices.length > 0 ? Math.max(...productPrices) : 0
  }


  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-2">
          Preços
        </h1>
        <p className="text-content-secondary dark:text-slate-400">
          Gerencie os preços dos produtos por loja
        </p>
      </motion.div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Store Filter */}
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="px-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
        >
          <option value="all">Todas as lojas</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>

      {/* Prices Table */}
      <div className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-hover dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-content-secondary dark:text-slate-400 uppercase tracking-wider">
                  Produto
                </th>
                {stores.map(store => (
                  <th key={store.id} className="px-6 py-4 text-center text-xs font-semibold text-content-secondary dark:text-slate-400 uppercase tracking-wider">
                    {store.name}
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-xs font-semibold text-content-secondary dark:text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-700">
              {filteredProducts.map((product, index) => {
                const minPrice = getMinPrice(product.id)
                const maxPrice = getMaxPrice(product.id)
                
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-hover/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-content-primary dark:text-slate-50">
                          {product.name}
                        </p>
                        <p className="text-xs text-content-secondary dark:text-slate-400">
                          {product.category} • {product.brand || 'Sem marca'}
                        </p>
                      </div>
                    </td>
                    {stores.map(store => {
                      const priceData = getPriceData(product.id, store.id)
                      const isMin = priceData && priceData.price === minPrice && minPrice !== maxPrice
                      const isMax = priceData && priceData.price === maxPrice && minPrice !== maxPrice
                      
                      return (
                        <td key={store.id} className="px-6 py-4 text-center">
                          {priceData ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${
                                  isMin ? 'text-status-success' : 
                                  isMax ? 'text-status-error' : 
                                  'text-content-primary dark:text-slate-50'
                                }`}>
                                  {formatCurrency(priceData.price)}
                                </span>
                                {priceData.is_promo && (
                                  <Tag className="w-3.5 h-3.5 text-status-warning" />
                                )}
                              </div>
                              {isMin && (
                                <span className="text-xs text-status-success flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  Mais barato
                                </span>
                              )}
                              {isMax && !isMin && (
                                <span className="text-xs text-status-error flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Mais caro
                                </span>
                              )}
                              {!priceData.in_stock && (
                                <span className="text-xs text-status-error">Sem estoque</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-content-tertiary dark:text-slate-500">-</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(product.id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </motion.button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <DollarSign className="w-16 h-16 text-content-tertiary dark:text-slate-500 mx-auto mb-4" />
          <p className="text-content-secondary dark:text-slate-400">
            Nenhum produto encontrado
          </p>
        </motion.div>
      )}

      {/* Modal Edit Prices */}
      <AnimatePresence>
        {showModal && editingProductId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-surface-overlay-dark z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-700">
                  <div>
                    <h2 className="text-xl font-bold text-content-primary dark:text-slate-50">
                      Editar Preços
                    </h2>
                    <p className="text-sm text-content-secondary dark:text-slate-400 mt-1">
                      {products.find(p => p.id === editingProductId)?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  {stores.map(store => {
                    const priceData = formData[store.id] || {
                      price: 0,
                      is_promo: false,
                      in_stock: true,
                    }

                    return (
                      <motion.div
                        key={store.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg border border-border dark:border-slate-600"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-elevated"
                            style={{ backgroundColor: store.color_hex || '#14B8A6' }}
                          >
                            {store.name.charAt(0)}
                          </div>
                          <h3 className="font-semibold text-content-primary dark:text-slate-50">
                            {store.name}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                              Preço (Kz) *
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={priceData.price || ''}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0
                                setFormData({
                                  ...formData,
                                  [store.id]: {
                                    ...priceData,
                                    price: value,
                                  },
                                })
                              }}
                              placeholder="0"
                              className="w-full px-4 py-2.5 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            />
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={priceData.is_promo || false}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    [store.id]: {
                                      ...priceData,
                                      is_promo: e.target.checked,
                                    },
                                  })
                                }}
                                className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-2"
                              />
                              <span className="text-sm text-content-primary dark:text-slate-50">
                                Em promoção
                              </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={priceData.in_stock !== false}
                                onChange={(e) => {
                                  setFormData({
                                    ...formData,
                                    [store.id]: {
                                      ...priceData,
                                      in_stock: e.target.checked,
                                    },
                                  })
                                }}
                                className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-2"
                              />
                              <span className="text-sm text-content-primary dark:text-slate-50">
                                Em estoque
                              </span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-border dark:border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors shadow-elevated"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Preços</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

