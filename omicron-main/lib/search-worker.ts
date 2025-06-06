// Web Worker for search operations
interface MobilePhone {
  brand_name: string
  model: string
  price: string
  rating: string
  has_5g: string
  has_nfc: string
  has_ir_blaster: string
  processor_brand: string
  num_cores: string
  processor_speed: string
  battery_capacity: string
  fast_charging_available: string
  fast_charging: string
  ram_capacity: number
  internal_memory: number
  screen_size: string
  refresh_rate: string
  resolution: string
  num_rear_cameras: string
  num_front_cameras: string
  os: string
  primary_camera_rear: string
  primary_camera_front: string
  extended_memory_available: string
  extended_upto: string
}

interface SearchFilters {
  searchTerm: string
  brandFilter: string
  priceFilter: string
  osFilter: string
  ramFilter: string
  storageFilter: string
  batteryFilter: string
  cameraFilter: string
  screenSizeFilter: string
  processorFilter: string
}

export class SearchEngine {
  private phones: MobilePhone[] = []
  private searchIndex: Map<string, Set<number>> = new Map()

  setPhones(phones: MobilePhone[]) {
    this.phones = phones
    this.buildSearchIndex()
  }

  private buildSearchIndex() {
    this.searchIndex.clear()

    this.phones.forEach((phone, index) => {
      // Index searchable fields
      const searchableText = [phone.model, phone.brand_name, phone.processor_brand, phone.os].join(" ").toLowerCase()

      // Create n-grams for better search
      const words = searchableText.split(" ")
      words.forEach((word) => {
        if (word.length > 0) {
          for (let i = 0; i < word.length - 1; i++) {
            const ngram = word.substring(i, i + 3)
            if (!this.searchIndex.has(ngram)) {
              this.searchIndex.set(ngram, new Set())
            }
            this.searchIndex.get(ngram)!.add(index)
          }
        }
      })
    })
  }

  search(filters: SearchFilters): MobilePhone[] {
    let candidateIndices: Set<number>

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      candidateIndices = new Set()

      // Use search index for fast text search
      for (let i = 0; i < searchTerm.length - 2; i++) {
        const ngram = searchTerm.substring(i, i + 3)
        const indices = this.searchIndex.get(ngram)
        if (indices) {
          if (candidateIndices.size === 0) {
            indices.forEach((idx) => candidateIndices.add(idx))
          } else {
            // Intersection
            candidateIndices = new Set([...candidateIndices].filter((idx) => indices.has(idx)))
          }
        }
      }
    } else {
      candidateIndices = new Set(Array.from({ length: this.phones.length }, (_, i) => i))
    }

    // Apply filters to candidates
    const results: MobilePhone[] = []

    for (const index of candidateIndices) {
      const phone = this.phones[index]
      if (this.matchesFilters(phone, filters)) {
        results.push(phone)
      }
    }

    return results
  }

  private matchesFilters(phone: MobilePhone, filters: SearchFilters): boolean {
    // Brand filter
    if (filters.brandFilter !== "all" && phone.brand_name.toLowerCase() !== filters.brandFilter.toLowerCase()) {
      return false
    }

    // OS filter
    if (filters.osFilter !== "all" && phone.os.toLowerCase() !== filters.osFilter.toLowerCase()) {
      return false
    }

    // Price filter
    const phonePrice = Number.parseFloat(phone.price)
    if (filters.priceFilter !== "all") {
      if (filters.priceFilter === "budget" && phonePrice >= 15000) return false
      if (filters.priceFilter === "mid" && (phonePrice < 15000 || phonePrice >= 30000)) return false
      if (filters.priceFilter === "premium" && phonePrice < 30000) return false
    }

    // Spec filters
    if (filters.ramFilter !== "all" && phone.ram_capacity < Number.parseFloat(filters.ramFilter)) {
      return false
    }

    if (filters.storageFilter !== "all" && phone.internal_memory < Number.parseFloat(filters.storageFilter)) {
      return false
    }

    if (
      filters.batteryFilter !== "all" &&
      Number.parseFloat(phone.battery_capacity) < Number.parseFloat(filters.batteryFilter)
    ) {
      return false
    }

    if (
      filters.cameraFilter !== "all" &&
      Number.parseFloat(phone.primary_camera_rear) < Number.parseFloat(filters.cameraFilter)
    ) {
      return false
    }

    if (
      filters.screenSizeFilter !== "all" &&
      Number.parseFloat(phone.screen_size) < Number.parseFloat(filters.screenSizeFilter)
    ) {
      return false
    }

    if (
      filters.processorFilter !== "all" &&
      !phone.processor_brand.toLowerCase().includes(filters.processorFilter.toLowerCase())
    ) {
      return false
    }

    return true
  }
}
