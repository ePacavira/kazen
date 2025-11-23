'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '@/components/toast'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se já está logado como cliente
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    if (isLoggedIn === 'true') {
      router.push('/home')
      return
    }
    // Verificar se já está logado como admin
    const isAdmin = localStorage.getItem('kazen-admin-logged-in')
    if (isAdmin === 'true') {
      router.push('/admin')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      addToast('Por favor, preencha todos os campos', 'error')
      return
    }

    setIsLoading(true)

    // Simular autenticação (fake login)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Verificar credenciais de admin
    if (email === 'admin@tedak.com' && password === '1234') {
      localStorage.setItem('kazen-admin-logged-in', 'true')
      localStorage.setItem('kazen-admin-email', email)
      localStorage.removeItem('kazen-user-logged-in') // Garante que não está logado como cliente
      setIsLoading(false)
      addToast('Login admin realizado com sucesso!', 'success')
      router.push('/admin')
      return
    }

    // Verificar senhas do localStorage (usuários criados pelo admin)
    const savedPasswords = localStorage.getItem('kazen-user-passwords')
    const passwords = savedPasswords ? JSON.parse(savedPasswords) : {}
    const savedPassword = passwords[email]

    // Verificar credenciais de cliente (hardcoded ou do localStorage)
    if (email === 'cliente@tedak.com' && password === '1234') {
      localStorage.setItem('kazen-user-logged-in', 'true')
      localStorage.setItem('kazen-user-email', email)
      localStorage.removeItem('kazen-admin-logged-in') // Garante que não está logado como admin
      setIsLoading(false)
      addToast('Login realizado com sucesso!', 'success')
      router.push('/home')
      return
    }

    // Verificar se o email existe e a senha está correta
    if (savedPassword && savedPassword === password) {
      // Verificar se o usuário existe na lista de usuários
      const savedUsers = localStorage.getItem('kazen-admin-users')
      if (savedUsers) {
        const users = JSON.parse(savedUsers)
        const user = users.find((u: any) => u.email === email)
        if (user && user.is_active) {
          localStorage.setItem('kazen-user-logged-in', 'true')
          localStorage.setItem('kazen-user-email', email)
          localStorage.removeItem('kazen-admin-logged-in') // Garante que não está logado como admin
          setIsLoading(false)
          addToast('Login realizado com sucesso!', 'success')
          router.push('/home')
          return
        } else if (user && !user.is_active) {
          setIsLoading(false)
          addToast('Conta desativada. Entre em contato com o administrador.', 'error')
          return
        }
      }
    }

    // Credenciais inválidas
    setIsLoading(false)
    addToast('Email ou senha incorretos', 'error')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center">
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
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-content-secondary dark:text-slate-400">
            Entre na sua conta para continuar
          </p>
        </motion.div>

        {/* Card de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-card dark:bg-slate-800 rounded-2xl border border-border dark:border-slate-700 shadow-card p-5 sm:p-6"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Senha */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-medium text-content-primary dark:text-slate-50 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface-hover dark:bg-slate-700 border border-border dark:border-slate-600 rounded-lg text-content-primary dark:text-slate-50 placeholder:text-content-tertiary dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                  required
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
            </motion.div>

            {/* Esqueceu a senha */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-end"
            >
              <button
                type="button"
                onClick={() => addToast('Funcionalidade em breve!', 'info')}
                className="text-xs text-brand-primary hover:text-brand-primary-dark font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </motion.div>

            {/* Botão de Login */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-elevated flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}
            </motion.button>
          </form>

          {/* Divisor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="relative my-4"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface-card dark:bg-slate-800 text-content-tertiary dark:text-slate-500">
                ou
              </span>
            </div>
          </motion.div>

          {/* Botão de Cadastro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-xs text-content-secondary dark:text-slate-400 mb-2">
              Não tem uma conta?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/register')}
              className="w-full bg-surface-hover dark:bg-slate-700 text-content-primary dark:text-slate-50 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-pressed dark:hover:bg-slate-600 transition-colors"
            >
              Criar conta
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Botão Voltar */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          onClick={() => router.push('/login')}
          className="mt-4 flex items-center gap-2 text-content-secondary dark:text-slate-400 hover:text-content-primary dark:hover:text-slate-50 transition-colors mx-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-xs">Voltar ao início</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

