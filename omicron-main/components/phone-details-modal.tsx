"use client"

import { Star, Cpu, Battery, Camera, Monitor, Zap, Wifi, HardDrive, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatNairaPrice } from "@/lib/price-utils"
import { PriceTracker } from "./price-tracker"

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

interface PhoneDetailsModalProps {
  phone: MobilePhone | null
  isOpen: boolean
  onClose: () => void
}

export function PhoneDetailsModal({ phone, isOpen, onClose }: PhoneDetailsModalProps) {
  if (!phone) return null

  const getRatingColor = (rating: string) => {
    const numRating = Number.parseFloat(rating)
    if (numRating >= 80) return "text-green-600 bg-green-50"
    if (numRating >= 70) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{phone.model}</h2>
              <p className="text-lg text-purple-600 font-medium capitalize">{phone.brand_name}</p>
            </div>
            {phone.rating && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getRatingColor(phone.rating)}`}>
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">{phone.rating}/100</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Key Features */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-3xl font-bold text-purple-700">{formatNairaPrice(phone.price)}</div>
            <div className="flex flex-wrap gap-2">
              {phone.has_5g === "True" && (
                <Badge className="bg-blue-100 text-blue-700">
                  <Wifi className="w-3 h-3 mr-1" />
                  5G Ready
                </Badge>
              )}
              {phone.has_nfc === "True" && (
                <Badge className="bg-green-100 text-green-700">
                  <Zap className="w-3 h-3 mr-1" />
                  NFC
                </Badge>
              )}
              {phone.has_ir_blaster === "True" && (
                <Badge className="bg-purple-100 text-purple-700">
                  <Shield className="w-3 h-3 mr-1" />
                  IR Blaster
                </Badge>
              )}
              {phone.os && (
                <Badge variant="outline" className="capitalize">
                  {phone.os}
                </Badge>
              )}
            </div>
          </div>

          {/* Price Tracker */}
          <PriceTracker currentPrice={phone.price} phone={phone.model} />

          <Separator />

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-600" />
                Display
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Screen Size:</span>
                  <span className="font-medium">{phone.screen_size}"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span className="font-medium">{phone.resolution || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Refresh Rate:</span>
                  <span className="font-medium">{phone.refresh_rate}Hz</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processor:</span>
                  <span className="font-medium capitalize">{phone.processor_brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cores:</span>
                  <span className="font-medium">{phone.num_cores}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clock Speed:</span>
                  <span className="font-medium">{phone.processor_speed}GHz</span>
                </div>
              </div>
            </div>

            {/* Memory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                Memory & Storage
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">RAM:</span>
                  <span className="font-medium">{phone.ram_capacity}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Internal Storage:</span>
                  <span className="font-medium">{phone.internal_memory}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expandable:</span>
                  <span className="font-medium">
                    {phone.extended_memory_available === "1" ? `Up to ${phone.extended_upto}GB` : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Camera */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5 text-pink-600" />
                Camera
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rear Camera:</span>
                  <span className="font-medium">{phone.primary_camera_rear}MP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Front Camera:</span>
                  <span className="font-medium">{phone.primary_camera_front}MP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rear Cameras:</span>
                  <span className="font-medium">{phone.num_rear_cameras}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Front Cameras:</span>
                  <span className="font-medium">{phone.num_front_cameras}</span>
                </div>
              </div>
            </div>

            {/* Battery */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Battery className="w-5 h-5 text-green-600" />
                Battery
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{phone.battery_capacity}mAh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fast Charging:</span>
                  <span className="font-medium">
                    {phone.fast_charging_available === "1" ? `${phone.fast_charging}W` : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Connectivity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wifi className="w-5 h-5 text-cyan-600" />
                Connectivity
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">5G Support:</span>
                  <span className="font-medium">{phone.has_5g === "True" ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NFC:</span>
                  <span className="font-medium">{phone.has_nfc === "True" ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IR Blaster:</span>
                  <span className="font-medium">{phone.has_ir_blaster === "True" ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Compare with Others
            </Button>
            <Button variant="outline" className="flex-1 border-purple-200 hover:bg-purple-50">
              Add to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
