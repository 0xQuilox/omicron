"use client"

import { X, Star, Cpu, Battery, Camera, Monitor, HardDrive } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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

interface PhoneComparisonModalProps {
  phones: MobilePhone[]
  isOpen: boolean
  onClose: () => void
  onRemovePhone: (index: number) => void
}

export function PhoneComparisonModal({ phones, isOpen, onClose, onRemovePhone }: PhoneComparisonModalProps) {
  const getRatingColor = (rating: string) => {
    const numRating = Number.parseFloat(rating)
    if (numRating >= 80) return "text-green-600"
    if (numRating >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Phone Comparison ({phones.length} phones)</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phones.map((phone, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => onRemovePhone(index)}
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* Phone Header */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800 pr-8">{phone.model}</h3>
                  <p className="text-purple-600 font-medium capitalize">{phone.brand_name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xl font-bold text-purple-700">{formatNairaPrice(phone.price)}</div>
                    {phone.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className={`text-sm font-medium ${getRatingColor(phone.rating)}`}>{phone.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Specifications */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                    <Monitor className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium">{phone.screen_size}" Display</div>
                      <div className="text-gray-600">{phone.resolution}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium capitalize">{phone.processor_brand}</div>
                      <div className="text-gray-600">
                        {phone.num_cores} cores, {phone.processor_speed}GHz
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded">
                    <HardDrive className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-medium">{phone.ram_capacity}GB RAM</div>
                      <div className="text-gray-600">{phone.internal_memory}GB Storage</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-pink-50 rounded">
                    <Camera className="w-4 h-4 text-pink-600" />
                    <div>
                      <div className="font-medium">{phone.primary_camera_rear}MP Rear</div>
                      <div className="text-gray-600">{phone.primary_camera_front}MP Front</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <Battery className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{phone.battery_capacity}mAh</div>
                      <div className="text-gray-600">
                        {phone.fast_charging_available === "1"
                          ? `${phone.fast_charging}W Fast Charging`
                          : "Standard Charging"}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {phone.has_5g === "True" && <Badge className="bg-blue-100 text-blue-700 text-xs">5G</Badge>}
                    {phone.has_nfc === "True" && <Badge className="bg-green-100 text-green-700 text-xs">NFC</Badge>}
                    {phone.os && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {phone.os}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
