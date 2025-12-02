/**
 * Delivery fee calculation utilities
 * Uses Haversine formula to calculate distance between two coordinates
 * Simplified to use a constant delivery fee
 */

// Lagos center coordinates
const LAGOS_LAT = 6.5244
const LAGOS_LON = 3.3792

// Delivery fee constants (from environment or defaults)
const BASE_DELIVERY_FEE = Number(process.env.BASE_DELIVERY_FEE) || 500
const PER_KM_FEE = Number(process.env.PER_KM_FEE) || 100

const DELIVERY_FEE = Number(process.env.DELIVERY_FEE) || 1500

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 - Latitude of point 1
 * @param lon1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lon2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Calculate delivery fee based on distance from Lagos
 * @param destinationLat - Destination latitude
 * @param destinationLon - Destination longitude
 * @returns Delivery fee in NGN
 */
export function calculateDeliveryFee(destinationLat: number, destinationLon: number): number {
  const distance = calculateHaversineDistance(LAGOS_LAT, LAGOS_LON, destinationLat, destinationLon)

  // Formula: baseFee + perKm * distance
  const fee = BASE_DELIVERY_FEE + PER_KM_FEE * distance

  // Round to nearest 50 NGN
  return Math.round(fee / 50) * 50
}

/**
 * Get the constant delivery fee
 * @returns Delivery fee in NGN
 */
export function getDeliveryFee(): number {
  return DELIVERY_FEE
}

/**
 * Get the delivery fee with breakdown
 */
export function getDeliveryFeeBreakdown(
  destinationLat: number,
  destinationLon: number,
): {
  distance: number
  baseFee: number
  distanceFee: number
  totalFee: number
} {
  const distance = calculateHaversineDistance(LAGOS_LAT, LAGOS_LON, destinationLat, destinationLon)

  const distanceFee = PER_KM_FEE * distance
  const totalFee = Math.round((BASE_DELIVERY_FEE + distanceFee) / 50) * 50

  return {
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal
    baseFee: BASE_DELIVERY_FEE,
    distanceFee: Math.round(distanceFee),
    totalFee,
  }
}

/**
 * Get the delivery fee with breakdown (simplified)
 */
export function getSimpleDeliveryFeeBreakdown(): {
  deliveryFee: number
  description: string
} {
  return {
    deliveryFee: DELIVERY_FEE,
    description: "Standard delivery within Nigeria",
  }
}

// Export constants for testing
export { LAGOS_LAT, LAGOS_LON, BASE_DELIVERY_FEE, PER_KM_FEE, DELIVERY_FEE }
