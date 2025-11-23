'use client'

import React, { useState } from 'react'
import { Plus, Minus, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from './toast'

interface ProductCardProps {
  product: Product
  quantity: number
  minPrice?: number
  maxPrice?: number
  hasPromo?: boolean
  onAdd: () => void
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
}

// Função para mapear nome do produto para nome do arquivo de imagem
const getProductImageFileName = (productName: string): string => {
  // Normalizar o nome do produto para corresponder ao nome do arquivo
  const nameMap: Record<string, string> = {
    'Picanha Fresca': 'picanha',
    'Frango Inteiro': 'frango_inteiro',
    'Costela de Vaca': 'costela',
    'Linguiça Toscana': 'linguiça_toscana',
    'Carne Moída': 'carne_moída',
    'Hambúrguer Artesanal': 'hamburger',
    'Espetinhos de Frango': 'espetinhos_de_frango',
    'Salsicha Premium': 'salsichas',
    'Bacon Defumado': 'bacon',
  }

  // Verificar se existe mapeamento direto
  if (nameMap[productName]) {
    return `/images/${nameMap[productName]}.png`
  }

  // Tentar gerar nome baseado no primeiro termo do produto
  const firstTerm = productName.toLowerCase().split(' ')[0]
  const normalizedName = firstTerm
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]/g, '_') // Substitui caracteres especiais por underscore

  return `/images/${normalizedName}.png`
}

// Função para gerar URL de placeholder baseada no nome do produto (fallback)
const getPlaceholderImage = (productName: string) => {
  const encodedName = encodeURIComponent(productName.split(' ')[0])
  return `https://via.placeholder.com/400x400/14B8A6/FFFFFF?text=${encodedName}`
}

export default function ProductCard({
  product,
  quantity,
  minPrice = 0,
  maxPrice = 0,
  hasPromo = false,
  onAdd,
  onRemove,
  onQuantityChange,
}: ProductCardProps) {
  const { addToast } = useToast()
  const [imageError, setImageError] = useState(false)

  const handleAdd = () => {
    onAdd()
    addToast(`${product.name} adicionado!`, 'success', 2000)
    
    // Haptic feedback (se disponível)
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleRemove = () => {
    onRemove()
    addToast(`${product.name} removido`, 'info', 2000)
  }

  const priceRange = minPrice > 0 && maxPrice > 0 && minPrice !== maxPrice
  const showPrice = minPrice > 0

  // Tentar usar imagem local primeiro, depois a URL do produto, depois placeholder
  const localImage = getProductImageFileName(product.name)
  const imageUrl = imageError
    ? getPlaceholderImage(product.name)
    : (product.image_url && !product.image_url.includes('placeholder'))
      ? product.image_url
      : localImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-card dark:bg-slate-800 rounded-lg border border-border dark:border-slate-700 shadow-card overflow-hidden hover:shadow-elevated transition-all duration-200 relative group"
    >
      {/* Promo Badge */}
      {hasPromo && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute top-1.5 left-1.5 z-10 bg-brand-accent text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg"
        >
          PROMO
        </motion.div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-surface-hover dark:bg-slate-700 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 160px, 180px"
          onError={() => {
            setImageError(true)
          }}
          unoptimized={imageUrl.includes('placeholder')}
        />
        {product.brand && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1.5 right-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium shadow-sm z-10"
          >
            <span className="text-content-primary dark:text-slate-50">
              {product.brand}
            </span>
          </motion.div>
        )}
        {quantity > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-1.5 right-1.5 bg-brand-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-xs z-10 ring-2 ring-white dark:ring-slate-800"
          >
            {quantity}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        <h3 className="font-semibold text-content-primary dark:text-slate-50 text-xs mb-1 line-clamp-2 min-h-[2rem] leading-tight">
          {product.name}
        </h3>
        <p className="text-[10px] text-content-secondary dark:text-slate-400 mb-2">
          {product.category}
        </p>

        {/* Price Display */}
        {showPrice && (
          <div className="mb-2">
            {priceRange ? (
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs font-bold text-brand-primary">
                  {formatCurrency(minPrice)}
                </span>
                <span className="text-[10px] text-content-tertiary dark:text-slate-500">-</span>
                <span className="text-[10px] text-content-secondary dark:text-slate-400 line-through">
                  {formatCurrency(maxPrice)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-brand-accent flex-shrink-0" />
                <span className="text-xs font-bold text-content-primary dark:text-slate-50 truncate">
                  {formatCurrency(minPrice)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="w-full bg-brand-primary text-white py-2 rounded-lg font-medium hover:bg-brand-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-sm text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar
            </motion.button>
          ) : (
            <motion.div
              key="quantity"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between gap-1.5"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (quantity === 1) {
                    handleRemove()
                  } else {
                    onQuantityChange(quantity - 1)
                  }
                }}
                className="p-1.5 rounded-lg bg-surface-hover dark:bg-slate-700 hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors active:scale-95"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3.5 h-3.5 text-content-primary dark:text-slate-50" />
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.2, color: '#14B8A6' }}
                animate={{ scale: 1, color: 'inherit' }}
                className="flex-1 text-center font-bold text-content-primary dark:text-slate-50 text-sm"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-1.5 rounded-lg bg-surface-hover dark:bg-slate-700 hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors active:scale-95"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3.5 h-3.5 text-content-primary dark:text-slate-50" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
