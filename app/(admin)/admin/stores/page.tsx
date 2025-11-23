'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Plus, Search, Edit2, Trash2, MapPin, X, Save } from 'lucide-react'
import { mockStores } from '@/lib/supabase'
import { useToast } from '@/components/toast'
import type { Store as StoreType } from '@/lib/types'

export default function StoresPage() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [stores, setStores] = useState<StoreType[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingStore, setEditingStore] = useState<StoreType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color_hex: '#14B8A6',
  })

  // Carregar lojas do localStorage ou usar mockStores
  useEffect(() => {
    const savedStores = localStorage.getItem('kazen-admin-stores')
    if (savedStores) {
      setStores(JSON.parse(savedStores))
    } else {
      setStores(mockStores)
      localStorage.setItem('kazen-admin-stores', JSON.stringify(mockStores))
    }
  }, [])

  // Salvar lojas no localStorage
  const saveStores = (newStores: StoreType[]) => {
    setStores(newStores)
    localStorage.setItem('kazen-admin-stores', JSON.stringify(newStores))
  }

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores
    
    const query = searchQuery.toLowerCase()
    return stores.filter(store => 
      store.name.toLowerCase().includes(query)
    )
  }, [stores, searchQuery])

  const handleAdd = () => {
    setEditingStore(null)
    setFormData({ name: '', color_hex: '#14B8A6' })
    setShowModal(true)
  }

  const handleEdit = (storeId: string) => {
    const store = stores.find(s => s.id === storeId)
    if (store) {
      setEditingStore(store)
      setFormData({
        name: store.name,
        color_hex: store.color_hex || '#14B8A6',
      })
      setShowModal(true)
    }
  }

  const handleDelete = (storeId: string) => {
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
      const newStores = stores.filter(s => s.id !== storeId)
      saveStores(newStores)
      addToast('Loja excluída com sucesso!', 'success')
    }
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      addToast('Preencha o nome da loja', 'error')
      return
    }

    // Validar cor hexadecimal
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!colorRegex.test(formData.color_hex)) {
      addToast('Cor inválida. Use formato hexadecimal (ex: #14B8A6)', 'error')
      return
    }

    if (editingStore) {
      // Editar loja existente
      const newStores = stores.map(s => 
        s.id === editingStore.id
          ? {
              ...s,
              name: formData.name,
              color_hex: formData.color_hex,
            }
          : s
      )
      saveStores(newStores)
      addToast('Loja atualizada com sucesso!', 'success')
    } else {
      // Adicionar nova loja
      const newStore: StoreType = {
        id: `store-${Date.now()}`,
        name: formData.name,
        color_hex: formData.color_hex,
      }
      const newStores = [...stores, newStore]
      saveStores(newStores)
      addToast('Loja adicionada com sucesso!', 'success')
    }

    setShowModal(false)
    setFormData({ name: '', color_hex: '#14B8A6' })
    setEditingStore(null)
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
              Lojas
            </h1>
            <p className="text-content-secondary dark:text-slate-400">
              Gerencie as lojas parceiras
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar lojas..."
            className="w-full pl-10 pr-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
        </div>
      </motion.div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
          >
            {/* Store Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-elevated"
                style={{ backgroundColor: store.color_hex }}
              >
                {store.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-content-primary dark:text-slate-50 mb-1">
                  {store.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-content-secondary dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Loja parceira</span>
                </div>
              </div>
            </div>

            {/* Store Info */}
            <div className="mb-4 p-3 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-content-secondary dark:text-slate-400">ID:</span>
                <span className="font-mono text-content-primary dark:text-slate-50">{store.id}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(store.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary rounded-lg font-medium hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span>Editar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(store.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-status-error/10 dark:bg-status-error/20 text-status-error rounded-lg font-medium hover:bg-status-error/20 dark:hover:bg-status-error/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Store className="w-16 h-16 text-content-tertiary dark:text-slate-500 mx-auto mb-4" />
          <p className="text-content-secondary dark:text-slate-400">
            Nenhuma loja encontrada
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
                onClick={(e) => e.stopPropagation()}
                className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-700">
                  <h2 className="text-xl font-bold text-content-primary dark:text-slate-50">
                    {editingStore ? 'Editar Loja' : 'Adicionar Loja'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Nome da Loja *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Kero Talatona"
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Cor da Loja *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.color_hex}
                        onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                        className="w-16 h-12 rounded-lg border border-border dark:border-slate-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color_hex}
                        onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })}
                        placeholder="#14B8A6"
                        className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all font-mono"
                      />
                    </div>
                    <p className="text-xs text-content-tertiary dark:text-slate-500 mt-1">
                      Escolha uma cor para identificar a loja
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-surface-hover/50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-xs text-content-secondary dark:text-slate-400 mb-2">
                      Preview:
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-elevated"
                        style={{ backgroundColor: formData.color_hex }}
                      >
                        {formData.name.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-content-primary dark:text-slate-50">
                          {formData.name || 'Nome da Loja'}
                        </p>
                        <p className="text-xs text-content-secondary dark:text-slate-400">
                          {formData.color_hex}
                        </p>
                      </div>
                    </div>
                  </div>
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

