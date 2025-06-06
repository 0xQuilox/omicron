"use client"

import { Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SpecFiltersProps {
  ramFilter: string
  storageFilter: string
  batteryFilter: string
  cameraFilter: string
  screenSizeFilter: string
  processorFilter: string
  onRamChange: (value: string) => void
  onStorageChange: (value: string) => void
  onBatteryChange: (value: string) => void
  onCameraChange: (value: string) => void
  onScreenSizeChange: (value: string) => void
  onProcessorChange: (value: string) => void
  onClearFilters: () => void
}

export function SpecFilters({
  ramFilter,
  storageFilter,
  batteryFilter,
  cameraFilter,
  screenSizeFilter,
  processorFilter,
  onRamChange,
  onStorageChange,
  onBatteryChange,
  onCameraChange,
  onScreenSizeChange,
  onProcessorChange,
  onClearFilters,
}: SpecFiltersProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          Filter by Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Select value={ramFilter} onValueChange={onRamChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="RAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any RAM</SelectItem>
              <SelectItem value="4">4GB+</SelectItem>
              <SelectItem value="6">6GB+</SelectItem>
              <SelectItem value="8">8GB+</SelectItem>
              <SelectItem value="12">12GB+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={storageFilter} onValueChange={onStorageChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="Storage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Storage</SelectItem>
              <SelectItem value="64">64GB+</SelectItem>
              <SelectItem value="128">128GB+</SelectItem>
              <SelectItem value="256">256GB+</SelectItem>
              <SelectItem value="512">512GB+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={batteryFilter} onValueChange={onBatteryChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="Battery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Battery</SelectItem>
              <SelectItem value="3000">3000mAh+</SelectItem>
              <SelectItem value="4000">4000mAh+</SelectItem>
              <SelectItem value="5000">5000mAh+</SelectItem>
              <SelectItem value="6000">6000mAh+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cameraFilter} onValueChange={onCameraChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="Camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Camera</SelectItem>
              <SelectItem value="12">12MP+</SelectItem>
              <SelectItem value="48">48MP+</SelectItem>
              <SelectItem value="64">64MP+</SelectItem>
              <SelectItem value="108">108MP+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={screenSizeFilter} onValueChange={onScreenSizeChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="Screen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Size</SelectItem>
              <SelectItem value="5.5">5.5"+</SelectItem>
              <SelectItem value="6.0">6.0"+</SelectItem>
              <SelectItem value="6.5">6.5"+</SelectItem>
              <SelectItem value="7.0">7.0"+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={processorFilter} onValueChange={onProcessorChange}>
            <SelectTrigger className="border-purple-200">
              <SelectValue placeholder="Processor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Processor</SelectItem>
              <SelectItem value="snapdragon">Snapdragon</SelectItem>
              <SelectItem value="mediatek">MediaTek</SelectItem>
              <SelectItem value="exynos">Exynos</SelectItem>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="mt-3 border-purple-200 hover:bg-purple-50"
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  )
}
