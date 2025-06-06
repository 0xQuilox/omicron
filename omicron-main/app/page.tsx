"use client"

import { useState, useEffect, useMemo, useCallback, useTransition } from "react"
import { Search, Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhoneDetailsModal } from "@/components/phone-details-modal"
import { PhoneComparisonModal } from "@/components/phone-comparison-modal"
import { SpecFilters } from "@/components/spec-filters"
import { SearchResults } from "@/components/search-results"
import { useDebounce } from "@/hooks/use-debounce"
import { SearchEngine } from "@/lib/search-worker"
import { NAIRA_CONVERSION_RATE } from "@/lib/price-utils"

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
  Brand?: string
  Model?: string
  Price?: string
  Rating?: string
  RAM?: string
  Storage?: string
  Display?: string
  Camera?: string
  Battery?: string
  OS?: string
}

export default function MobilePhoneSearch() {
  const [allPhones, setAllPhones] = useState<MobilePhone[]>([])
  const [displayedPhones, setDisplayedPhones] = useState<MobilePhone[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [brandFilter, setBrandFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [osFilter, setOsFilter] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<MobilePhone | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Comparison state
  const [comparisonPhones, setComparisonPhones] = useState<MobilePhone[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Spec filters
  const [ramFilter, setRamFilter] = useState("all")
  const [storageFilter, setStorageFilter] = useState("all")
  const [batteryFilter, setBatteryFilter] = useState("all")
  const [cameraFilter, setCameraFilter] = useState("all")
  const [screenSizeFilter, setScreenSizeFilter] = useState("all")
  const [processorFilter, setProcessorFilter] = useState("all")

  // Search engine instance
  const [searchEngine] = useState(() => new SearchEngine())

  // Debounced search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    fetchPhoneData()
  }, [])

  // Initialize search engine when phones are loaded
  useEffect(() => {
    if (allPhones.length > 0) {
      searchEngine.setPhones(allPhones)
    }
  }, [allPhones, searchEngine])

  // Memoized unique brands for better performance
  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(allPhones.map((phone) => phone.brand_name))).sort()
  }, [allPhones])

  // Optimized filtering with search engine
  const filteredPhones = useMemo(() => {
    if (allPhones.length === 0) return []

    const filters = {
      searchTerm: debouncedSearchTerm,
      brandFilter,
      priceFilter,
      osFilter,
      ramFilter,
      storageFilter,
      batteryFilter,
      cameraFilter,
      screenSizeFilter,
      processorFilter,
    }

    return searchEngine.search(filters)
  }, [
    allPhones,
    debouncedSearchTerm,
    brandFilter,
    priceFilter,
    osFilter,
    ramFilter,
    storageFilter,
    batteryFilter,
    cameraFilter,
    screenSizeFilter,
    processorFilter,
    searchEngine,
  ])

  // Update displayed phones with transition for smooth UI
  useEffect(() => {
    const hasFilters =
      debouncedSearchTerm ||
      brandFilter !== "all" ||
      priceFilter !== "all" ||
      osFilter !== "all" ||
      ramFilter !== "all" ||
      storageFilter !== "all" ||
      batteryFilter !== "all" ||
      cameraFilter !== "all" ||
      screenSizeFilter !== "all" ||
      processorFilter !== "all"

    startTransition(() => {
      if (hasFilters) {
        setIsSearching(true)
        setDisplayedPhones(filteredPhones)
      } else {
        setIsSearching(false)
        // Show top-rated phones on homepage
        const topRated = allPhones
          .filter((phone) => Number.parseFloat(phone.rating) >= 75)
          .sort((a, b) => Number.parseFloat(b.rating) - Number.parseFloat(a.rating))
          .slice(0, 24)
        setDisplayedPhones(topRated)
      }
    })
  }, [
    filteredPhones,
    allPhones,
    debouncedSearchTerm,
    brandFilter,
    priceFilter,
    osFilter,
    ramFilter,
    storageFilter,
    batteryFilter,
    cameraFilter,
    screenSizeFilter,
    processorFilter,
  ])

  const fetchPhoneData = useCallback(async () => {
    try {
      const datasets = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mobile%20Phone%20Data%203-GIQKtOJIyR1v3JgQU4dLdYiBkSswzk.csv",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mobile%20Phone%20Data%200-zcXCxRj82bhzNJSlMV1WfBF6WQ0nTS.csv",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dataset-PSTJzT1rc1YJYSxlEkzGQWtkvQV89L.csv",
      ]

      // Fetch datasets in parallel for better performance
      const promises = datasets.map(async (datasetUrl) => {
        try {
          const response = await fetch(datasetUrl)
          const csvText = await response.text()
          return parseCSV(csvText)
        } catch (error) {
          console.error(`Error fetching dataset ${datasetUrl}:`, error)
          return []
        }
      })

      const results = await Promise.all(promises)
      const allPhonesData = results.flat()

      // Remove duplicates based on model name
      const uniquePhones = allPhonesData.filter(
        (phone, index, self) => index === self.findIndex((p) => p.model === phone.model),
      )

      setAllPhones(uniquePhones)
    } catch (error) {
      console.error("Error fetching phone data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const parseCSV = useCallback((csvText: string): MobilePhone[] => {
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
        const phone: any = {}

        headers.forEach((header, index) => {
          phone[header] = values[index] || ""
        })

        // Normalize different field names across datasets
        if (phone.Brand && !phone.brand_name) phone.brand_name = phone.Brand
        if (phone.Model && !phone.model) phone.model = phone.Model
        if (phone.Price && !phone.price) phone.price = phone.Price
        if (phone.Rating && !phone.rating) phone.rating = phone.Rating
        if (phone.RAM && !phone.ram_capacity) phone.ram_capacity = phone.RAM
        if (phone.Storage && !phone.internal_memory) phone.internal_memory = phone.Storage
        if (phone.Display && !phone.screen_size) phone.screen_size = phone.Display
        if (phone.Camera && !phone.primary_camera_rear) phone.primary_camera_rear = phone.Camera
        if (phone.Battery && !phone.battery_capacity) phone.battery_capacity = phone.Battery
        if (phone.OS && !phone.os) phone.os = phone.OS

        return phone as MobilePhone
      })
      .filter((phone) => phone.model && phone.brand_name) // Filter out invalid entries
  }, [])

  const handleViewDetails = useCallback((phone: MobilePhone) => {
    setSelectedPhone(phone)
    setIsModalOpen(true)
  }, [])

  const handleAddToComparison = useCallback(
    (phone: MobilePhone) => {
      if (comparisonPhones.length < 3 && !comparisonPhones.find((p) => p.model === phone.model)) {
        setComparisonPhones((prev) => [...prev, phone])
      }
    },
    [comparisonPhones],
  )

  const handleRemoveFromComparison = useCallback((index: number) => {
    setComparisonPhones((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    setBrandFilter("all")
    setPriceFilter("all")
    setOsFilter("all")
    setRamFilter("all")
    setStorageFilter("all")
    setBatteryFilter("all")
    setCameraFilter("all")
    setScreenSizeFilter("all")
    setProcessorFilter("all")
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <header className="bg-white/80 backdrop-blur-md border-b border-purple-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Omicron
              </h1>
            </div>
            <p className="text-gray-600 text-center mt-2">Discover the Perfect Mobile Phone</p>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading phone database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Smartphone className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Omicron
              </h1>
            </div>

            {comparisonPhones.length > 0 && (
              <Button
                onClick={() => setIsComparisonOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Compare ({comparisonPhones.length})
              </Button>
            )}
          </div>
          <p className="text-gray-600 text-center mb-6">Discover the Perfect Mobile Phone</p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search phones by brand or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-32 border-purple-200">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-32 border-purple-200">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">
                    Budget (&lt;₦{(15000 * NAIRA_CONVERSION_RATE).toLocaleString()})
                  </SelectItem>
                  <SelectItem value="mid">
                    Mid-range (₦{(15000 * NAIRA_CONVERSION_RATE).toLocaleString()}-
                    {(30000 * NAIRA_CONVERSION_RATE).toLocaleString()})
                  </SelectItem>
                  <SelectItem value="premium">
                    Premium (&gt;₦{(30000 * NAIRA_CONVERSION_RATE).toLocaleString()})
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={osFilter} onValueChange={setOsFilter}>
                <SelectTrigger className="w-32 border-purple-200">
                  <SelectValue placeholder="OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <SpecFilters
          ramFilter={ramFilter}
          storageFilter={storageFilter}
          batteryFilter={batteryFilter}
          cameraFilter={cameraFilter}
          screenSizeFilter={screenSizeFilter}
          processorFilter={processorFilter}
          onRamChange={setRamFilter}
          onStorageChange={setStorageFilter}
          onBatteryChange={setBatteryFilter}
          onCameraChange={setCameraFilter}
          onScreenSizeChange={setScreenSizeFilter}
          onProcessorChange={setProcessorFilter}
          onClearFilters={clearAllFilters}
        />
      </div>

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <SearchResults
          phones={displayedPhones}
          isSearching={isSearching}
          onViewDetails={handleViewDetails}
          onAddToComparison={handleAddToComparison}
          onRemoveFromComparison={handleRemoveFromComparison}
          comparisonPhones={comparisonPhones}
          loading={isPending}
        />
      </main>

      <PhoneDetailsModal phone={selectedPhone} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PhoneComparisonModal
        phones={comparisonPhones}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onRemovePhone={handleRemoveFromComparison}
      />
    </div>
  )
}
