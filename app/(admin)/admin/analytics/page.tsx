'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Store, Tag } from 'lucide-react'
import { mockProducts, mockStores, mockPrices } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export default function AnalyticsPage() {
  const analytics = useMemo(() => {
    // Calcular estatísticas
    const totalProducts = mockProducts.length
    const totalStores = mockStores.length
    const totalPrices = Object.keys(mockPrices).length * totalStores

    // Produtos em promoção
    const promoCount = Object.values(mockPrices).reduce((acc, productPrices) => {
      return acc + Object.values(productPrices).filter(p => p.is_promo).length
    }, 0)

    // Preço médio por produto
    const avgPrices = Object.keys(mockPrices).map(productId => {
      const prices = Object.values(mockPrices[productId])
        .filter(p => p.in_stock)
        .map(p => p.price)
      return prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
    })
    const overallAvgPrice = avgPrices.length > 0 
      ? avgPrices.reduce((a, b) => a + b, 0) / avgPrices.length 
      : 0

    // Economia total potencial
    let totalSavings = 0
    Object.keys(mockPrices).forEach(productId => {
      const prices = Object.values(mockPrices[productId])
        .filter(p => p.in_stock)
        .map(p => p.price)
      
      if (prices.length > 1) {
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        totalSavings += maxPrice - minPrice
      }
    })

    // Produtos mais caros e mais baratos
    const productPriceRanges = Object.keys(mockPrices).map(productId => {
      const product = mockProducts.find(p => p.id === productId)
      const prices = Object.values(mockPrices[productId])
        .filter(p => p.in_stock)
        .map(p => p.price)
      
      if (prices.length === 0) return null
      
      return {
        product: product?.name || 'Desconhecido',
        min: Math.min(...prices),
        max: Math.max(...prices),
        diff: Math.max(...prices) - Math.min(...prices),
      }
    }).filter(Boolean).sort((a, b) => (b?.diff || 0) - (a?.diff || 0))

    return {
      totalProducts,
      totalStores,
      totalPrices,
      promoCount,
      overallAvgPrice,
      totalSavings,
      topSavings: productPriceRanges.slice(0, 5),
    }
  }, [])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-2">
          Analytics
        </h1>
        <p className="text-content-secondary dark:text-slate-400">
          Análise e estatísticas do sistema
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-brand-primary" />
            </div>
            <TrendingUp className="w-5 h-5 text-status-success" />
          </div>
          <p className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
            {analytics.totalProducts}
          </p>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Total de Produtos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-brand-accent" />
            </div>
            <TrendingUp className="w-5 h-5 text-status-success" />
          </div>
          <p className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
            {analytics.totalStores}
          </p>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Lojas Parceiras
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-status-warning-lightest dark:bg-status-warning-darkest/30 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-status-warning" />
            </div>
            <TrendingUp className="w-5 h-5 text-status-success" />
          </div>
          <p className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
            {analytics.promoCount}
          </p>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Produtos em Promoção
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-status-success-lightest dark:bg-status-success-darkest/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-status-success" />
            </div>
            <TrendingUp className="w-5 h-5 text-status-success" />
          </div>
          <p className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
            {formatCurrency(analytics.totalSavings)}
          </p>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Economia Potencial
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Average Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <h2 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-4">
            Preço Médio
          </h2>
          <div className="flex items-end gap-2 h-32">
            <div className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-brand-primary to-brand-primary-dark rounded-t-lg mb-2"
                style={{ height: '60%' }}
              />
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50">
                {formatCurrency(analytics.overallAvgPrice)}
              </p>
              <p className="text-xs text-content-secondary dark:text-slate-400 mt-1">
                Média geral
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
        >
          <h2 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-4">
            Maiores Economias Potenciais
          </h2>
          <div className="space-y-3">
            {analytics.topSavings.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-content-primary dark:text-slate-50 text-sm">
                    {item?.product}
                  </p>
                  <p className="text-xs text-content-secondary dark:text-slate-400">
                    Diferença: {formatCurrency(item?.diff || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-content-secondary dark:text-slate-400">
                    Min: {formatCurrency(item?.min || 0)}
                  </p>
                  <p className="text-xs text-content-secondary dark:text-slate-400">
                    Max: {formatCurrency(item?.max || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

