interface AddressComponents {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

export function buildAddressString(components: AddressComponents): string {
  const { street = '', city = '', state = '', country = '', postalCode = '' } = components
  
  const addressParts = [
    street,
    city,
    state,
    country,
    postalCode
  ].filter(Boolean)
  
  return addressParts.join(', ')
}
