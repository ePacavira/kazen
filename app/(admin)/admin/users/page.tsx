'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, Edit2, Trash2, Mail, Phone, UserCheck, UserX, X, Save, Shield, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/toast'
import type { User as UserType } from '@/lib/types'

const generateId = () => {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Mock de usuários iniciais
const mockUsers: UserType[] = [
  {
    id: 'user-1',
    name: 'João Silva',
    email: 'cliente@tedak.com',
    phone: '+244 923 456 789',
    role: 'client',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'user-2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+244 923 123 456',
    role: 'client',
    created_at: new Date().toISOString(),
    is_active: true,
  },
  {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@tedak.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    is_active: true,
  },
]

export default function UsersPage() {
  const { addToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<UserType[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [passwordUser, setPasswordUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client' as 'client' | 'admin',
    is_active: true,
    password: '',
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Carregar usuários do localStorage ou usar mockUsers
  useEffect(() => {
    const savedUsers = localStorage.getItem('kazen-admin-users')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      setUsers(mockUsers)
      localStorage.setItem('kazen-admin-users', JSON.stringify(mockUsers))
    }

    // Inicializar senhas padrão se não existirem
    const savedPasswords = localStorage.getItem('kazen-user-passwords')
    if (!savedPasswords) {
      const defaultPasswords: Record<string, string> = {
        'admin@tedak.com': '1234',
        'cliente@tedak.com': '1234',
      }
      localStorage.setItem('kazen-user-passwords', JSON.stringify(defaultPasswords))
    }
  }, [])

  // Salvar usuários no localStorage
  const saveUsers = (newUsers: UserType[]) => {
    setUsers(newUsers)
    localStorage.setItem('kazen-admin-users', JSON.stringify(newUsers))
  }

  const filteredUsers = useMemo(() => {
    let filtered = users

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [users, searchQuery, roleFilter])

  // Carregar senhas do localStorage
  const getPasswords = (): Record<string, string> => {
    const saved = localStorage.getItem('kazen-user-passwords')
    return saved ? JSON.parse(saved) : {}
  }

  // Salvar senhas no localStorage
  const savePasswords = (passwords: Record<string, string>) => {
    localStorage.setItem('kazen-user-passwords', JSON.stringify(passwords))
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'client',
      is_active: true,
      password: '',
    })
    setShowModal(true)
  }

  const handleEdit = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        is_active: user.is_active,
        password: '', // Não mostrar senha atual por segurança
      })
      setShowModal(true)
    }
  }

  const handleChangePassword = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setPasswordUser(user)
      setPasswordData({
        newPassword: '',
        confirmPassword: '',
      })
      setShowPasswordModal(true)
    }
  }

  const handleSavePassword = () => {
    if (!passwordUser) return

    if (!passwordData.newPassword || passwordData.newPassword.length < 4) {
      addToast('A senha deve ter pelo menos 4 caracteres!', 'error')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('As senhas não coincidem!', 'error')
      return
    }

    const passwords = getPasswords()
    passwords[passwordUser.email] = passwordData.newPassword
    savePasswords(passwords)

    addToast('Senha alterada com sucesso!', 'success')
    setShowPasswordModal(false)
    setPasswordUser(null)
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleDelete = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user && user.role === 'admin') {
      addToast('Não é possível excluir um administrador!', 'error')
      return
    }

    if (confirm('Tem certeza que deseja excluir este utilizador?')) {
      const newUsers = users.filter(u => u.id !== userId)
      saveUsers(newUsers)
      addToast('Utilizador excluído com sucesso!', 'success')
    }
  }

  const handleToggleActive = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user && user.role === 'admin') {
      addToast('Não é possível desativar um administrador!', 'error')
      return
    }

    const newUsers = users.map(u =>
      u.id === userId ? { ...u, is_active: !u.is_active } : u
    )
    saveUsers(newUsers)
    addToast(
      `Utilizador ${users.find(u => u.id === userId)?.is_active ? 'desativado' : 'ativado'} com sucesso!`,
      'success'
    )
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      addToast('Nome e Email são obrigatórios!', 'error')
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      addToast('Email inválido!', 'error')
      return
    }

    // Verificar se email já existe (exceto se estiver editando o mesmo usuário)
    const emailExists = users.some(
      u => u.email === formData.email && u.id !== editingUser?.id
    )
    if (emailExists) {
      addToast('Este email já está em uso!', 'error')
      return
    }

    if (editingUser) {
      // Editar usuário existente
      const oldEmail = editingUser.email
      const newUsers = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              phone: formData.phone || undefined,
              role: formData.role,
              is_active: formData.is_active,
            }
          : u
      )
      saveUsers(newUsers)

      // Se o email mudou, atualizar a senha também
      if (oldEmail !== formData.email) {
        const passwords = getPasswords()
        if (passwords[oldEmail]) {
          passwords[formData.email] = passwords[oldEmail]
          delete passwords[oldEmail]
          savePasswords(passwords)
        }
      }

      // Se uma nova senha foi fornecida, atualizar
      if (formData.password && formData.password.length >= 4) {
        const passwords = getPasswords()
        passwords[formData.email] = formData.password
        savePasswords(passwords)
      }

      addToast('Utilizador atualizado com sucesso!', 'success')
    } else {
      // Adicionar novo usuário
      const newUser: UserType = {
        id: generateId(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        created_at: new Date().toISOString(),
        is_active: formData.is_active,
      }
      saveUsers([...users, newUser])

      // Salvar senha padrão se fornecida
      if (formData.password && formData.password.length >= 4) {
        const passwords = getPasswords()
        passwords[formData.email] = formData.password
        savePasswords(passwords)
      } else {
        // Senha padrão se não fornecida
        const passwords = getPasswords()
        passwords[formData.email] = '1234'
        savePasswords(passwords)
      }

      addToast('Utilizador adicionado com sucesso!', 'success')
    }
    setShowModal(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'client',
      is_active: true,
      password: '',
    })
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordUser(null)
    setPasswordData({
      newPassword: '',
      confirmPassword: '',
    })
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    clients: users.filter(u => u.role === 'client').length,
    admins: users.filter(u => u.role === 'admin').length,
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
              Utilizadores
            </h1>
            <p className="text-content-secondary dark:text-slate-400">
              Gerencie os utilizadores do sistema
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-content-secondary dark:text-slate-400">Total</p>
                <p className="text-2xl font-bold text-content-primary dark:text-slate-50">
                  {stats.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-brand-primary" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-content-secondary dark:text-slate-400">Ativos</p>
                <p className="text-2xl font-bold text-status-success">
                  {stats.active}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-status-success" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-content-secondary dark:text-slate-400">Clientes</p>
                <p className="text-2xl font-bold text-content-primary dark:text-slate-50">
                  {stats.clients}
                </p>
              </div>
              <User className="w-8 h-8 text-brand-primary" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-content-secondary dark:text-slate-400">Admins</p>
                <p className="text-2xl font-bold text-status-warning">
                  {stats.admins}
                </p>
              </div>
              <Shield className="w-8 h-8 text-status-warning" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-tertiary dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar utilizadores..."
              className="w-full pl-10 pr-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-surface-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          >
            <option value="all">Todos os tipos</option>
            <option value="client">Clientes</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </motion.div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-card dark:bg-slate-800 rounded-xl border border-border dark:border-slate-700 shadow-card p-6"
          >
            {/* User Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-elevated ${
                  user.role === 'admin'
                    ? 'bg-status-warning'
                    : 'bg-brand-primary'
                }`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-content-primary dark:text-slate-50">
                    {user.name}
                  </h3>
                  {user.role === 'admin' && (
                    <Shield className="w-4 h-4 text-status-warning" />
                  )}
                </div>
                <p className="text-sm text-content-secondary dark:text-slate-400">
                  {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-content-tertiary dark:text-slate-500" />
                <span className="text-content-secondary dark:text-slate-400">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-content-tertiary dark:text-slate-500" />
                  <span className="text-content-secondary dark:text-slate-400">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {user.is_active ? (
                  <>
                    <UserCheck className="w-4 h-4 text-status-success" />
                    <span className="text-sm text-status-success">Ativo</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 text-status-error" />
                    <span className="text-sm text-status-error">Inativo</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary rounded-lg font-medium hover:bg-brand-primary/20 dark:hover:bg-brand-primary/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleActive(user.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    user.is_active
                      ? 'bg-status-error/10 dark:bg-status-error/20 text-status-error hover:bg-status-error/20 dark:hover:bg-status-error/30'
                      : 'bg-status-success/10 dark:bg-status-success/20 text-status-success hover:bg-status-success/20 dark:hover:bg-status-success/30'
                  }`}
                >
                  {user.is_active ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </motion.button>
                {user.role !== 'admin' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-2 bg-status-error/10 dark:bg-status-error/20 text-status-error rounded-lg font-medium hover:bg-status-error/20 dark:hover:bg-status-error/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChangePassword(user.id)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Alterar Senha</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-content-tertiary dark:text-slate-500 mx-auto mb-4" />
          <p className="text-content-secondary dark:text-slate-400">
            Nenhum utilizador encontrado
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
              onClick={closeModal}
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
                    {editingUser ? 'Editar Utilizador' : 'Adicionar Utilizador'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Ex: João Silva"
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Ex: joao@example.com"
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="Ex: +244 923 456 789"
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Tipo de Utilizador *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                        Senha {!editingUser && '(opcional, padrão: 1234)'}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary dark:text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleFormChange}
                          placeholder="Deixe vazio para senha padrão (1234)"
                          className="w-full pl-10 pr-10 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-slate-500 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      className="w-4 h-4 text-brand-primary rounded focus:ring-brand-primary focus:ring-2"
                    />
                    <label className="text-sm text-content-primary dark:text-slate-50">
                      Utilizador ativo
                    </label>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-slate-700">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors shadow-elevated"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Alterar Senha */}
      <AnimatePresence>
        {showPasswordModal && passwordUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePasswordModal}
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
                className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card w-full max-w-md pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-700">
                  <div>
                    <h2 className="text-xl font-bold text-content-primary dark:text-slate-50">
                      Alterar Senha
                    </h2>
                    <p className="text-sm text-content-secondary dark:text-slate-400 mt-1">
                      {passwordUser.name}
                    </p>
                  </div>
                  <button
                    onClick={closePasswordModal}
                    className="p-2 hover:bg-surface-hover dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-content-secondary dark:text-slate-400" />
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Nova Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary dark:text-slate-500" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-slate-500 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-content-primary dark:text-slate-50 mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary dark:text-slate-500" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Digite a senha novamente"
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-slate-500 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-slate-700">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closePasswordModal}
                      className="flex-1 px-4 py-2.5 bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 rounded-lg font-medium hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSavePassword}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors shadow-elevated"
                    >
                      <Save className="w-4 h-4" />
                      <span>Alterar Senha</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

