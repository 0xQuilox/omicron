"use client"

import { memo, useRef, useEffect, useState } from "react"
import { Search, TrendingUp, Smartphone } from "lucide-react"
import { PhoneCard } from "./phone-card"

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

interface SearchResultsProps {
  phones: MobilePhone[]
  isSearching: boolean
  onViewDetails: (phone: MobilePhone) => void
  onAddToComparison: (phone: MobilePhone) => void
  onRemoveFromComparison: (index: number) => void
  comparisonPhones: MobilePhone[]
  loading?: boolean
}

export const SearchResults = memo(function SearchResults({
  phones,
  isSearching,
  onViewDetails,
  onAddToComparison,
  onRemoveFromComparison,
  comparisonPhones,
  loading = false,
}: SearchResultsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visiblePhones, setVisiblePhones] = useState<MobilePhone[]>([])
  const [page, setPage] = useState(1)
  const PHONES_PER_PAGE = 12

  // Reset pagination when phones change
  useEffect(() => {
    setPage(1)
    setVisiblePhones(phones.slice(0, PHONES_PER_PAGE))
  }, [phones])

  // Load more phones when scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // Load more phones
        const nextPage = page + 1
        const startIndex = (nextPage - 1) * PHONES_PER_PAGE
        const endIndex = startIndex + PHONES_PER_PAGE
        const newPhones = phones.slice(startIndex, endIndex)

        if (newPhones.length > 0) {
          setVisiblePhones((prev) => [...prev, ...newPhones])
          setPage(nextPage)
        }
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [phones, page])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">Searching phones...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {isSearching ? (
              <>
                <Search className="w-6 h-6 text-purple-600" />
                Search Results
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Top Rated Phones
              </>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            {isSearching
              ? `Found ${phones.length} phone${phones.length !== 1 ? "s" : ""}`
              : `Discover ${phones.length} highly-rated smartphones`}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="max-h-[80vh] overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePhones.map((phone, index) => (
            <PhoneCard
              key={`${phone.model}-${index}`}
              phone={phone}
              onViewDetails={onViewDetails}
              onAddToComparison={onAddToComparison}
              onRemoveFromComparison={onRemoveFromComparison}
              comparisonPhones={comparisonPhones}
              phoneIndex={index}
            />
          ))}
        </div>

        {visiblePhones.length < phones.length && (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-500">Loading more phones...</div>
          </div>
        )}
      </div>

      {phones.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No phones found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  )
})
