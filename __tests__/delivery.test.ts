import {
  calculateDistance,
  calculateDeliveryFee,
  LAGOS_COORDS,
  getDeliveryFee,
  DELIVERY_FEE,
} from "@/lib/utils/delivery"

describe("Delivery Fee Calculation", () => {
  // Test Haversine distance calculation
  describe("calculateDistance", () => {
    it("should return 0 for the same coordinates", () => {
      const distance = calculateDistance(LAGOS_COORDS.lat, LAGOS_COORDS.lon, LAGOS_COORDS.lat, LAGOS_COORDS.lon)
      expect(distance).toBe(0)
    })

    it("should calculate correct distance between Lagos and Abuja", () => {
      // Abuja coordinates: 9.0765° N, 7.3986° E
      const distance = calculateDistance(LAGOS_COORDS.lat, LAGOS_COORDS.lon, 9.0765, 7.3986)
      // Distance between Lagos and Abuja is approximately 450-500 km
      expect(distance).toBeGreaterThan(400)
      expect(distance).toBeLessThan(600)
    })

    it("should calculate correct distance for nearby location in Lagos", () => {
      // Victoria Island: 6.4281° N, 3.4219° E
      const distance = calculateDistance(LAGOS_COORDS.lat, LAGOS_COORDS.lon, 6.4281, 3.4219)
      // Should be less than 20 km within Lagos
      expect(distance).toBeLessThan(20)
    })
  })

  // Test delivery fee calculation
  describe("calculateDeliveryFee", () => {
    const baseFee = 500
    const perKmFee = 100

    it("should return base fee for 0 km distance", () => {
      const fee = calculateDeliveryFee(0, baseFee, perKmFee)
      expect(fee).toBe(baseFee)
    })

    it("should calculate correct fee for 10 km", () => {
      const fee = calculateDeliveryFee(10, baseFee, perKmFee)
      // 500 + (100 * 10) = 1500
      expect(fee).toBe(1500)
    })

    it("should calculate correct fee for 50 km", () => {
      const fee = calculateDeliveryFee(50, baseFee, perKmFee)
      // 500 + (100 * 50) = 5500
      expect(fee).toBe(5500)
    })

    it("should round to nearest integer", () => {
      const fee = calculateDeliveryFee(10.5, baseFee, perKmFee)
      // 500 + (100 * 10.5) = 1550
      expect(fee).toBe(1550)
    })
  })

  describe("getDeliveryFee", () => {
    it("should return the constant delivery fee", () => {
      const fee = getDeliveryFee()
      expect(fee).toBe(DELIVERY_FEE)
    })

    it("should return a positive number", () => {
      const fee = getDeliveryFee()
      expect(fee).toBeGreaterThan(0)
    })

    it("should return the default fee of 1500 when env is not set", () => {
      // Default value is 1500
      const fee = getDeliveryFee()
      expect(fee).toBe(1500)
    })
  })

  // Integration test for full delivery fee from coordinates
  describe("Full delivery calculation", () => {
    it("should calculate delivery fee from customer coordinates", () => {
      const baseFee = 500
      const perKmFee = 100

      // Customer in Ikeja, Lagos: 6.6018° N, 3.3515° E
      const customerLat = 6.6018
      const customerLon = 3.3515

      const distance = calculateDistance(LAGOS_COORDS.lat, LAGOS_COORDS.lon, customerLat, customerLon)
      const fee = calculateDeliveryFee(distance, baseFee, perKmFee)

      // Ikeja is about 10-15 km from Lagos center
      expect(distance).toBeGreaterThan(5)
      expect(distance).toBeLessThan(20)
      expect(fee).toBeGreaterThan(baseFee)
      expect(fee).toBeLessThan(3000)
    })
  })
})
