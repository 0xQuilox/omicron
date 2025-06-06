/**
 * Utility functions for price conversion and formatting
 */

// Conversion rate from INR to NGN (Nigerian Naira)
export const NAIRA_CONVERSION_RATE = 4.8

/**
 * Converts a price from INR to NGN and formats it
 * @param price - Price in INR (as string or number)
 * @param options - Formatting options
 * @returns Formatted price in NGN
 */
export function formatNairaPrice(
  price: string | number,
  options: {
    showCurrency?: boolean
    decimals?: number
    fallback?: string
  } = {},
): string {
  const { showCurrency = true, decimals = 0, fallback = "N/A" } = options

  // Parse the price to a number
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price

  // Return fallback if price is not a valid number
  if (!numPrice || isNaN(numPrice)) return fallback

  // Convert to Nigerian Naira
  const ngnPrice = numPrice * NAIRA_CONVERSION_RATE

  // Format the price with the specified number of decimal places
  const formattedPrice = ngnPrice.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  // Return with or without currency symbol
  return showCurrency ? `₦${formattedPrice}` : formattedPrice
}

/**
 * Gets the price range description based on the price in NGN
 * @param priceInNaira - Price in NGN
 * @returns Price range description
 */
export function getPriceRange(priceInNaira: number): "budget" | "mid" | "premium" {
  if (priceInNaira < 72000) return "budget"
  if (priceInNaira < 144000) return "mid"
  return "premium"
}

/**
 * Generates simulated price history for a phone
 * @param basePrice - Base price in INR
 * @param days - Number of days of history to generate
 * @returns Array of price points with dates
 */
export function generatePriceHistory(basePrice: number, days = 30) {
  const history = []
  const ngnPrice = basePrice * NAIRA_CONVERSION_RATE

  // Generate price data
  for (let i = days; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 0.1 // ±10% variation
    const price = ngnPrice * (1 + variation)
    history.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: Math.round(price),
    })
  }
  return history
}
