'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Package, Store, DollarSign, Users, TrendingUp, ShoppingCart } from 'lucide-react'
import { mockProducts, mockStores, mockPrices } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
  // Calcular estatísticas reais
  const stats = useMemo(() => {
    // Total de produtos
    const totalProducts = mockProducts.length

    // Total de lojas
    const totalStores = mockStores.length

    // Total de preços (produtos × lojas)
    const totalPrices = Object.keys(mockPrices).length * totalStores

    // Produtos em promoção
    const promoCount = Object.values(mockPrices).reduce((acc, productPrices) => {
      return acc + Object.values(productPrices).filter(p => p.is_promo).length
    }, 0)

    // Economia total estimada (diferença entre loja mais cara e mais barata)
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

    // Usuários ativos (mock - baseado em localStorage)
    const activeUsers = typeof window !== 'undefined' 
      ? localStorage.getItem('kazen-user-logged-in') === 'true' ? 1 : 0
      : 0

    // Comparações hoje (mock)
    const comparisonsToday = 0

    return [
      {
        icon: Package,
        label: 'Total de Produtos',
        value: totalProducts.toString(),
        change: `+${Math.floor(Math.random() * 5) + 1}`,
        color: 'brand-primary',
      },
      {
        icon: Store,
        label: 'Lojas Cadastradas',
        value: totalStores.toString(),
        change: `+${Math.floor(Math.random() * 2) + 1}`,
        color: 'brand-accent',
      },
      {
        icon: DollarSign,
        label: 'Preços Cadastrados',
        value: totalPrices.toString(),
        change: `+${promoCount} promo`,
        color: 'brand-secondary',
      },
      {
        icon: Users,
        label: 'Usuários Ativos',
        value: activeUsers > 0 ? activeUsers.toString() : '0',
        change: activeUsers > 0 ? 'Online' : 'Offline',
        color: 'status-success',
      },
      {
        icon: ShoppingCart,
        label: 'Comparações Hoje',
        value: comparisonsToday.toString(),
        change: '+0',
        color: 'status-info',
      },
      {
        icon: TrendingUp,
        label: 'Economia Potencial',
        value: formatCurrency(totalSavings),
        change: `${Math.floor((totalSavings / 1000))}k Kz`,
        color: 'status-warning',
      },
    ]
  }, [])
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-2">
          Dashboard
        </h1>
        <p className="text-content-secondary dark:text-slate-400">
          Visão geral do sistema Kazen
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${stat.color === 'brand-primary' ? 'bg-brand-primary/10 dark:bg-brand-primary/20' : ''}
                ${stat.color === 'brand-accent' ? 'bg-brand-accent/10 dark:bg-brand-accent/20' : ''}
                ${stat.color === 'brand-secondary' ? 'bg-brand-secondary/10 dark:bg-brand-secondary/20' : ''}
                ${stat.color === 'status-success' ? 'bg-status-success-lightest dark:bg-status-success-darkest/30' : ''}
                ${stat.color === 'status-info' ? 'bg-status-info-lightest dark:bg-status-info-darkest/30' : ''}
                ${stat.color === 'status-warning' ? 'bg-status-warning-lightest dark:bg-status-warning-darkest/30' : ''}
              `}>
                  <Icon className={`
                    w-6 h-6
                    ${stat.color === 'brand-primary' ? 'text-brand-primary' : ''}
                    ${stat.color === 'brand-accent' ? 'text-brand-accent' : ''}
                    ${stat.color === 'brand-secondary' ? 'text-brand-secondary' : ''}
                ${stat.color === 'status-success' ? 'text-status-success' : ''}
                ${stat.color === 'status-info' ? 'text-status-info' : ''}
                ${stat.color === 'status-warning' ? 'text-status-warning' : ''}
                  `} />
                </div>
                <span className="text-sm font-semibold text-status-success dark:text-status-success-light">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-content-secondary dark:text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
      >
        <h2 className="text-xl font-bold text-content-primary dark:text-slate-50 mb-4">
          Produtos em Destaque
        </h2>
        <div className="space-y-4">
          {mockProducts.slice(0, 3).map((product, index) => {
            const productPrices = mockPrices[product.id]
            const hasPromo = productPrices && Object.values(productPrices).some(p => p.is_promo)
            const storeCount = productPrices ? Object.keys(productPrices).length : 0
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  hasPromo 
                    ? 'bg-status-warning-lightest dark:bg-status-warning-darkest/30' 
                    : 'bg-brand-primary/10 dark:bg-brand-primary/20'
                }`}>
                  <Package className={`w-5 h-5 ${
                    hasPromo ? 'text-status-warning' : 'text-brand-primary'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-content-primary dark:text-slate-50">
                    {product.name}
                  </p>
                  <p className="text-sm text-content-secondary dark:text-slate-400">
                    {storeCount} loja{storeCount !== 1 ? 's' : ''} • {hasPromo ? 'Em promoção' : 'Disponível'}
                  </p>
                </div>
                {hasPromo && (
                  <span className="text-xs font-semibold text-status-warning bg-status-warning-lightest dark:bg-status-warning-darkest/30 px-2 py-1 rounded">
                    Promo
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

