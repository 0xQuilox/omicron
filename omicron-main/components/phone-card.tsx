"use client"

import { memo } from "react"
import { Star, Cpu, Battery, Camera, Monitor, Zap, Wifi } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatNairaPrice } from "@/lib/price-utils"

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

interface PhoneCardProps {
  phone: MobilePhone
  onViewDetails: (phone: MobilePhone) => void
  onAddToComparison: (phone: MobilePhone) => void
  onRemoveFromComparison: (index: number) => void
  comparisonPhones: MobilePhone[]
  phoneIndex: number
}

export const PhoneCard = memo(function PhoneCard({
  phone,
  onViewDetails,
  onAddToComparison,
  onRemoveFromComparison,
  comparisonPhones,
  phoneIndex,
}: PhoneCardProps) {
  const getRatingColor = (rating: string) => {
    const numRating = Number.parseFloat(rating)
    if (numRating >= 80) return "text-green-600"
    if (numRating >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const isInComparison = comparisonPhones.some((p) => p.model === phone.model)

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-purple-100 hover:border-purple-300 bg-white/70 backdrop-blur-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-gray-800 mb-1 truncate">{phone.model}</CardTitle>
            <p className="text-sm text-purple-600 font-medium capitalize truncate">{phone.brand_name}</p>
          </div>
          <div className="flex flex-col items-end gap-2 ml-2">
            {phone.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className={`text-sm font-medium ${getRatingColor(phone.rating)}`}>{phone.rating}</span>
              </div>
            )}
            <div className="flex items-center">
              <Checkbox
                checked={isInComparison}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onAddToComparison(phone)
                  } else {
                    const index = comparisonPhones.findIndex((p) => p.model === phone.model)
                    if (index > -1) onRemoveFromComparison(index)
                  }
                }}
                disabled={comparisonPhones.length >= 3 && !isInComparison}
                className="mr-2"
              />
              <span className="text-xs text-gray-500">Compare</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price - Using consistent formatting */}
        <div className="text-2xl font-bold text-purple-700">{formatNairaPrice(phone.price)}</div>

        {/* Key Features */}
        <div className="flex flex-wrap gap-2">
          {phone.has_5g === "True" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Wifi className="w-3 h-3 mr-1" />
              5G
            </Badge>
          )}
          {phone.os && (
            <Badge variant="outline" className="capitalize">
              {phone.os}
            </Badge>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-purple-500" />
            <span className="text-gray-600 truncate">{phone.screen_size}"</span>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 capitalize truncate">{phone.processor_brand}</span>
          </div>

          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 truncate">{phone.battery_capacity}mAh</span>
          </div>

          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-pink-500" />
            <span className="text-gray-600 truncate">{phone.primary_camera_rear}MP</span>
          </div>
        </div>

        {/* Memory Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">RAM:</span>
            <span className="font-medium">{phone.ram_capacity}GB</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Storage:</span>
            <span className="font-medium">{phone.internal_memory}GB</span>
          </div>
          {phone.fast_charging && phone.fast_charging !== "0" && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fast Charging:</span>
              <span className="font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                {phone.fast_charging}W
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => onViewDetails(phone)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
})
