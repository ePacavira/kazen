import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-ground flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-content-primary mb-4">404</h1>
        <p className="text-content-secondary mb-6">Página não encontrada</p>
        <Link
          href="/"
          className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-dark transition-colors inline-block"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  )
}

