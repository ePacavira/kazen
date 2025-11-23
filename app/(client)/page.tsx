'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Sempre redirecionar para login primeiro
    const isLoggedIn = localStorage.getItem('kazen-user-logged-in')
    const isAdmin = localStorage.getItem('kazen-admin-logged-in')
    
    if (isLoggedIn === 'true') {
      // Se estiver logado como cliente, mostrar a home
      router.replace('/home')
    } else if (isAdmin === 'true') {
      // Se estiver logado como admin, ir para admin
      router.replace('/admin')
    } else {
      // Se não estiver logado, ir para login (primeira página)
      router.replace('/login')
    }
  }, [router])

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
    </div>
  )
}

