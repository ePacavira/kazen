'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, User, Phone } from 'lucide-react'
import { useToast } from '@/components/toast'

export default function RegisterPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se já está logado
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    if (isLoggedIn === 'true') {
      router.push('/home')
    }
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      addToast('Por favor, preencha todos os campos', 'error')
      return
    }

    if (password !== confirmPassword) {
      addToast('As senhas não coincidem', 'error')
      return
    }

    if (password.length < 6) {
      addToast('A senha deve ter pelo menos 6 caracteres', 'error')
      return
    }

    setIsLoading(true)

    // Simular criação de conta (fake register)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Salvar dados do usuário
    localStorage.setItem('kazen-user-logged-in', 'true')
    localStorage.setItem('kazen-user-email', email)
    localStorage.setItem('kazen-user-name', name)
    localStorage.setItem('kazen-user-phone', phone)

    setIsLoading(false)
    addToast('Conta criada com sucesso!', 'success')
    
    // Redirecionar para a página inicial
    router.push('/')
  }

  if (!mounted) {
    return (
      <div className="h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center overflow-hidden">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-brand-primary/5 via-surface-ground to-brand-primary/5 dark:from-brand-primary/10 dark:via-slate-900 dark:to-brand-primary/10 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo e Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-elevated"
          >
            <span className="text-2xl font-bold text-white">K</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-content-primary dark:text-slate-50 mb-1">
            Criar Conta
          </h1>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Preencha os dados para começar
          </p>
        </motion.div>

        {/* Card de Registro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card p-5"
        >
          <form onSubmit={handleRegister} className="space-y-3">
            {/* Campo Nome */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Telefone */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+244 923 456 789"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Campos de Senha - Lado a Lado */}
            <div className="grid grid-cols-2 gap-3">
              {/* Campo Senha */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-8 py-2 text-xs bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-slate-500 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Campo Confirmar Senha */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1">
                  Confirmar
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-tertiary dark:text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-8 py-2 text-xs bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-content-tertiary dark:text-slate-500 hover:text-content-primary dark:hover:text-slate-50 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Botão de Registro */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white py-2.5 rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-brand-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <span>Criar Conta</span>
              )}
            </motion.button>
          </form>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative my-3"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-2 bg-surface-card dark:bg-slate-800 text-content-tertiary dark:text-slate-500">
                ou
              </span>
            </div>
          </motion.div>

          {/* Botão de Login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-[10px] text-content-secondary dark:text-slate-400 mb-1.5">
              Já tem uma conta?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/login')}
              className="w-full bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 py-2 rounded-xl font-semibold text-xs hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
            >
              Fazer Login
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Botão Voltar */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => router.push('/')}
          className="mt-4 flex items-center gap-2 text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 transition-colors mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-xs">Voltar ao início</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

