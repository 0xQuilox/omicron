"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNairaPrice, generatePriceHistory, NAIRA_CONVERSION_RATE } from "@/lib/price-utils"

interface PriceTrackerProps {
  currentPrice: string
  phone: string
}

export function PriceTracker({ currentPrice, phone }: PriceTrackerProps) {
  // Parse the price to a number
  const basePrice = Number.parseFloat(currentPrice)

  // Generate price history using the utility function
  const priceHistory = basePrice ? generatePriceHistory(basePrice) : []

  // Calculate current price in Naira
  const currentNairaPrice = basePrice * NAIRA_CONVERSION_RATE

  // Get previous price for comparison
  const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].price : currentNairaPrice

  // Calculate price change
  const priceChange = currentNairaPrice - previousPrice
  const priceChangePercent = previousPrice ? ((priceChange / previousPrice) * 100).toFixed(1) : "0"

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Price Tracker (NGN)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-700">{formatNairaPrice(currentPrice)}</span>
            <div className="flex items-center gap-1">
              {priceChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : priceChange < 0 ? (
                <TrendingDown className="w-4 h-4 text-green-500" />
              ) : (
                <Minus className="w-4 h-4 text-gray-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  priceChange > 0 ? "text-red-500" : priceChange < 0 ? "text-green-500" : "text-gray-500"
                }`}
              >
                {priceChange > 0 ? "+" : ""}
                {priceChangePercent}%
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              30-day price range: ₦{Math.min(...priceHistory.map((p) => p.price)).toLocaleString()} - ₦
              {Math.max(...priceHistory.map((p) => p.price)).toLocaleString()}
            </p>
            <p className="text-xs mt-1">
              *Converted from INR at current exchange rate (1 INR = {NAIRA_CONVERSION_RATE} NGN)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
