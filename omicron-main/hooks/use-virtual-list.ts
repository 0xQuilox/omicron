"use client"

import { useState, useMemo } from "react"

interface UseVirtualListOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function useVirtualList<T>(items: T[], options: UseVirtualListOptions) {
  const { itemHeight, containerHeight, overscan = 5 } = options
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
    }))
  }, [items, startIndex, endIndex])

  const totalHeight = items.length * itemHeight

  return {
    visibleItems,
    totalHeight,
    startIndex,
    setScrollTop,
  }
}
