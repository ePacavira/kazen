export interface Product {
  id: string
  name: string
  image_url: string
  category: string
  brand?: string
}

export interface Store {
  id: string
  name: string
  logo_url?: string
  color_hex?: string
}

export interface PriceSnapshot {
  id: string
  product_id: string
  store_id: string
  price: number
  is_promo: boolean
  in_stock: boolean
  product?: Product
  store?: Store
}

export interface ShoppingListItem {
  product_id: string
  product: Product
  quantity: number
  selected_store_id?: string
}

export interface ShoppingList {
  id: string
  items: ShoppingListItem[]
  total_saved: number
  created_at?: string
}

export interface StoreComparison {
  store: Store
  total: number
  items: Array<{
    product: Product
    price: number
    in_stock: boolean
  }>
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'client' | 'admin'
  created_at?: string
  last_login?: string
  is_active: boolean
}

