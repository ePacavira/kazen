import { createClient } from '@supabase/supabase-js'
import type { Product, Store } from './types'

// Para o MVP, vamos usar dados mockados
// Em produção, substituir por variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

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

// Função para gerar URL de imagem (local ou placeholder)
const getProductImage = (productName: string, productId: string) => {
  // Tentar usar imagem local primeiro
  const localImage = getProductImageFileName(productName)
  
  // Retornar caminho local (Next.js vai servir de /public)
  return localImage
}

// Mock data para a demo
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Picanha Fresca',
    image_url: getProductImage('Picanha', '1'),
    category: 'Churrasco',
    brand: 'Premium',
  },
  {
    id: '2',
    name: 'Frango Inteiro',
    image_url: getProductImage('Frango', '2'),
    category: 'Churrasco',
    brand: 'Natural',
  },
  {
    id: '3',
    name: 'Costela de Vaca',
    image_url: getProductImage('Costela', '3'),
    category: 'Churrasco',
    brand: 'Premium',
  },
  {
    id: '4',
    name: 'Linguiça Toscana',
    image_url: getProductImage('Linguiça', '4'),
    category: 'Churrasco',
    brand: 'Tradicional',
  },
  {
    id: '5',
    name: 'Carne Moída',
    image_url: getProductImage('Carne', '5'),
    category: 'Churrasco',
    brand: 'Premium',
  },
  {
    id: '6',
    name: 'Hambúrguer Artesanal',
    image_url: getProductImage('Hambúrguer', '6'),
    category: 'Churrasco',
    brand: 'Gourmet',
  },
  {
    id: '7',
    name: 'Espetinhos de Frango',
    image_url: getProductImage('Espetinhos', '7'),
    category: 'Churrasco',
    brand: 'Natural',
  },
  {
    id: '8',
    name: 'Salsicha Premium',
    image_url: getProductImage('Salsicha', '8'),
    category: 'Churrasco',
    brand: 'Tradicional',
  },
  {
    id: '9',
    name: 'Bacon Defumado',
    image_url: getProductImage('Bacon', '9'),
    category: 'Churrasco',
    brand: 'Premium',
  },
  {
    id: '10',
    name: 'Alcatra',
    image_url: getProductImage('Alcatra', '10'),
    category: 'Churrasco',
    brand: 'Premium',
  },
]

export const mockStores: Store[] = [
  {
    id: 'store-1',
    name: 'Kero Talatona',
    logo_url: '/images/stores/kero.png',
    color_hex: '#14B8A6',
  },
  {
    id: 'store-2',
    name: 'Shoprite',
    logo_url: '/images/stores/shoprite.png',
    color_hex: '#EF4444',
  },
  {
    id: 'store-3',
    name: 'Continente',
    logo_url: '/images/stores/continente.png',
    color_hex: '#3B82F6',
  },
]

// Preços mockados - Loja 1 sempre mais barata para demo
export const mockPrices: Record<string, Record<string, { price: number; is_promo: boolean; in_stock: boolean }>> = {
  '1': {
    'store-1': { price: 8500, is_promo: true, in_stock: true },
    'store-2': { price: 12000, is_promo: false, in_stock: true },
    'store-3': { price: 10500, is_promo: false, in_stock: true },
  },
  '2': {
    'store-1': { price: 3200, is_promo: false, in_stock: true },
    'store-2': { price: 4500, is_promo: false, in_stock: true },
    'store-3': { price: 3800, is_promo: false, in_stock: true },
  },
  '3': {
    'store-1': { price: 6800, is_promo: true, in_stock: true },
    'store-2': { price: 9500, is_promo: false, in_stock: true },
    'store-3': { price: 8200, is_promo: false, in_stock: true },
  },
  '4': {
    'store-1': { price: 1800, is_promo: false, in_stock: true },
    'store-2': { price: 2500, is_promo: false, in_stock: true },
    'store-3': { price: 2200, is_promo: false, in_stock: true },
  },
  '5': {
    'store-1': { price: 4200, is_promo: false, in_stock: true },
    'store-2': { price: 5800, is_promo: false, in_stock: true },
    'store-3': { price: 5000, is_promo: false, in_stock: true },
  },
  '6': {
    'store-1': { price: 1500, is_promo: true, in_stock: true },
    'store-2': { price: 2200, is_promo: false, in_stock: true },
    'store-3': { price: 1900, is_promo: false, in_stock: true },
  },
  '7': {
    'store-1': { price: 2800, is_promo: false, in_stock: true },
    'store-2': { price: 3800, is_promo: false, in_stock: true },
    'store-3': { price: 3200, is_promo: false, in_stock: true },
  },
  '8': {
    'store-1': { price: 1200, is_promo: false, in_stock: true },
    'store-2': { price: 1800, is_promo: false, in_stock: true },
    'store-3': { price: 1500, is_promo: false, in_stock: true },
  },
  '9': {
    'store-1': { price: 5500, is_promo: true, in_stock: true },
    'store-2': { price: 7500, is_promo: false, in_stock: true },
    'store-3': { price: 6500, is_promo: false, in_stock: true },
  },
  '10': {
    'store-1': { price: 7200, is_promo: false, in_stock: true },
    'store-2': { price: 9800, is_promo: false, in_stock: true },
    'store-3': { price: 8500, is_promo: false, in_stock: true },
  },
}
