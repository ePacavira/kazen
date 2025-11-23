'use client'

import { Suspense } from 'react'
import CheckoutContent from './checkout-content'

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-ground dark:bg-slate-900 flex items-center justify-center">
        <p className="text-content-secondary dark:text-slate-400">Carregando...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
