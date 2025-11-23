'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Save } from 'lucide-react'
import { mockProducts } from '@/lib/supabase'
import { useToast } from '@/components/toast'
import Image from 'next/image'
import type { Product } from '@/lib/types'

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

const getProductImage = (productName: string, productId: string) => {
  // Usar imagem local primeiro
  return getProductImageFileName(productName)
}

export default function ProductsPage() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
  })
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newBrand, setNewBrand] = useState('')

  // Carregar produtos, categorias e marcas do localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('kazen-admin-products')
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts)
      setProducts(parsedProducts)
      
      // Extrair categorias e marcas únicas dos produtos
      const uniqueCategories = Array.from(new Set(parsedProducts.map((p: Product) => p.category).filter(Boolean)))
      const uniqueBrands = Array.from(new Set(parsedProducts.map((p: Product) => p.brand).filter(Boolean)))
      
      setCategories(uniqueCategories as string[])
      setBrands(uniqueBrands as string[])
    } else {
      setProducts(mockProducts)
      localStorage.setItem('kazen-admin-products', JSON.stringify(mockProducts))
      
      // Extrair categorias e marcas dos mockProducts
      const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category).filter(Boolean)))
      const uniqueBrands = Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean)))
      
      setCategories(uniqueCategories as string[])
      setBrands(uniqueBrands as string[])
    }

    // Carregar categorias e marcas salvas separadamente
    const savedCategories = localStorage.getItem('kazen-admin-categories')
    const savedBrands = localStorage.getItem('kazen-admin-brands')
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    if (savedBrands) {
      setBrands(JSON.parse(savedBrands))
    }
  }, [])

  // Salvar produtos no localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem('kazen-admin-products', JSON.stringify(newProducts))
  }

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    
    const query = searchQuery.toLowerCase()
    return products.filter((product: Product) => 
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query))
    )
  }, [products, searchQuery])

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({ name: '', category: '', brand: '' })
    setShowAddCategory(false)
    setShowAddBrand(false)
    setNewCategory('')
    setNewBrand('')
    setShowModal(true)
  }

  const handleEdit = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId)
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        brand: product.brand || '',
      })
      setShowAddCategory(false)
      setShowAddBrand(false)
      setNewCategory('')
      setNewBrand('')
      setShowModal(true)
    }
  }

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      const newProducts = products.filter((p: Product) => p.id !== productId)
      saveProducts(newProducts)
      addToast('Produto excluído com sucesso!', 'success')
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      addToast('Digite o nome da categoria', 'error')
      return
    }
    
    if (categories.includes(newCategory.trim())) {
      addToast('Esta categoria já existe', 'error')
      return
    }

    const updatedCategories = [...categories, newCategory.trim()]
    setCategories(updatedCategories)
    localStorage.setItem('kazen-admin-categories', JSON.stringify(updatedCategories))
    setFormData({ ...formData, category: newCategory.trim() })
    setNewCategory('')
    setShowAddCategory(false)
    addToast('Categoria adicionada!', 'success')
  }

  const handleAddBrand = () => {
    if (!newBrand.trim()) {
      addToast('Digite o nome da marca', 'error')
      return
    }
    
    if (brands.includes(newBrand.trim())) {
      addToast('Esta marca já existe', 'error')
      return
    }

    const updatedBrands = [...brands, newBrand.trim()]
    setBrands(updatedBrands)
    localStorage.setItem('kazen-admin-brands', JSON.stringify(updatedBrands))
    setFormData({ ...formData, brand: newBrand.trim() })
    setNewBrand('')
    setShowAddBrand(false)
    addToast('Marca adicionada!', 'success')
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      addToast('Preencha pelo menos nome e categoria', 'error')
      return
    }

    if (editingProduct) {
      // Editar produto existente
      const newProducts = products.map((p: Product) => 
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              brand: formData.brand || undefined,
              image_url: getProductImage(formData.name, editingProduct.id),
            }
          : p
      )
      saveProducts(newProducts)
      addToast('Produto atualizado com sucesso!', 'success')
    } else {
      // Adicionar novo produto
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        image_url: getProductImage(formData.name, Date.now().toString()),
      }
      const newProducts = [...products, newProduct]
      saveProducts(newProducts)
      addToast('Produto adicionado com sucesso!', 'success')
    }

    setShowModal(false)
    setFormData({ name: '', category: '', brand: '' })
    setEditingProduct(null)
    setShowAddCategory(false)
    setShowAddBrand(false)
    setNewCategory('')
    setNewBrand('')
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-content-primary dark:text-slate-50 mb-2">
              Produtos
            </h1>
            <p className="text-content-secondary dark:text-slate-400">
              Gerencie o catálogo de produtos
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-brand-primary-dark transition-colors shadow-elevated"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative w-full h-48 bg-surface-hover dark:bg-slate-700">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-surface-hover/80 dark:bg-slate-700/80">
                <ImageIcon className="w-12 h-12 text-content-tertiary dark:text-slate-500" />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-content-primary dark:text-slate-50 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-content-secondary dark:text-slate-400">
                  <span>{product.category}</span>
                  {product.brand && (
                    <>
                      <span>•</span>
                      <span>{product.brand}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(product.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary rounded-lg font-medium hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-status-error/10 dark:bg-status-error/20 text-status-error rounded-lg font-medium hover:bg-status-error/20 dark:hover:bg-status-error/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-content-tertiary dark:text-slate-500 mx-auto mb-4" />
          <p className="text-content-secondary dark:text-slate-400">
            Nenhum produto encontrado
          </p>
        </motion.div>
      )}

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {showModal && (
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
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-700">
                  <h2 className="text-xl font-bold text-content-primary dark:text-slate-50">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setShowAddCategory(false)
                      setShowAddBrand(false)
                      setNewCategory('')
                      setNewBrand('')
                    }}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Picanha Fresca"
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Categoria *
                    </label>
                    <div className="space-y-2">
                      <select
                        value={formData.category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          if (e.target.value === '__add_new__') {
                            setShowAddCategory(true)
                          } else {
                            setFormData({ ...formData, category: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((cat: string) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__add_new__">+ Adicionar nova categoria</option>
                      </select>
                      {showAddCategory && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                handleAddCategory()
                              } else if (e.key === 'Escape') {
                                setShowAddCategory(false)
                                setNewCategory('')
                              }
                            }}
                            placeholder="Nome da nova categoria"
                            autoFocus
                            className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddCategory}
                            className="px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddCategory(false)
                              setNewCategory('')
                            }}
                            className="px-4 py-2.5 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Marca (opcional)
                    </label>
                    <div className="space-y-2">
                      <select
                        value={formData.brand}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          if (e.target.value === '__add_new__') {
                            setShowAddBrand(true)
                          } else {
                            setFormData({ ...formData, brand: e.target.value })
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      >
                        <option value="">Sem marca</option>
                        {brands.map((brand: string) => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                        <option value="__add_new__">+ Adicionar nova marca</option>
                      </select>
                      {showAddBrand && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={newBrand}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBrand(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                handleAddBrand()
                              } else if (e.key === 'Escape') {
                                setShowAddBrand(false)
                                setNewBrand('')
                              }
                            }}
                            placeholder="Nome da nova marca"
                            autoFocus
                            className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddBrand}
                            className="px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddBrand(false)
                              setNewBrand('')
                            }}
                            className="px-4 py-2.5 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-border dark:border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowModal(false)
                      setShowAddCategory(false)
                      setShowAddBrand(false)
                      setNewCategory('')
                      setNewBrand('')
                    }}
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
                    <span>Salvar</span>
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

