import { useState, useEffect, useCallback } from 'react'
import type { ShoppingListItem } from '@/lib/types'
import { mockProducts } from '@/lib/supabase'

const STORAGE_KEY = 'kazen-shopping-list'

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setShoppingList(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading shopping list:', e)
      }
    }
  }, [])

  const saveToStorage = useCallback((list: ShoppingListItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }, [])

  const addProduct = useCallback((productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (!product) return

    setShoppingList(prev => {
      const existingItem = prev.find(item => item.product_id === productId)
      let newList: ShoppingListItem[]

      if (existingItem) {
        newList = prev.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newList = [
          ...prev,
          {
            product_id: productId,
            product,
            quantity: 1,
          },
        ]
      }

      saveToStorage(newList)
      return newList
    })
  }, [saveToStorage])

  const removeProduct = useCallback((productId: string) => {
    setShoppingList(prev => {
      const newList = prev.filter(item => item.product_id !== productId)
      saveToStorage(newList)
      return newList
    })
  }, [saveToStorage])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId)
      return
    }

    setShoppingList(prev => {
      const newList = prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
      saveToStorage(newList)
      return newList
    })
  }, [removeProduct, saveToStorage])

  const clearList = useCallback(() => {
    setShoppingList([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0)

  return {
    shoppingList,
    addProduct,
    removeProduct,
    updateQuantity,
    clearList,
    totalItems,
    itemCount: shoppingList.length,
  }
}

