'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomePage from '@/components/home-page'

export default function HomePageRoute() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está logado
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    if (isLoggedIn !== 'true') {
      router.push('/login')
    }
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  // Verificar novamente antes de renderizar
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('kazen-user-logged-in') === 'true'
  
  if (!isLoggedIn) {
    return null // Será redirecionado pelo useEffect
  }

  return <HomePage />
}

