"use client"

import { memo, useCallback } from "react"
import { FixedSizeGrid as Grid } from "react-window"
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

interface VirtualPhoneGridProps {
  phones: MobilePhone[]
  onViewDetails: (phone: MobilePhone) => void
  onAddToComparison: (phone: MobilePhone) => void
  onRemoveFromComparison: (index: number) => void
  comparisonPhones: MobilePhone[]
  containerWidth: number
  containerHeight: number
}

const CARD_WIDTH = 350
const CARD_HEIGHT = 450
const GAP = 24

export const VirtualPhoneGrid = memo(function VirtualPhoneGrid({
  phones,
  onViewDetails,
  onAddToComparison,
  onRemoveFromComparison,
  comparisonPhones,
  containerWidth,
  containerHeight,
}: VirtualPhoneGridProps) {
  const columnsCount = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP))
  const rowsCount = Math.ceil(phones.length / columnsCount)

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const phoneIndex = rowIndex * columnsCount + columnIndex
      const phone = phones[phoneIndex]

      if (!phone) return null

      return (
        <div style={style}>
          <div style={{ padding: GAP / 2 }}>
            <PhoneCard
              phone={phone}
              onViewDetails={onViewDetails}
              onAddToComparison={onAddToComparison}
              onRemoveFromComparison={onRemoveFromComparison}
              comparisonPhones={comparisonPhones}
              phoneIndex={phoneIndex}
            />
          </div>
        </div>
      )
    },
    [phones, columnsCount, onViewDetails, onAddToComparison, onRemoveFromComparison, comparisonPhones],
  )

  return (
    <Grid
      columnCount={columnsCount}
      columnWidth={CARD_WIDTH + GAP}
      height={containerHeight}
      rowCount={rowsCount}
      rowHeight={CARD_HEIGHT + GAP}
      width={containerWidth}
      itemData={{ phones, columnsCount }}
    >
      {Cell}
    </Grid>
  )
})
